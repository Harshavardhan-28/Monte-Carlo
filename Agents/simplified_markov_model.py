import os
import numpy as np
import yfinance as yf
from datetime import datetime, timedelta
from uagents import Agent, Context, Model, Protocol
from uagents.setup import fund_agent_if_low
from dotenv import load_dotenv
import warnings

warnings.filterwarnings('ignore')

class EnhancedMatrixRequest(Model):
    ticker: str
    name: str

class EnhancedMatrixResponse(Model):
    asset_name: str
    transition_matrix: list[list[float]]
    states: list[str]
    last_known_state: str
    state_returns: dict[str, float]
    # Enhanced fields
    state_volatility: dict[str, float]
    trend_momentum: float
    confidence_score: float
    expected_return_30d: float
    risk_score: float
    relative_strength: float

def get_enhanced_transition_matrix(ticker, name, mock_mode=False):
    """Enhanced version that provides more business-relevant metrics"""
    print(f"Fetching and analyzing comprehensive data for {name} ({ticker})...")

    if mock_mode:
        print(f"🔄 Running in MOCK MODE - generating synthetic data for {name}")
        # Generate mock transition matrix data
        
        # Create mock states
        states = ['Bull', 'Neutral', 'Bear']
        
        # Create a mock transition matrix
        if name == "BTC":
            # Biased toward Bull for BTC in mock mode
            transition_matrix = np.array([
                [0.7, 0.2, 0.1],  # Bull -> Bull (70%), Neutral (20%), Bear (10%)
                [0.4, 0.5, 0.1],  # Neutral -> Bull (40%), Neutral (50%), Bear (10%) 
                [0.3, 0.4, 0.3]   # Bear -> Bull (30%), Neutral (40%), Bear (30%)
            ])
            trend_momentum = 0.6
            risk_score = 0.7
        elif name == "ETH":
            # Neutral bias for ETH
            transition_matrix = np.array([
                [0.5, 0.3, 0.2],
                [0.3, 0.5, 0.2],
                [0.2, 0.4, 0.4]
            ])
            trend_momentum = 0.2
            risk_score = 0.5
        else:  # LTC or other
            # Slight bear bias for LTC
            transition_matrix = np.array([
                [0.4, 0.3, 0.3],
                [0.2, 0.5, 0.3],
                [0.1, 0.3, 0.6]
            ])
            trend_momentum = -0.3
            risk_score = 0.6
        
        # Generate mock state returns
        state_returns = {
            'Bull': 0.02,
            'Neutral': 0.003,
            'Bear': -0.015
        }
        
        # Generate mock state volatility
        state_volatility = {
            'Bull': 0.04,
            'Neutral': 0.02,
            'Bear': 0.05
        }
        
        # Mock values for other metrics
        last_state = states[np.random.choice([0, 1, 2], p=[0.4, 0.4, 0.2])]
        confidence_score = 0.8
        expected_return_30d = 0.05 if name == "BTC" else (0.03 if name == "ETH" else 0.01)
        relative_strength = 0.6 if name == "BTC" else (0.3 if name == "ETH" else -0.2)
        
        return (states, transition_matrix, last_state, state_returns, 
                state_volatility, trend_momentum, confidence_score, expected_return_30d, 
                risk_score, relative_strength)
    
    try:
        # Real data processing
        end_date = datetime.now()
        start_date = end_date - timedelta(days=365)
        data = yf.download(ticker, start=start_date, end=end_date, progress=False)
        
        if data.empty: 
            return None, None, None, None, None, None, None, None, None, None
        
        # Calculate returns and technical indicators
        data['Daily_Return'] = data['Close'].pct_change()
        data['SMA_20'] = data['Close'].rolling(window=20).mean()
        data['SMA_50'] = data['Close'].rolling(window=50).mean()
        data['Volatility_20'] = data['Daily_Return'].rolling(window=20).std()
        
        returns_clean = data['Daily_Return'].dropna()
        
        if len(returns_clean) < 30: 
            return None, None, None, None, None, None, None, None, None, None

        # Enhanced state definition with volatility consideration
        returns_std = returns_clean.std()
        returns_mean = returns_clean.mean()
        
        # Dynamic thresholds based on recent volatility
        recent_volatility = data['Volatility_20'].iloc[-20:].mean()
        volatility_multiplier = max(0.5, min(2.0, recent_volatility / returns_std))
        
        bull_threshold = returns_mean + (returns_std * volatility_multiplier)
        bear_threshold = returns_mean - (returns_std * volatility_multiplier)
        
        def assign_state(return_val):
            if return_val > bull_threshold: return 'Bull'
            elif return_val < bear_threshold: return 'Bear'
            else: return 'Neutral'
            
        data['State'] = data['Daily_Return'].apply(assign_state)
        state_sequence = data['State'].dropna().tolist()
        states = ['Bull', 'Neutral', 'Bear']
        state_map = {state: i for i, state in enumerate(states)}
        
        # Build transition matrix with MLE
        transition_counts = np.zeros((len(states), len(states)))
        
        for i in range(len(state_sequence) - 1):
            from_state = state_map[state_sequence[i]]
            to_state = state_map[state_sequence[i+1]]
            transition_counts[from_state, to_state] += 1
        
        alpha = 0.1
        row_sums = transition_counts.sum(axis=1, keepdims=True)
        transition_matrix = (transition_counts + alpha) / (row_sums + alpha * len(states))
        
        # Calculate enhanced metrics
        state_returns = data.groupby('State')['Daily_Return'].mean().to_dict()
        state_volatility = data.groupby('State')['Daily_Return'].std().to_dict()
        
        # Fill missing states
        for state in states:
            if state not in state_returns:
                state_returns[state] = 0.0
            if state not in state_volatility:
                state_volatility[state] = returns_std
        
        # Calculate business metrics
        current_price = data['Close'].iloc[-1]
        sma_20 = data['SMA_20'].iloc[-1]
        sma_50 = data['SMA_50'].iloc[-1]
        
        # Trend momentum (-1 to 1)
        trend_momentum = 0.0
        if not np.isnan(sma_20) and not np.isnan(sma_50):
            if sma_20 > sma_50 * 1.02:  # Strong uptrend
                trend_momentum = min(1.0, (sma_20 / sma_50 - 1) * 10)
            elif sma_20 < sma_50 * 0.98:  # Strong downtrend
                trend_momentum = max(-1.0, (sma_20 / sma_50 - 1) * 10)
            else:  # Sideways
                trend_momentum = (sma_20 / sma_50 - 1) * 5
        
        # Expected 30-day return based on current state and transitions
        current_state = state_sequence[-1] if state_sequence else 'Neutral'
        current_state_idx = state_map[current_state]
        
        # Simulate 30 days forward
        expected_return_30d = 0.0
        state_probs = np.array([0.0, 0.0, 0.0])
        state_probs[current_state_idx] = 1.0
        
        for day in range(30):
            state_probs = state_probs @ transition_matrix
            daily_expected_return = sum(state_probs[i] * state_returns[states[i]] for i in range(len(states)))
            expected_return_30d += daily_expected_return
        
        # Confidence score based on data quality and state stability
        confidence_score = min(1.0, len(returns_clean) / 300)  # More data = higher confidence
        
        # Risk score (0 = low risk, 1 = high risk)
        current_volatility = recent_volatility
        risk_score = min(1.0, current_volatility / (returns_std * 2))
        
        # Relative strength vs market (simplified - comparing to overall mean)
        recent_returns = returns_clean.iloc[-30:].mean()
        relative_strength = recent_returns / abs(returns_mean) if returns_mean != 0 else 0.0
        
        print(f"    Enhanced Analysis for {name}:")
        print(f"      Current State: {current_state}")
        print(f"      Trend Momentum: {trend_momentum:.3f}")
        print(f"      Expected 30d Return: {expected_return_30d:.4f}")
        print(f"      Risk Score: {risk_score:.3f}")
        print(f"      Relative Strength: {relative_strength:.3f}")
        
        return (states, transition_matrix, state_sequence[-1], state_returns, 
                state_volatility, trend_momentum, confidence_score, expected_return_30d, 
                risk_score, relative_strength)
                
    except Exception as e:
        print(f"Error analyzing {name}: {e}")
        return None, None, None, None, None, None, None, None, None, None

# --- Enhanced Agent Setup ---
load_dotenv()
AGENT_PORT = 8000
AGENT_SEED = os.getenv("MARKOV_MODEL_SEED", "markov_model_secret_seed_phrase")
AGENT_NAME = "simplified_markov_model_agent"
MOCK_MODE = os.getenv("MOCK_MODE", "false").lower() == "true"

agent = Agent(
    name=AGENT_NAME,
    port=AGENT_PORT,
    seed=AGENT_SEED,
    endpoint=[f"http://127.0.0.1:{AGENT_PORT}/submit"]
)

data_protocol = Protocol("EnhancedMarkovData")

@data_protocol.on_message(model=EnhancedMatrixRequest, replies=EnhancedMatrixResponse)
async def on_enhanced_matrix_request(ctx: Context, sender: str, msg: EnhancedMatrixRequest):
    ctx.logger.info(f"Received enhanced matrix request for {msg.name} from {sender}")
    
    result = get_enhanced_transition_matrix(msg.ticker, msg.name, mock_mode=MOCK_MODE)
    
    if result[0] is None:  # No data
        await ctx.send(sender, EnhancedMatrixResponse(
            asset_name=msg.name, 
            transition_matrix=[], 
            states=[], 
            last_known_state="Error", 
            state_returns={},
            state_volatility={},
            trend_momentum=0.0,
            confidence_score=0.0,
            expected_return_30d=0.0,
            risk_score=1.0,
            relative_strength=0.0
        ))
        return
    
    (states, matrix, last_state, state_returns, state_volatility, 
     trend_momentum, confidence_score, expected_return_30d, 
     risk_score, relative_strength) = result
    
    await ctx.send(sender, EnhancedMatrixResponse(
        asset_name=msg.name,
        transition_matrix=matrix.tolist(),
        states=states,
        last_known_state=last_state,
        state_returns=state_returns,
        state_volatility=state_volatility,
        trend_momentum=trend_momentum,
        confidence_score=confidence_score,
        expected_return_30d=expected_return_30d,
        risk_score=risk_score,
        relative_strength=relative_strength
    ))

agent.include(data_protocol)

@agent.on_event("startup")
async def startup(ctx: Context):
    ctx.logger.info(f"{AGENT_NAME} starting...")
    ctx.logger.info(f"My address is: {agent.address}")
    fund_agent_if_low(agent.wallet.address())
    
    if MOCK_MODE:
        ctx.logger.info("⚠️ Running in MOCK MODE - will generate synthetic data")
    else:
        ctx.logger.info("Running with real data from Yahoo Finance")

if __name__ == "__main__":
    print(f"Starting {AGENT_NAME} on http://127.0.0.1:{AGENT_PORT}")
    print(f"My address is: {agent.address}")
    print(f"Mock mode: {'ENABLED' if MOCK_MODE else 'DISABLED'}")
    agent.run()