"""
This script updates the .env file with the blockchain agent's address.
Run this after starting the blockchain agent to make it easy to demo transactions.
"""
import os
import sys
from dotenv import load_dotenv, set_key

def main():
    if len(sys.argv) < 2:
        print("Usage: python update_blockchain_address.py <blockchain_agent_address>")
        return
    
    # Get the blockchain agent address from command line
    blockchain_address = sys.argv[1]
    
    print(f"Updating .env with blockchain agent address: {blockchain_address}")
    
    # Check if .env exists, create if not
    if not os.path.exists('.env'):
        with open('.env', 'w') as f:
            f.write("# Synapse Protocol Environment Variables\n")
    
    # Load current environment
    load_dotenv()
    
    # Update .env file with blockchain agent address
    set_key('.env', 'BLOCKCHAIN_AGENT_ADDRESS', blockchain_address)
    
    print("✅ .env file updated successfully!")
    print("You can now run the demo_transaction.py script to simulate a transaction.")

if __name__ == "__main__":
    main()