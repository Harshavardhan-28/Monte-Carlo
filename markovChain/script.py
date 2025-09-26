import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from scipy import stats
from statsmodels.tsa.stattools import adfuller
import warnings
warnings.filterwarnings('ignore')

def get_transition_matrix(ticker, name):
    """
    Fetches historical data for a given cryptocurrency ticker,
    classifies daily price changes into states (Bull, Neutral, Bear),
    and computes the transition matrix for the Markov chain.
    """
    print(f"Fetching and processing data for {name} ({ticker})...")
    
    # Define the time period for the last year
    end_date = datetime.now()
    start_date = end_date - timedelta(days=365)
    
    # Download historical data
    data = yf.download(ticker, start=start_date, end=end_date)
    
    if data.empty:
        print(f"No data found for {ticker}. Please check the ticker symbol.")
        return None, None

    # Calculate daily percentage change
    data['Daily_Return'] = data['Close'].pct_change()
    
    # Remove NaN values for statistical calculations
    returns_clean = data['Daily_Return'].dropna()
    
    # Check for sufficient data
    if len(returns_clean) < 30:
        print(f"Warning: Only {len(returns_clean)} data points for {name}. Results may be unreliable.")
    
    # Define states based on statistical thresholds (1 standard deviation)
    returns_std = returns_clean.std()
    returns_mean = returns_clean.mean()
    
    # Use statistical thresholds instead of arbitrary 2%
    bull_threshold = returns_mean + returns_std
    bear_threshold = returns_mean - returns_std
    
    print(f"  Statistical thresholds for {name}:")
    print(f"    Bull threshold (mean + 1σ): {bull_threshold:.4f} ({bull_threshold*100:.2f}%)")
    print(f"    Bear threshold (mean - 1σ): {bear_threshold:.4f} ({bear_threshold*100:.2f}%)")
    print(f"    Return std deviation: {returns_std:.4f}")
    
    # Test for stationarity using Augmented Dickey-Fuller test
    adf_statistic, adf_pvalue, adf_usedlag, adf_nobs, adf_critical_values, adf_icbest = adfuller(returns_clean)
    is_stationary = adf_pvalue < 0.05
    print(f"  Stationarity test (ADF): {'Stationary' if is_stationary else 'Non-stationary'} (p-value: {adf_pvalue:.4f})")
    if not is_stationary:
        print(f"    Warning: Time series may not be stationary. Markov assumption may be violated.")
    
    def assign_state(return_val):
        if return_val > bull_threshold:
            return 'Bull'
        elif return_val < bear_threshold:
            return 'Bear'
        else:
            return 'Neutral'
            
    # Assign a state to each day
    data['State'] = data['Daily_Return'].apply(assign_state)
    
    # Drop the first row as it has no return value
    state_sequence = data['State'].dropna().tolist()
    
    # Define the possible states
    states = ['Bull', 'Neutral', 'Bear']
    state_map = {state: i for i, state in enumerate(states)}
    
    # Create a transition count matrix
    transition_counts = np.zeros((len(states), len(states)))
    
    for i in range(len(state_sequence) - 1):
        from_state = state_map[state_sequence[i]]
        to_state = state_map[state_sequence[i+1]]
        transition_counts[from_state, to_state] += 1
        
    # Normalize the counts to get probabilities
    # Add a small epsilon to avoid division by zero if a state never occurs
    row_sums = transition_counts.sum(axis=1, keepdims=True)
    transition_matrix = transition_counts / (row_sums + 1e-9)
    
    # Calculate confidence intervals for transition probabilities
    confidence_intervals = np.zeros((len(states), len(states), 2))
    alpha = 0.05  # 95% confidence interval
    
    for i in range(len(states)):
        n = int(row_sums[i, 0])  # Total transitions from state i
        if n > 0:
            for j in range(len(states)):
                k = int(transition_counts[i, j])  # Successes (transitions to state j)
                if k > 0 and n > k:
                    # Use Wilson score interval for binomial proportions
                    z = stats.norm.ppf(1 - alpha/2)
                    p = k / n
                    denominator = 1 + z**2/n
                    centre = (p + z**2/(2*n)) / denominator
                    delta = z * np.sqrt((p*(1-p) + z**2/(4*n))/n) / denominator
                    confidence_intervals[i, j, 0] = max(0, centre - delta)
                    confidence_intervals[i, j, 1] = min(1, centre + delta)
                else:
                    confidence_intervals[i, j, :] = [0, 0]
    
    return states, transition_matrix, confidence_intervals

# --- Main execution ---

# Define the tickers for the cryptocurrencies
# Replaced USDC with SOL for a more volatile asset. Using WBTC as a proxy for RBTC.
tickers = {
    'SOL': 'SOL-USD',
    'RBTC': 'WBTC-USD',
    'ETH': 'ETH-USD'
}

crypto_data = {}

# Process each cryptocurrency
for name, ticker in tickers.items():
    result = get_transition_matrix(ticker, name)
    if result and len(result) == 3:
        states, matrix, confidence_intervals = result
        if states and matrix is not None:
            crypto_data[name] = {
                'states': states,
                'transition_matrix': matrix,
                'confidence_intervals': confidence_intervals
            }
    print("-" * 30)

# --- Display the results ---

# Print the generated matrices for each crypto
for name, data in crypto_data.items():
    print(f"\n--- {name} Data (Derived from past year's daily data) ---")
    print(f"States: {data['states']}")
    print("Transition Matrix (From -> To):")
    # Formatting the matrix for better readability
    matrix_df = pd.DataFrame(data['transition_matrix'], index=data['states'], columns=data['states'])
    print(matrix_df.round(4))
    
    print("\n95% Confidence Intervals for Transition Probabilities:")
    for i, from_state in enumerate(data['states']):
        for j, to_state in enumerate(data['states']):
            ci_lower = data['confidence_intervals'][i, j, 0]
            ci_upper = data['confidence_intervals'][i, j, 1]
            prob = data['transition_matrix'][i, j]
            if prob > 0:
                print(f"  {from_state} → {to_state}: {prob:.4f} [{ci_lower:.4f}, {ci_upper:.4f}]")
    
# Example of how to interpret the data
if 'SOL' in crypto_data:
    bear_to_bear_prob = crypto_data['SOL']['transition_matrix'][2, 2]
    print(f"\nExample: The historical probability of Solana transitioning from a 'Bear' day to another 'Bear' day over the past year was {bear_to_bear_prob:.2%}.")