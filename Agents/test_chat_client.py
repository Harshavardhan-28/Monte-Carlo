import os
import json
import requests
from typing import List
from dotenv import load_dotenv
from uagents import Agent, Context, Model

# --- Message Models ---
class ChatMessage(Model):
    user_id: str
    message: str

class ChatResponse(Model):
    message: str
    suggestions: List[str]

# --- Configuration ---
load_dotenv()
AGENT_PORT = 8006
AGENT_SEED = os.getenv("TEST_CLIENT_SEED", "test_client_seed_phrase")

# Set this to your actual chat agent address
CHAT_AGENT_ADDRESS = os.getenv("CHAT_AGENT_ADDRESS", "")

# --- Agent Setup ---
client_agent = Agent(
    name="test_client",
    port=AGENT_PORT,
    seed=AGENT_SEED,
    endpoint=[f"http://127.0.0.1:{AGENT_PORT}/submit"]
)

@client_agent.on_event("startup")
async def startup(ctx: Context):
    ctx.logger.info("Test Client starting...")
    ctx.logger.info(f"My address is: {client_agent.address}")

@client_agent.on_message(model=ChatResponse)
async def handle_chat_response(ctx: Context, sender: str, msg: ChatResponse):
    """Handle responses from the chat agent"""
    ctx.logger.info(f"\n✉️ Response from chat agent: {msg.message}")
    
    if msg.suggestions:
        ctx.logger.info("Suggested replies:")
        for i, suggestion in enumerate(msg.suggestions, 1):
            ctx.logger.info(f"{i}. {suggestion}")
    
    ctx.logger.info("\nEnter your next message (or 'quit' to exit): ")

async def send_message(ctx, user_message):
    """Send a message to the chat agent"""
    if not CHAT_AGENT_ADDRESS:
        ctx.logger.error("❌ Chat agent address not set. Please update the CHAT_AGENT_ADDRESS environment variable.")
        return
        
    try:
        await ctx.send(
            CHAT_AGENT_ADDRESS,
            ChatMessage(user_id="test_user", message=user_message)
        )
        ctx.logger.info(f"Message sent: {user_message}")
    except Exception as e:
        ctx.logger.error(f"Error sending message: {e}")

if __name__ == "__main__":
    import asyncio
    from uagents.query import query
    
    async def main():
        print("\n=== Synapse Protocol Chat Test Client ===")
        print("This client allows you to test the chat agent interface.")
        
        if not CHAT_AGENT_ADDRESS:
            print("\n⚠️ Chat agent address not set!")
            print("Please run the chat agent first, get its address, and set it as CHAT_AGENT_ADDRESS in your .env file.")
            return
            
        print(f"\nConnected to chat agent at: {CHAT_AGENT_ADDRESS}")
        print("\nEnter your message (or 'quit' to exit):")
        
        while True:
            user_input = input("\n> ")
            if user_input.lower() == 'quit':
                break
                
            # Send message using query instead of running the agent
            try:
                response = await query(
                    client_agent.address,
                    CHAT_AGENT_ADDRESS,
                    ChatMessage(user_id="test_user", message=user_input),
                    timeout=10.0
                )
                
                if response:
                    print(f"\n✉️ Response: {response.message}")
                    
                    if response.suggestions:
                        print("\nSuggested replies:")
                        for i, suggestion in enumerate(response.suggestions, 1):
                            print(f"{i}. {suggestion}")
                else:
                    print("\n❌ No response received.")
            except Exception as e:
                print(f"\n❌ Error: {e}")
    
    asyncio.run(main())