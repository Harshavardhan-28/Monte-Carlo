@echo off
REM Start all Synapse Protocol agents for the hackathon

echo Starting all Synapse Protocol agents...

REM Create a separate window for each agent
start "Markov Model Agent" cmd /c "python simplified_markov_model.py"
timeout /t 2
start "Strategic Planner Agent" cmd /c "python simplified_strategic_planner.py"
timeout /t 2
start "Position Manager Agent" cmd /c "python simplified_position_manager.py"
timeout /t 2
start "Blockchain Agent" cmd /c "python simplified_blockchain.py"
timeout /t 2
start "Chat Agent" cmd /c "python chat_agent.py"

echo All agents started successfully!
echo Chat agent interface is ready for user interaction.