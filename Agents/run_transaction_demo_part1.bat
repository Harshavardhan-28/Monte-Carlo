@echo off
REM Run Blockchain Transaction Demo for Synapse Protocol Hackathon

echo ============================================================
echo  SYNAPSE PROTOCOL HACKATHON - BLOCKCHAIN TRANSACTION DEMO
echo ============================================================
echo.
echo This script will:
echo 1. Run the blockchain agent
echo 2. Capture the agent address
echo 3. Update the environment file
echo 4. Run the transaction demo
echo.
echo Note: For best results, run this in a fresh PowerShell window.
echo.
pause

echo.
echo Step 1: Setting up mock environment...
python setup_environment.py

echo.
echo Step 2: Starting blockchain agent...
echo (The agent will run in this window. Open a new PowerShell window for next steps)
echo.
echo IMPORTANT: After the agent starts, copy the blockchain agent address
echo from the console output and use it in the next step.
echo.
python simplified_blockchain.py