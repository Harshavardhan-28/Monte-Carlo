import uvicorn
from uagents import Agent, Context, Model, Protocol
import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from scipy import stats
from statsmodels.tsa.stattools import adfuller
import warnings

warnings.filterwarnings('ignore')

# --- Markov Chain Function (Unchanged) ---
def get_transition_matrix(ticker, name):
    print(f"Fetching and processing data for {name} ({ticker})...")
    end_date = datetime.now()
    start_date = end_date - timedelta(days=365)
    data = yf.download(ticker, start=start_date, end=end_date)
    
    if data.empty: return None, None, None, None
    
    data['Daily_Return'] = data['Close'].pct_change()
    returns_clean = data['Daily_Return'].dropna()
    
    if len(returns_clean) < 30: return None, None, None, None

    returns_std = returns_clean.std()
    returns_mean = returns_clean.mean()
    bull_threshold = returns_mean + returns_std
    bear_threshold = returns_mean - returns_std
    
    def assign_state(return_val):
        if return_val > bull_threshold: return 'Bull'
        elif return_val < bear_threshold: return 'Bear'
        else: return 'Neutral'
        
    data['State'] = data['Daily_Return'].apply(assign_state)
    state_sequence = data['State'].dropna().tolist()
    states = ['Bull', 'Neutral', 'Bear']
    state_map = {state: i for i, state in enumerate(states)}
    transition_counts = np.zeros((len(states), len(states)))
    
    for i in range(len(state_sequence) - 1):
        from_state = state_map[state_sequence[i]]
        to_state = state_map[state_sequence[i+1]]
        transition_counts[from_state, to_state] += 1
        
    row_sums = transition_counts.sum(axis=1, keepdims=True)
    transition_matrix = transition_counts / (row_sums + 1e-9)
    
    state_returns = data.groupby('State')['Daily_Return'].mean().to_dict()
    
    for state in states:
        if state not in state_returns:
            state_returns[state] = 0.0
    
    return states, transition_matrix, state_sequence[-1], state_returns

# --- Agent Setup ---
AGENT_PORT = 8000
AGENT_SEED = "markov_model_secret_seed_phrase"
AGENT_NAME = "markov_model_agent"

agent = Agent(
    name=AGENT_NAME,
    port=AGENT_PORT,
    seed=AGENT_SEED,
    endpoint=[f"http://127.0.0.1:{AGENT_PORT}/submit"],
    mailbox=f"{AGENT_SEED}@agentverse.ai", # THE FIX IS HERE
)

# --- Define the Messages for Communication ---
class MatrixRequest(Model):
    ticker: str
    name: str

class MatrixResponse(Model):
    asset_name: str
    transition_matrix: list[list[float]]
    states: list[str]
    last_known_state: str
    state_returns: dict[str, float]

data_protocol = Protocol("MarkovData")

@data_protocol.on_message(model=MatrixRequest, replies=MatrixResponse)
async def on_matrix_request(ctx: Context, sender: str, msg: MatrixRequest):
    ctx.logger.info(f"Received matrix request for {msg.name} from {sender}")
    states, matrix, last_state, state_returns = get_transition_matrix(msg.ticker, msg.name)
    if matrix is None:
        await ctx.send(sender, MatrixResponse(asset_name=msg.name, transition_matrix=[], states=[], last_known_state="Error", state_returns={}))
        return
    await ctx.send(sender, MatrixResponse(
        asset_name=msg.name,
        transition_matrix=matrix.tolist(),
        states=states,
        last_known_state=last_state,
        state_returns=state_returns
    ))

agent.include(data_protocol)

if __name__ == "__main__":
    print(f"Starting {AGENT_NAME} on http://127.0.0.1:{AGENT_PORT}")
    print(f"My address is: {agent.address}")
    agent.run()