#!/bin/bash
# Start all Synapse Protocol agents for the hackathon

echo "Starting all Synapse Protocol agents..."

# Start each agent in a separate terminal
gnome-terminal --tab -- bash -c "python simplified_markov_model.py; read -p 'Press Enter to close...'" &
sleep 2
gnome-terminal --tab -- bash -c "python simplified_strategic_planner.py; read -p 'Press Enter to close...'" &
sleep 2
gnome-terminal --tab -- bash -c "python simplified_position_manager.py; read -p 'Press Enter to close...'" &
sleep 2
gnome-terminal --tab -- bash -c "python simplified_blockchain.py; read -p 'Press Enter to close...'" &
sleep 2
gnome-terminal --tab -- bash -c "python chat_agent.py; read -p 'Press Enter to close...'" &

echo "All agents started successfully!"
echo "Chat agent interface is ready for user interaction."