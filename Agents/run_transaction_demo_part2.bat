@echo off
REM Part 2 of the Blockchain Transaction Demo

echo ============================================================
echo  SYNAPSE PROTOCOL HACKATHON - BLOCKCHAIN TRANSACTION DEMO (PART 2)
echo ============================================================
echo.
echo This script will run the transaction demo using the blockchain agent address.
echo.
echo Please paste the blockchain agent address from the first window:
set /p AGENT_ADDRESS=

echo.
echo Step 3: Updating environment with agent address...
python update_blockchain_address.py %AGENT_ADDRESS%

echo.
echo Step 4: Running transaction demo...
python demo_transaction.py

echo.
echo Demo completed! The judges should now see the complete transaction flow.
pause