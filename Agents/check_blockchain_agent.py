"""
A simple script to check if the blockchain agent is active and ready for transactions.
"""
import requests
import sys
import time

def check_blockchain_agent(port=8007):
    """Check if the blockchain agent is running on the specified port."""
    try:
        response = requests.get(f"http://127.0.0.1:{port}/status", timeout=2)
        if response.status_code == 200:
            print("✅ Blockchain Agent is active and ready for transactions")
            return True
        else:
            print(f"❌ Blockchain Agent returned unexpected status code: {response.status_code}")
            return False
    except requests.exceptions.RequestException:
        print("❌ Blockchain Agent is not responding. Make sure it's running.")
        return False

def wait_for_blockchain_agent(timeout=30, port=8007):
    """Wait for blockchain agent to be available, with timeout."""
    print(f"Checking if blockchain agent is running on port {port}...")
    start_time = time.time()
    while time.time() - start_time < timeout:
        if check_blockchain_agent(port):
            return True
        print("Waiting for blockchain agent to become available...")
        time.sleep(2)
    
    print(f"Timeout: Blockchain agent did not become available within {timeout} seconds.")
    return False

if __name__ == "__main__":
    # Check if port was passed as argument
    port = 8007
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print(f"Invalid port number: {sys.argv[1]}")
            sys.exit(1)
    
    # Wait for blockchain agent to be available
    if wait_for_blockchain_agent(timeout=30, port=port):
        print("\n🚀 Ready to execute transactions through the blockchain agent!")
        print("Run the following command to execute a demo transaction:")
        print("\npython demo_transaction.py\n")
    else:
        print("\n⚠️ Could not connect to blockchain agent.")
        print("Please make sure the blockchain agent is running with:")
        print("\npython simplified_blockchain.py\n")
        sys.exit(1)