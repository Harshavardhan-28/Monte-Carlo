# Synapse Protocol: Hackathon Edition

This is a streamlined version of the Synapse Protocol specifically optimized for hackathon demonstration. It features autonomous agents for trading decisions and a Gemini-powered chat interface.

## System Architecture

The system follows a linear flow:
1. **Chat Agent** (`chat_agent.py`) - Gemini-powered conversation interface that translates user requests to JSON commands
2. **Markov Model Agent** (`simplified_markov_model.py`) - Analyzes asset price data using Markov models
3. **Strategic Planner Agent** (`simplified_strategic_planner.py`) - Creates optimal trading strategies based on Markov data
4. **Position Manager Agent** (`simplified_position_manager.py`) - Executes trades and manages scheduled swaps
5. **Blockchain Agent** (`simplified_blockchain.py`) - Handles blockchain operations with mock mode support

## Getting Started

### 1. Setup Environment

Run the environment setup script to configure mock mode (no real blockchain needed):
```
python setup_environment.py
```

This will create a `.env` file with mock blockchain settings, or you can manually create one:
```
MOCK_MODE=true
PRIVATE_KEY=0xbc372b58412fff8871b5c963ef36cdd56fcd750a93905126ae86c897c32e6cd3
RPC_URL=https://public-node.testnet.rsk.co
CONTRACT_ADDRESS=0xdf16ac632641f579e78268753213ac85ecb9fd14
AGENT_SEED=blockchain_agent_seed_phrase
GEMINI_API_KEY=your_gemini_api_key  # Required for chat agent
```

### 2. Install Dependencies

### 3. Demo Transaction for Judges

#### Simplified Demo (Recommended for Hackathon)

For the simplest demonstration of our transaction capabilities:

```
python demo_transaction_simulation.py
```

This script will simulate a complete transaction flow, showing:
- Position Manager trading decisions
- Blockchain transaction execution
- Transaction receipts and confirmation
- Scheduled future swaps

This demo requires no actual blockchain connectivity and is perfect for hackathon presentations.

#### Full System Demo (Requires Agent Setup)

For a more comprehensive demo with all agents running:

1. Start the blockchain agent:
   ```
   python simplified_blockchain.py
   ```

2. Copy the blockchain agent's address displayed in the console output.

3. Update your .env file with the blockchain agent's address:
   ```
   python update_blockchain_address.py agent1q...
   ```

4. In a separate terminal, run the demo transaction script:
   ```
   python demo_transaction.py
   ```

⚠️ **Note for Judges:** Both demonstrations show how our system can schedule and execute blockchain transactions. In mock mode, no real blockchain interactions occur, but the complete flow is demonstrated with simulated transaction hashes.

Edit the `ASSETS` dictionary in `enhanced_position_manager_agent.py` to include your actual token addresses:

```python
ASSETS = {
    "BTC": {"ticker": "BTC-USD", "address": "0x...YourMcBtcTokenAddress..."},
    "ETH": {"ticker": "ETH-USD", "address": "0x...YourMcEthTokenAddress..."},
    "LTC": {"ticker": "LTC-USD", "address": "0x...YourMcLtcTokenAddress..."}
}
```

### 3. Start the Agents

On Windows, run:
```
start_all_agents.bat
```

On Linux/macOS, run:
```
bash start_all_agents.sh
```

This will start all agents in separate terminal windows.

### 4. Copy Agent Addresses

After starting each agent, note the addresses displayed in the terminal. You'll need to update these addresses in:

- `enhanced_position_manager_agent.py`
- `enhanced_strategic_planner_agent.py`

### 5. Testing

Run the automated tests:
```
python test_synapse_agents.py
```

Use the test client to manually trigger actions:
```
python test_client.py
```

## How It Works

1. The Markov Model Agent analyzes market data and builds transition matrices
2. The Strategic Planner translates these matrices into trading signals
3. The Position Manager creates actionable token swap commands based on signals
4. The Blockchain Agent executes the swaps on the blockchain

## Important Functions

- `tool_swap_tokens`: Executes token swaps on the blockchain
- `tool_get_balances`: Retrieves current token balances from the pool contract
- `execute_portfolio_decision`: Translates strategic decisions into concrete blockchain commands
- `check_scheduled_swaps`: Periodic function that executes scheduled swaps based on Markov predictions

## Scheduled Swaps

The system uses time-based execution to perform swaps on the days predicted by the Markov model:

1. The Position Manager schedules swaps based on predictions
2. The `check_scheduled_swaps` function runs twice daily to check for scheduled swaps
3. When a scheduled swap date matches the current date, the swap is executed automatically

## Testing and Validation

- Unit tests ensure each component works correctly in isolation
- Integration tests validate the complete system workflow
- The test client allows manual triggering of swaps and other functions

## Troubleshooting

- Check the terminal output for each agent to diagnose issues
- Verify that agent addresses are correctly updated across all files
- Ensure your `.env` file contains valid credentials for blockchain interactions
- Confirm that token addresses in `enhanced_position_manager_agent.py` are correct