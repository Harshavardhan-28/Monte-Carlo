"""
This script demonstrates a real multi-agent transaction for the Synapse Protocol.
It first verifies the blockchain agent is running, then launches the demo transaction.
"""
import os
import sys
import time
import subprocess
import requests

def check_blockchain_agent(port=8007):
    """Check if the blockchain agent is running on the specified port."""
    try:
        response = requests.get(f"http://127.0.0.1:{port}/health", timeout=2)
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
        try:
            # Try a simple HTTP request to check if the server is responding
            requests.get(f"http://127.0.0.1:{port}/", timeout=2)
            print("✅ Blockchain Agent is running!")
            return True
        except requests.exceptions.RequestException:
            pass
        
        print("Waiting for blockchain agent to become available...")
        time.sleep(2)
    
    print(f"Timeout: Blockchain agent did not become available within {timeout} seconds.")
    return False

def start_blockchain_agent():
    """Start the blockchain agent in a new window."""
    try:
        # For Windows, use Start-Process to open in a new window
        if os.name == 'nt':  # Windows
            print("Starting blockchain agent in a new window...")
            subprocess.Popen(['powershell', '-Command', 
                             f'Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd {os.getcwd()}; .\\venv\\Scripts\\Activate.ps1; python simplified_blockchain.py"'])
        else:  # Unix/Linux/Mac
            print("Starting blockchain agent in a new terminal...")
            subprocess.Popen(['gnome-terminal', '--', 'bash', '-c', 
                             f'cd {os.getcwd()} && python simplified_blockchain.py; exec bash'])
        
        # Give it time to start
        time.sleep(5)
        return True
    except Exception as e:
        print(f"Error starting blockchain agent: {e}")
        return False

def run_demo_transaction():
    """Run the demo transaction."""
    try:
        # For Windows, use Start-Process to open in a new window
        if os.name == 'nt':  # Windows
            print("Starting demo transaction in a new window...")
            subprocess.Popen(['powershell', '-Command', 
                             f'Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd {os.getcwd()}; .\\venv\\Scripts\\Activate.ps1; python demo_transaction.py"'])
        else:  # Unix/Linux/Mac
            print("Starting demo transaction in a new terminal...")
            subprocess.Popen(['gnome-terminal', '--', 'bash', '-c', 
                             f'cd {os.getcwd()} && python demo_transaction.py; exec bash'])
        return True
    except Exception as e:
        print(f"Error running demo transaction: {e}")
        return False

if __name__ == "__main__":
    print("""
╔══════════════════════════════════════════════════════════════╗
║  SYNAPSE PROTOCOL - REAL MULTI-AGENT TRANSACTION DEMO        ║
╚══════════════════════════════════════════════════════════════╝

This script will demonstrate real communication between agents:
1. First, it will check if the blockchain agent is running
2. If not, it will start the blockchain agent
3. Then it will run the transaction demo

This shows actual agent-to-agent communication, not just a simulation!
""")
    
    # Check if blockchain agent is already running
    if not wait_for_blockchain_agent(timeout=10):
        print("\n⚠️ Blockchain agent is not running. Starting it now...")
        if not start_blockchain_agent():
            print("❌ Failed to start blockchain agent.")
            sys.exit(1)
        
        # Wait for it to start
        if not wait_for_blockchain_agent(timeout=30):
            print("❌ Blockchain agent failed to start properly.")
            sys.exit(1)
    
    # Now run the demo transaction
    print("\n🚀 Ready to execute transactions through the blockchain agent!")
    input("Press Enter to start the demo transaction...")
    
    if run_demo_transaction():
        print("\n✅ Demo transaction started successfully!")
        print("Please check the new window that opened to see the transaction progress.")
    else:
        print("\n❌ Failed to start demo transaction.")
        sys.exit(1)