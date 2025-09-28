import os
import json
from dotenv import load_dotenv
from web3 import Web3
from uagents import Agent, Context, Model

# --- Configuration ---
load_dotenv()
PRIVATE_KEY = os.getenv("PRIVATE_KEY")
RPC_URL = os.getenv("RPC_URL")
CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS")
AGENT_SEED = os.getenv("AGENT_SEED", "blockchain_agent_seed_phrase")

# --- Define a unique port for this agent ---
AGENT_PORT = 8007  # Changed port to avoid conflicts

# --- Web3 Setup ---
w3 = Web3(Web3.HTTPProvider(RPC_URL))
account = w3.eth.account.from_key(PRIVATE_KEY)
checksum_contract_address = w3.to_checksum_address(CONTRACT_ADDRESS)

# --- Smart Contract ABI ---
CONTRACT_ABI = json.loads('''
[
	{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" },
	{ "inputs": [], "name": "RAS_PORTAL_ADDRESS", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" },
	{ "inputs": [], "name": "SWAP_SCHEMA_UID", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" },
	{ "inputs": [], "name": "btc", "outputs": [ { "internalType": "contract mcBTC", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" },
	{ "inputs": [], "name": "eth", "outputs": [ { "internalType": "contract mcETH", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" },
	{ "inputs": [], "name": "getBalances", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" },
	{ "inputs": [], "name": "initialLiquidity", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" },
	{ "inputs": [], "name": "ltc", "outputs": [ { "internalType": "contract mcLTC", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" },
	{ "inputs": [], "name": "portal", "outputs": [ { "internalType": "contract IPortal", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" },
	{ "inputs": [ { "internalType": "address", "name": "tokenIn", "type": "address" }, { "internalType": "address", "name": "tokenOut", "type": "address" }, { "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "rate", "type": "uint256" } ], "name": "swapMint", "outputs": [], "stateMutability": "nonpayable", "type": "function" }
]
''')
pool_contract = w3.eth.contract(address=checksum_contract_address, abi=CONTRACT_ABI)


# --- Agent Message Models ---
class BlockchainCommand(Model):
    command: str
    params: dict

class BlockchainResponse(Model):
    success: bool
    data: dict
    message: str


# --- Define functions for each on-chain action ---

def tool_swap_tokens(ctx: Context, params: dict):
    """Tool to execute the swapMint function."""
    ctx.logger.info("Executing 'swap' tool.")
    try:
        # Mock mode for hackathon - doesn't require real blockchain connection
        mock_mode = os.getenv("MOCK_MODE", "false").lower() == "true"
        
        if mock_mode:
            ctx.logger.info("🔄 Running in MOCK MODE - simulating blockchain transaction")
            tx_hash = f"0x{''.join(['0123456789abcdef'[i % 16] for i in range(64)])}"
            ctx.logger.info(f"✅ Simulated swap transaction: {tx_hash}")
            return {
                "tx_hash": tx_hash, 
                "token_in": params['token_in'], 
                "token_out": params['token_out']
            }
        
        # Real blockchain interaction
        nonce = w3.eth.get_transaction_count(account.address)
        tx = pool_contract.functions.swapMint(
            w3.to_checksum_address(params['token_in']),
            w3.to_checksum_address(params['token_out']),
            int(params['amount_in']),
            int(params['rate'])
        ).build_transaction({
            'from': account.address,
            'nonce': nonce,
            'gas': 300000,
            'gasPrice': w3.eth.gas_price,
        })
        signed_tx = w3.eth.account.sign_transaction(tx, private_key=PRIVATE_KEY)
        tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        ctx.logger.info(f"✅ Swap transaction sent: {tx_hash.hex()}")
        return {"tx_hash": tx_hash.hex(), "token_in": params['token_in'], "token_out": params['token_out']}
    except Exception as e:
        ctx.logger.error(f"❌ Error during swap: {e}")
        raise e

def tool_get_balances(ctx: Context, params: dict):
    """Tool to call the getBalances view function."""
    ctx.logger.info("Executing 'get_balances' tool.")
    try:
        # Mock mode for hackathon
        mock_mode = os.getenv("MOCK_MODE", "false").lower() == "true"
        
        if mock_mode:
            ctx.logger.info("🔄 Running in MOCK MODE - returning mock balances")
            # Generate some random-ish but consistent balances
            import hashlib
            import time
            
            # Use the day to keep balances consistent throughout the day
            day_of_year = int(time.strftime("%j"))
            seed = f"synapse_{day_of_year}"
            hash_val = int(hashlib.md5(seed.encode()).hexdigest(), 16)
            
            # Generate "random" balances between 1 and 20 for each asset
            btc_balance = (hash_val % 20 + 1) * 10**18
            eth_balance = ((hash_val >> 32) % 20 + 1) * 10**18
            ltc_balance = ((hash_val >> 64) % 20 + 1) * 10**18
            
            ctx.logger.info(f"Mock balances (BTC, ETH, LTC): {btc_balance}, {eth_balance}, {ltc_balance}")
            return {
                "balances": {
                    "BTC": btc_balance,
                    "ETH": eth_balance,
                    "LTC": ltc_balance
                }
            }
        
        # Real blockchain interaction
        balances = pool_contract.functions.getBalances().call()
        ctx.logger.info(f"Pool balances (BTC, ETH, LTC): {balances}")
        # Return the balances in a structured format
        return {
            "balances": {
                "BTC": balances[0],
                "ETH": balances[1],
                "LTC": balances[2]
            }
        }
    except Exception as e:
        ctx.logger.error(f"❌ Error getting balances: {e}")
        raise e


# --- Create the Agent and the Tool Dispatcher ---

agent = Agent(
    name="blockchain_agent",
    port=AGENT_PORT,
    seed=AGENT_SEED,
    endpoint=[f"http://127.0.0.1:{AGENT_PORT}/submit"]
)

# This dictionary maps command names to the actual tool functions
TOOL_REGISTRY = {
    "swap": tool_swap_tokens,
    "get_balances": tool_get_balances,
}

@agent.on_event("startup")
async def startup(ctx: Context):
    """This function runs ONCE when the agent starts."""
    ctx.logger.info(f"Blockchain Agent starting...")
    ctx.logger.info(f"My address is: {agent.address}")
    ctx.logger.info(f"My wallet address for transactions is: {account.address}")
    
    # Log if we're in mock mode
    mock_mode = os.getenv("MOCK_MODE", "false").lower() == "true"
    if mock_mode:
        ctx.logger.info("⚠️ Running in MOCK MODE - no real transactions will be executed")
    else:
        ctx.logger.info("🔗 Running with REAL blockchain connection")
        
    # For hackathon demo purposes, print in a way that's easy to copy for the demo
    ctx.logger.info("\n" + "="*50)
    ctx.logger.info("⭐ COPY THIS ADDRESS FOR DEMO TRANSACTION SCRIPT:")
    ctx.logger.info(f"BLOCKCHAIN_AGENT_ADDRESS=\"{agent.address}\"")
    ctx.logger.info("="*50 + "\n")

@agent.on_message(model=BlockchainCommand, replies=BlockchainResponse)
async def command_dispatcher(ctx: Context, sender: str, msg: BlockchainCommand):
    """
    This function runs EVERY TIME a BlockchainCommand message is received.
    It contains the logic to handle the message and sends back confirmation.
    """
    ctx.logger.info(f"Received command '{msg.command}' from agent {sender}")
    tool_function = TOOL_REGISTRY.get(msg.command)
    if tool_function:
        try:
            result = tool_function(ctx, msg.params)
            await ctx.send(sender, BlockchainResponse(
                success=True,
                data=result,
                message=f"Successfully executed {msg.command}"
            ))
        except Exception as e:
            ctx.logger.error(f"Error in '{msg.command}': {e}")
            await ctx.send(sender, BlockchainResponse(
                success=False,
                data={"command": msg.command},
                message=f"Error executing {msg.command}: {str(e)}"
            ))
    else:
        ctx.logger.error(f"Unknown command '{msg.command}'. No tool found.")
        await ctx.send(sender, BlockchainResponse(
            success=False,
            data={"command": msg.command},
            message=f"Unknown command '{msg.command}'. No tool found."
        ))

if __name__ == "__main__":
    agent.run()