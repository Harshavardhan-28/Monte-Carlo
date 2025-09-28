"""
This script sets up the environment variables for the Synapse Protocol hackathon project.
It enables mock mode so no real blockchain connection is needed.
"""
import os
from dotenv import load_dotenv, set_key

def main():
    print("Setting up mock blockchain mode...")

    # Check if .env exists, create if not
    if not os.path.exists('.env'):
        with open('.env', 'w') as f:
            f.write("# Synapse Protocol Environment Variables\n")

    # Load current environment
    load_dotenv()

    # Update .env file with mock mode
    set_key('.env', 'MOCK_MODE', 'true')
    
    # Dummy blockchain settings for mock mode
    set_key('.env', 'PRIVATE_KEY', '0xbc372b58412fff8871b5c963ef36cdd56fcd750a93905126ae86c897c32e6cd3')
    set_key('.env', 'RPC_URL', 'https://public-node.testnet.rsk.co')
    set_key('.env', 'CONTRACT_ADDRESS', '0xdf16ac632641f579e78268753213ac85ecb9fd14')
    
    # Set agent seeds
    set_key('.env', 'AGENT_SEED', 'blockchain_agent_seed_phrase')
    set_key('.env', 'CHAT_AGENT_SEED', 'chat_agent_secret_seed_phrase')
    set_key('.env', 'STRATEGIC_PLANNER_SEED', 'strategic_planner_secret_seed')
    set_key('.env', 'POSITION_MANAGER_SEED', 'position_manager_secret_seed_phrase')
    set_key('.env', 'MARKOV_MODEL_SEED', 'markov_model_secret_seed_phrase')
    
    # Check for Gemini API key
    gemini_key = os.getenv('GEMINI_API_KEY')
    if not gemini_key:
        print("⚠️ GEMINI_API_KEY not found.")
        print("To use the chat agent, please set your Gemini API key:")
        api_key = input("Enter your Gemini API Key (press Enter to skip): ").strip()
        if api_key:
            set_key('.env', 'GEMINI_API_KEY', api_key)
            print("Gemini API key saved to .env file.")
        else:
            print("No Gemini API key provided. Chat agent will operate in limited mode.")
    
    print("✅ Mock mode enabled successfully!")
    print("You can now run the agents in mock mode without needing a real blockchain connection.")

if __name__ == "__main__":
    main()

# Add mock mode flag
modified_content = content.replace(
    "# --- Configuration ---\nload_dotenv()",
    "# --- Configuration ---\nload_dotenv()\n\n# Enable mock mode (no real blockchain connection needed)\nMOCK_MODE = True"
)

# Modify Web3 setup section
mock_web3_setup = """# --- Web3 Setup ---
if MOCK_MODE:
    # Mock web3 setup for testing without blockchain
    print("⚠️ Running in MOCK MODE - No real blockchain connection!")
    
    class MockWeb3:
        def __init__(self):
            self.eth = MockEth()
            
        def to_checksum_address(self, addr):
            return addr
    
    class MockEth:
        def __init__(self):
            self.account = MockAccount()
            self.gas_price = 20000000000
            
        def get_transaction_count(self, addr):
            return 1
    
    class MockAccount:
        def __init__(self):
            self.address = "0xMockAddress"
            
        def from_key(self, key):
            return MockAccountInstance()
            
        def sign_transaction(self, tx, private_key):
            return MockSignedTx()
    
    class MockAccountInstance:
        def __init__(self):
            self.address = "0xMockAddress"
    
    class MockSignedTx:
        def __init__(self):
            self.rawTransaction = b'0x1234'
    
    class MockContract:
        def __init__(self):
            pass
            
        def functions(self):
            return self
            
        def getBalances(self):
            return MockCallable([100 * 10**18, 200 * 10**18, 300 * 10**18])
            
        def swapMint(self, token_in, token_out, amount_in, rate):
            return MockSwapCallable()
    
    class MockCallable:
        def __init__(self, return_value):
            self.return_value = return_value
            
        def call(self):
            return self.return_value
    
    class MockSwapCallable:
        def build_transaction(self, params):
            return {"test": "tx"}
    
    # Set up mock objects
    w3 = MockWeb3()
    account = MockAccountInstance()
    pool_contract = MockContract()
else:
    # Real web3 setup
    w3 = Web3(Web3.HTTPProvider(RPC_URL))
    account = w3.eth.account.from_key(PRIVATE_KEY)
    checksum_contract_address = w3.to_checksum_address(CONTRACT_ADDRESS)
    pool_contract = w3.eth.contract(address=checksum_contract_address, abi=CONTRACT_ABI)
"""

# Replace the Web3 setup section
modified_content = re.sub(
    r"# --- Web3 Setup ---\nw3 = Web3\(Web3\.HTTPProvider\(RPC_URL\)\).*?pool_contract = w3\.eth\.contract\(address=checksum_contract_address, abi=CONTRACT_ABI\)",
    mock_web3_setup,
    modified_content,
    flags=re.DOTALL
)

# Write the modified content back
with open("blockchain_mock.py", "w") as f:
    f.write(modified_content)

print("✅ Created blockchain_mock.py with mock mode enabled")
print("You can use this file instead of blockchain.py for testing without a blockchain connection")
print("To use it, rename it to blockchain.py or update your import statements")