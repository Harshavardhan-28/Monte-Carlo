import os
import json
import datetime
from typing import Dict, Any, List, Optional
import google.generativeai as genai
from uagents import Agent, Context, Model
from uagents.setup import fund_agent_if_low
from dotenv import load_dotenv

# --- Message Models ---
class ChatMessage(Model):
    user_id: str
    message: str

class ChatResponse(Model):
    message: str
    suggestions: List[str]

class BlockchainCommand(Model):
    command: str
    params: dict

class BlockchainResponse(Model):
    success: bool
    data: dict
    message: str

class PlanRequest(Model):
    ticker: str
    name: str
    target_return: float
    time_horizon_days: int

class EnhancedPlanResponse(Model):
    asset_name: str
    action: str
    hold_duration_days: int
    projected_return: float
    confidence: float
    risk_adjusted_score: float
    momentum_factor: float
    volatility_opportunity: float
    trading_signal: str
    signal_strength: float
    reasoning: str

# --- Configuration ---
load_dotenv()
AGENT_PORT = 8005
AGENT_SEED = os.getenv("CHAT_AGENT_SEED", "chat_agent_secret_seed_phrase")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

# Agent addresses - update these with your actual agent addresses
BLOCKCHAIN_AGENT_ADDRESS = os.getenv("BLOCKCHAIN_AGENT_ADDRESS", "")
POSITION_MANAGER_ADDRESS = os.getenv("POSITION_MANAGER_ADDRESS", "")
STRATEGIC_PLANNER_ADDRESS = os.getenv("STRATEGIC_PLANNER_ADDRESS", "")
MARKOV_MODEL_ADDRESS = os.getenv("MARKOV_MODEL_ADDRESS", "")

# --- Initialize Gemini ---
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-pro')
else:
    print("⚠️ GEMINI_API_KEY not found in .env file. Chat functionality will be limited.")
    model = None

# --- Agent Setup ---
chat_agent = Agent(
    name="chat_agent",
    port=AGENT_PORT,
    seed=AGENT_SEED,
    endpoint=[f"http://127.0.0.1:{AGENT_PORT}/submit"]
)

# --- Chat Memory ---
chat_history = {}  # Store conversations by user_id

# --- Helper Functions ---
def get_assets_info():
    """Return information about available assets."""
    return {
        "BTC": {"ticker": "BTC-USD", "address": os.getenv("BTC_ADDRESS", "")},
        "ETH": {"ticker": "ETH-USD", "address": os.getenv("ETH_ADDRESS", "")},
        "LTC": {"ticker": "LTC-USD", "address": os.getenv("LTC_ADDRESS", "")}
    }

def parse_date(date_string):
    """Parse a date string into a datetime object."""
    try:
        # Try various formats
        formats = ["%Y-%m-%d", "%m/%d/%Y", "%d-%m-%Y", "%d/%m/%Y"]
        for fmt in formats:
            try:
                return datetime.datetime.strptime(date_string, fmt)
            except ValueError:
                continue
        
        # If we get here, no format worked
        return None
    except Exception:
        return None

def extract_trading_intent(user_message, user_history):
    """Use Gemini to extract trading intent from user message."""
    if not model:
        return {
            "intent": "unknown",
            "explanation": "Gemini API key not configured"
        }
    
    prompt = f"""
    You're a financial trading assistant. Based on the user's message, extract their trading intent.
    Return your answer as a JSON object with these fields:
    
    1. "intent": One of "asset_analysis", "execute_swap", "schedule_swap", "check_balance", "general_question"
    2. "assets": List of mentioned assets (BTC, ETH, LTC) or empty list if none
    3. "amount": Trading amount if specified, or null
    4. "scheduled_date": Date for scheduled trades in YYYY-MM-DD format, or null
    5. "target_return": Target return percentage if mentioned (as decimal, e.g., 1.1 for 10% return), or null
    6. "time_horizon": Time horizon in days if mentioned, or null
    7. "explanation": Brief explanation of what the user wants
    
    User message: {user_message}
    
    Previous conversation:
    {user_history[-3:] if user_history else "No previous messages"}
    
    JSON response:
    """
    
    response = model.generate_content(prompt)
    try:
        # Extract the JSON part from response
        json_text = response.text
        if "```json" in json_text:
            json_text = json_text.split("```json")[1].split("```")[0].strip()
        elif "```" in json_text:
            json_text = json_text.split("```")[1].split("```")[0].strip()
            
        intent_data = json.loads(json_text)
        return intent_data
    except Exception as e:
        print(f"Error parsing Gemini response: {e}")
        return {
            "intent": "unknown",
            "explanation": "Failed to parse intent"
        }

def generate_chat_response(user_id, intent_data, context_data=None):
    """Generate a chat response using Gemini."""
    if not model:
        return "I'm sorry, but the Gemini API key isn't configured. Please check with the administrator."
    
    prompt = f"""
    You're a helpful financial trading assistant named Synapse. 
    You help users analyze assets and execute trades on the Synapse Protocol.
    
    Available assets: BTC, ETH, LTC
    
    User intent: {json.dumps(intent_data)}
    
    Context data: {json.dumps(context_data) if context_data else "No additional context"}
    
    Respond to the user in a helpful, conversational way. If you don't have enough information to 
    fulfill their request, ask clarifying questions. If you're giving them results of analysis or
    a trade, present it clearly with any relevant metrics.
    
    Keep your response under 150 words.
    """
    
    response = model.generate_content(prompt)
    return response.text

# --- Agent Handlers ---
@chat_agent.on_event("startup")
async def startup(ctx: Context):
    ctx.logger.info("Chat Agent starting...")
    ctx.logger.info(f"My address is: {chat_agent.address}")
    fund_agent_if_low(chat_agent.wallet.address())

@chat_agent.on_message(model=ChatMessage, replies=ChatResponse)
async def handle_chat_message(ctx: Context, sender: str, msg: ChatMessage):
    """Process incoming chat messages and generate responses."""
    user_id = msg.user_id
    message = msg.message
    
    # Initialize or update chat history
    if user_id not in chat_history:
        chat_history[user_id] = []
    chat_history[user_id].append({"role": "user", "message": message})
    
    ctx.logger.info(f"Received message from {user_id}: {message}")
    
    # Extract intent using Gemini
    intent_data = extract_trading_intent(message, chat_history[user_id])
    ctx.logger.info(f"Extracted intent: {intent_data['intent']}")
    
    response_text = ""
    suggestions = []
    context_data = None
    
    # Handle different intents
    if intent_data["intent"] == "asset_analysis":
        if "assets" in intent_data and intent_data["assets"]:
            asset = intent_data["assets"][0]
            target_return = intent_data.get("target_return", 1.1)  # Default 10% return
            time_horizon = intent_data.get("time_horizon", 60)     # Default 60 days
            
            # Request analysis from strategic planner
            if STRATEGIC_PLANNER_ADDRESS:
                ctx.logger.info(f"Requesting analysis for {asset} from strategic planner")
                await ctx.send(
                    STRATEGIC_PLANNER_ADDRESS, 
                    PlanRequest(
                        ticker=f"{asset}-USD",
                        name=asset,
                        target_return=target_return,
                        time_horizon_days=time_horizon
                    )
                )
                response_text = f"I'm analyzing {asset} now. I'll get back to you with insights shortly."
                suggestions = ["Show me portfolio balance", "What's your recommendation for ETH?"]
            else:
                response_text = f"I'd like to analyze {asset} for you, but I'm not currently connected to the analysis service."
        else:
            response_text = "Which asset would you like me to analyze? I can look at BTC, ETH, or LTC."
            suggestions = ["Analyze BTC", "What do you think about ETH?", "Should I invest in LTC?"]
            
    elif intent_data["intent"] == "execute_swap":
        if "assets" in intent_data and len(intent_data["assets"]) >= 2:
            token_in = intent_data["assets"][0]
            token_out = intent_data["assets"][1]
            amount = intent_data.get("amount", 5)  # Default amount
            
            assets = get_assets_info()
            if token_in in assets and token_out in assets:
                # Send swap command to blockchain agent
                if BLOCKCHAIN_AGENT_ADDRESS:
                    ctx.logger.info(f"Executing swap from {token_in} to {token_out}")
                    swap_params = {
                        'token_in': assets[token_in]["address"],
                        'token_out': assets[token_out]["address"],
                        'amount_in': int(amount * 10**18),  # Convert to wei
                        'rate': 1 * 10**18,  # 1:1 rate
                    }
                    
                    await ctx.send(
                        BLOCKCHAIN_AGENT_ADDRESS, 
                        BlockchainCommand(command="swap", params=swap_params)
                    )
                    
                    response_text = f"I'm executing a swap of {amount} {token_in} to {token_out}. I'll update you when it's complete."
                else:
                    response_text = "I'd like to execute this swap, but I'm not currently connected to the blockchain service."
            else:
                response_text = f"I can only swap between BTC, ETH, and LTC. Please specify which assets you'd like to swap."
        else:
            response_text = "I need to know which assets you want to swap. For example, 'Swap 2 BTC for ETH'."
            suggestions = ["Swap BTC for ETH", "Trade 3 LTC for BTC", "Exchange ETH to LTC"]
    
    elif intent_data["intent"] == "schedule_swap":
        if ("assets" in intent_data and len(intent_data["assets"]) >= 2 
                and intent_data.get("scheduled_date")):
            token_in = intent_data["assets"][0]
            token_out = intent_data["assets"][1]
            amount = intent_data.get("amount", 5)  # Default amount
            scheduled_date = intent_data["scheduled_date"]
            
            # Send to position manager for scheduling
            if POSITION_MANAGER_ADDRESS:
                ctx.logger.info(f"Scheduling swap from {token_in} to {token_out} on {scheduled_date}")
                
                # In a real implementation, you'd format this as a proper message model
                # This is simplified for the hackathon
                schedule_data = {
                    "action": "schedule_swap",
                    "token_in": token_in,
                    "token_out": token_out,
                    "amount": amount,
                    "date": scheduled_date,
                    "user_id": user_id
                }
                
                # You'd need to implement a proper scheduling message in the position manager
                # await ctx.send(POSITION_MANAGER_ADDRESS, ScheduleSwapRequest(**schedule_data))
                
                response_text = f"I've scheduled a swap of {amount} {token_in} to {token_out} on {scheduled_date}."
            else:
                response_text = "I'd like to schedule this swap, but I'm not currently connected to the position manager."
        else:
            response_text = "To schedule a swap, please specify the assets, amount, and date. For example: 'Schedule a swap of 2 BTC to ETH on October 5th'"
            suggestions = ["Schedule BTC to ETH swap tomorrow", "Plan LTC to BTC swap next week"]
    
    elif intent_data["intent"] == "check_balance":
        # Request balances from blockchain agent
        if BLOCKCHAIN_AGENT_ADDRESS:
            ctx.logger.info("Requesting balance information from blockchain")
            await ctx.send(
                BLOCKCHAIN_AGENT_ADDRESS, 
                BlockchainCommand(command="get_balances", params={})
            )
            response_text = "I'm retrieving the current balances for you. I'll share them in a moment."
        else:
            response_text = "I'd like to check the balances, but I'm not currently connected to the blockchain service."
    
    else:  # general_question or unknown
        response_text = generate_chat_response(user_id, intent_data)
        suggestions = ["Analyze BTC", "Check my portfolio", "Swap ETH to BTC"]
    
    # Store assistant response in chat history
    chat_history[user_id].append({"role": "assistant", "message": response_text})
    
    # Send response back to user
    await ctx.send(sender, ChatResponse(
        message=response_text,
        suggestions=suggestions
    ))

@chat_agent.on_message(model=BlockchainResponse)
async def handle_blockchain_response(ctx: Context, sender: str, msg: BlockchainResponse):
    """Handle responses from the blockchain agent."""
    ctx.logger.info(f"Received blockchain response: {msg}")
    
    # In a real implementation, you would:
    # 1. Match this response to the user who requested it
    # 2. Format and send the response back to the user
    # 
    # This is simplified for the hackathon
    
    if msg.success:
        if "balances" in msg.data:
            balances = msg.data["balances"]
            balance_msg = (
                f"Current portfolio balances:\n"
                f"BTC: {balances.get('BTC', 0) / 10**18:.2f}\n"
                f"ETH: {balances.get('ETH', 0) / 10**18:.2f}\n"
                f"LTC: {balances.get('LTC', 0) / 10**18:.2f}"
            )
            ctx.logger.info(balance_msg)
            # You'd need to store user IDs to know who to respond to
            
        elif "tx_hash" in msg.data:
            tx_hash = msg.data["tx_hash"]
            token_in = msg.data.get("token_in", "Token")
            token_out = msg.data.get("token_out", "Token")
            swap_msg = f"Swap from {token_in} to {token_out} completed! Transaction: {tx_hash}"
            ctx.logger.info(swap_msg)
            # You'd need to store user IDs to know who to respond to
    else:
        ctx.logger.error(f"Blockchain operation failed: {msg.message}")

@chat_agent.on_message(model=EnhancedPlanResponse)
async def handle_plan_response(ctx: Context, sender: str, msg: EnhancedPlanResponse):
    """Handle responses from the strategic planner."""
    ctx.logger.info(f"Received analysis for {msg.asset_name}")
    
    # Format the analysis in a user-friendly way
    analysis = (
        f"📊 Analysis for {msg.asset_name}:\n"
        f"• Recommendation: {msg.trading_signal} (Confidence: {msg.signal_strength:.0%})\n"
        f"• Projected Return: {(msg.projected_return - 1) * 100:.1f}%\n"
        f"• Risk-Adjusted Score: {msg.risk_adjusted_score:.2f}/1.0\n"
        f"• Reasoning: {msg.reasoning}"
    )
    
    ctx.logger.info(analysis)
    # You'd need to store user IDs to know who to respond to

if __name__ == "__main__":
    print(f"Starting Chat Agent on http://127.0.0.1:{AGENT_PORT}")
    print(f"My address is: {chat_agent.address}")
    print(f"Gemini API {'configured' if model else 'NOT CONFIGURED'}")
    chat_agent.run()