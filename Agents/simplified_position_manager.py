import numpy as np
import datetime
from typing import List, Dict, Any, Optional
from uagents import Agent, Context, Model

# --- Models for Communication ---

# Model to request a plan from the Strategic Planner
class PlanRequest(Model):
    ticker: str
    name: str
    target_return: float
    time_horizon_days: int

# Model to receive a plan from the Strategic Planner
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

# Model for sending commands to the Blockchain Agent
class BlockchainCommand(Model):
    command: str  # e.g., "swap", "get_balances"
    params: dict  # Parameters for the command
    
# Model for receiving responses from the Blockchain Agent
class BlockchainResponse(Model):
    success: bool
    data: dict
    message: str

# Model for scheduling future swaps
class ScheduleSwapRequest(Model):
    from_asset: str
    to_asset: str
    amount: float
    scheduled_date: str
    user_id: str
    
class ScheduleSwapResponse(Model):
    success: bool
    message: str
    scheduled_date: str

# --- Agent & Asset Configuration ---
AGENT_PORT = 8001
AGENT_SEED = "enhanced_position_manager_secret_seed_phrase"
AGENT_NAME = "enhanced_position_manager_agent"

# You should update these with the actual addresses from running your agents
ENHANCED_STRATEGIC_PLANNER_ADDRESS = "agent1q0znrpquraaendh0raljrx97jkdsed40vmvyhfv9q44st42fmrzq7mlat4g"
BLOCKCHAIN_AGENT_ADDRESS = "agent1qfx5vmpm0m5zlw2g8vtjmgqqyemvj3xys3a0m8vpxu5csag7ktstwv2kz8c"

# Update these with your actual token addresses
ASSETS = {
    "BTC": {"ticker": "BTC-USD", "address": "0x...YourMcBtcTokenAddress..."},
    "ETH": {"ticker": "ETH-USD", "address": "0x...YourMcEthTokenAddress..."},
    "LTC": {"ticker": "LTC-USD", "address": "0x...YourMcLtcTokenAddress..."}
}
ASSETS_TO_ANALYZE = {name: data["ticker"] for name, data in ASSETS.items()}

# --- Agent Implementation ---
agent = Agent(
    name=AGENT_NAME,
    port=AGENT_PORT,
    seed=AGENT_SEED,
    endpoint=[f"http://127.0.0.1:{AGENT_PORT}/submit"],
)

# Agent's memory
agent.storage.set("pending_responses", 0)
agent.storage.set("all_plans", [])
agent.storage.set("cycle_running", False)
agent.storage.set("swap_history", [])
agent.storage.set("scheduled_swaps", [])

USER_GOAL = {"target_return": 1.1, "time_horizon_days": 60}

@agent.on_interval(period=300.0)  # Run analysis cycle every 5 minutes
async def start_enhanced_planning_cycle(ctx: Context):
    if agent.storage.get("cycle_running"):
        ctx.logger.info("Analysis cycle already running. Skipping.")
        return
    
    ctx.logger.info(f"--- Starting Enhanced Planning Cycle ---")
    agent.storage.set("cycle_running", True)
    agent.storage.set("pending_responses", len(ASSETS_TO_ANALYZE))
    agent.storage.set("all_plans", [])

    for name, ticker in ASSETS_TO_ANALYZE.items():
        ctx.logger.info(f"Requesting enhanced analysis for {name}...")
        await ctx.send(
            destination=ENHANCED_STRATEGIC_PLANNER_ADDRESS,
            message=PlanRequest(
                ticker=ticker, 
                name=name,
                target_return=USER_GOAL["target_return"],
                time_horizon_days=USER_GOAL["time_horizon_days"]
            )
        )

@agent.on_message(model=EnhancedPlanResponse)
async def handle_enhanced_plan_response(ctx: Context, sender: str, msg: EnhancedPlanResponse):
    cycle_running = agent.storage.get("cycle_running")
    if not cycle_running:
        return

    ctx.logger.info(f"Received enhanced plan for {msg.asset_name} from {sender}.")
    
    all_plans = agent.storage.get("all_plans") or []
    all_plans.append(msg)
    agent.storage.set("all_plans", all_plans)
    
    pending_count = agent.storage.get("pending_responses") or 0
    if pending_count > 0:
        pending_count -= 1
        agent.storage.set("pending_responses", pending_count)

    if pending_count == 0:
        await make_enhanced_portfolio_decision(ctx)
        agent.storage.set("cycle_running", False)

async def make_enhanced_portfolio_decision(ctx: Context):
    ctx.logger.info("\n=== All Plans Received: Analyzing for Portfolio Decision ===")
    all_plans = agent.storage.get("all_plans") or []
    
    if not all_plans:
        ctx.logger.warning("No plans received. Cannot make a decision.")
        return

    decision = make_portfolio_allocation_decision(all_plans, ctx)
    await execute_portfolio_decision(decision, all_plans, ctx)

def make_portfolio_allocation_decision(plans: list[EnhancedPlanResponse], ctx: Context):
    """Makes an intelligent portfolio allocation decision based on all available plans."""
    
    plans_sorted = sorted(plans, key=lambda p: p.risk_adjusted_score, reverse=True)
    
    ctx.logger.info("Risk-Adjusted Asset Ranking:")
    for i, plan in enumerate(plans_sorted, 1):
        ctx.logger.info(f"  {i}. {plan.asset_name}: Score {plan.risk_adjusted_score:.3f}, Signal: {plan.trading_signal}")

    top_asset = plans_sorted[0]
    
    # Decide on the action based on the best available plan
    if top_asset.trading_signal == "BUY" and top_asset.signal_strength > 0.7:
        return {
            "type": "CONCENTRATED_BUY",
            "primary_asset": top_asset.asset_name,
            "reasoning": f"Strong BUY signal for {top_asset.asset_name} with score {top_asset.risk_adjusted_score:.2f}"
        }
    elif top_asset.signal_strength > 0.55: # REBALANCE or weaker BUY
        return {
            "type": "REBALANCE",
            "primary_asset": top_asset.asset_name,
            "reasoning": f"Good opportunity to rebalance towards {top_asset.asset_name}"
        }
    else:
        return {
            "type": "HOLD",
            "reasoning": "No signals strong enough to justify a trade. Holding positions."
        }

async def execute_portfolio_decision(decision: dict, all_plans: list, ctx: Context):
    """Translates the portfolio decision into a concrete blockchain command."""
    
    ctx.logger.info(f"\n🎯 PORTFOLIO DECISION: {decision['type']}")
    ctx.logger.info(f"   Reasoning: {decision['reasoning']}")

    token_in, token_out = None, None

    if decision['type'] in ["CONCENTRATED_BUY", "REBALANCE"]:
        asset_to_buy = decision['primary_asset']
        
        # Find the asset with the lowest score to sell. Avoid selling the asset we want to buy.
        lowest_score = float('inf')
        asset_to_sell = None
        for plan in all_plans:
            if plan.asset_name != asset_to_buy and plan.risk_adjusted_score < lowest_score:
                lowest_score = plan.risk_adjusted_score
                asset_to_sell = plan.asset_name

        if asset_to_sell:
            token_out = ASSETS[asset_to_buy]["address"]
            token_in = ASSETS[asset_to_sell]["address"]
            ctx.logger.info(f"   Action: EXECUTING SWAP from {asset_to_sell} to {asset_to_buy}.")
        else:
            ctx.logger.info("   Action: Cannot identify a suitable asset to sell.")
            return
    
    else: # HOLD
        ctx.logger.info("   Action: No on-chain transaction will be executed.")
        return

    # If a trade decision was made, execute the real swap
    swap_params = {
        'token_in': token_in,
        'token_out': token_out,
        'amount_in': 5 * 10**18,  # Swap 5 tokens
        'rate': 1 * 10**18,       # 1:1 rate
    }

    # Execute the real swap directly
    ctx.logger.info(f"Executing real token swap on chain...")
    await ctx.send(BLOCKCHAIN_AGENT_ADDRESS, BlockchainCommand(
        command="swap", 
        params=swap_params
    ))
    
    ctx.logger.info(f"Swap command sent to blockchain agent at {BLOCKCHAIN_AGENT_ADDRESS}.")
    
    # Store the swap details for reference
    today = datetime.datetime.now().strftime("%Y-%m-%d")
    swap_history = agent.storage.get("swap_history") or []
    swap_history.append({
        "date": today,
        "from_asset": asset_to_sell,
        "to_asset": asset_to_buy,
        "amount": swap_params['amount_in'] / 10**18,
        "reason": decision['reasoning']
    })
    agent.storage.set("swap_history", swap_history)

# Add handler for blockchain responses
@agent.on_message(model=BlockchainResponse)
async def handle_blockchain_response(ctx: Context, sender: str, msg: BlockchainResponse):
    """Process responses from blockchain transactions"""
    if msg.success:
        ctx.logger.info(f"Blockchain operation successful: {msg.message}")
        ctx.logger.info(f"Data: {msg.data}")
    else:
        ctx.logger.error(f"Blockchain operation failed: {msg.message}")

# Add handler for scheduling swaps
@agent.on_message(model=ScheduleSwapRequest, replies=ScheduleSwapResponse)
async def handle_schedule_swap_request(ctx: Context, sender: str, msg: ScheduleSwapRequest):
    """Handle requests to schedule a future swap"""
    ctx.logger.info(f"Received swap scheduling request from {sender}")
    
    try:
        # Validate the assets
        if msg.from_asset not in ASSETS or msg.to_asset not in ASSETS:
            await ctx.send(sender, ScheduleSwapResponse(
                success=False,
                message=f"Invalid assets: {msg.from_asset} or {msg.to_asset}. Valid assets are {', '.join(ASSETS.keys())}",
                scheduled_date=""
            ))
            return
            
        # Parse and validate the date
        try:
            scheduled_date = datetime.datetime.strptime(msg.scheduled_date, "%Y-%m-%d")
            today = datetime.datetime.now()
            if scheduled_date < today:
                await ctx.send(sender, ScheduleSwapResponse(
                    success=False,
                    message="Cannot schedule swaps in the past",
                    scheduled_date=""
                ))
                return
        except ValueError:
            await ctx.send(sender, ScheduleSwapResponse(
                success=False,
                message=f"Invalid date format: {msg.scheduled_date}. Please use YYYY-MM-DD format.",
                scheduled_date=""
            ))
            return
            
        # Store the scheduled swap
        scheduled_swaps = agent.storage.get("scheduled_swaps") or []
        scheduled_swaps.append({
            "date": msg.scheduled_date,
            "from_asset": msg.from_asset,
            "to_asset": msg.to_asset,
            "amount": msg.amount,
            "user_id": msg.user_id
        })
        agent.storage.set("scheduled_swaps", scheduled_swaps)
        
        ctx.logger.info(f"Scheduled swap: {msg.amount} {msg.from_asset} to {msg.to_asset} on {msg.scheduled_date}")
        
        # Send confirmation
        await ctx.send(sender, ScheduleSwapResponse(
            success=True,
            message=f"Successfully scheduled swap of {msg.amount} {msg.from_asset} to {msg.to_asset}",
            scheduled_date=msg.scheduled_date
        ))
        
    except Exception as e:
        ctx.logger.error(f"Error scheduling swap: {e}")
        await ctx.send(sender, ScheduleSwapResponse(
            success=False,
            message=f"Error scheduling swap: {str(e)}",
            scheduled_date=""
        ))

# Add time-based scheduler for planned swaps
@agent.on_interval(period=43200.0)  # Check twice daily (12 hours)
async def check_scheduled_swaps(ctx: Context):
    """Execute any swaps that were scheduled for today"""
    today = datetime.datetime.now().strftime("%Y-%m-%d")
    scheduled_swaps = agent.storage.get("scheduled_swaps") or []
    
    # Find swaps scheduled for today
    today_swaps = [swap for swap in scheduled_swaps if swap["date"] == today]
    
    if today_swaps:
        ctx.logger.info(f"Found {len(today_swaps)} scheduled swaps for today.")
        for swap in today_swaps:
            # Get asset addresses
            token_in = ASSETS.get(swap["from_asset"], {}).get("address")
            token_out = ASSETS.get(swap["to_asset"], {}).get("address")
            
            if token_in and token_out:
                # Execute the swap
                swap_params = {
                    'token_in': token_in,
                    'token_out': token_out,
                    'amount_in': int(swap["amount"] * 10**18),
                    'rate': 1 * 10**18
                }
                
                ctx.logger.info(f"Executing scheduled swap: {swap['amount']} {swap['from_asset']} to {swap['to_asset']}")
                await ctx.send(BLOCKCHAIN_AGENT_ADDRESS, BlockchainCommand(
                    command="swap", 
                    params=swap_params
                ))
                
                # Update the swap history
                swap_history = agent.storage.get("swap_history") or []
                swap_history.append({
                    "date": today,
                    "from_asset": swap["from_asset"],
                    "to_asset": swap["to_asset"],
                    "amount": swap["amount"],
                    "reason": "Scheduled swap execution"
                })
                agent.storage.set("swap_history", swap_history)
            else:
                ctx.logger.error(f"Could not execute swap: invalid assets {swap['from_asset']} or {swap['to_asset']}")
        
        # Remove executed swaps from the schedule
        remaining_swaps = [swap for swap in scheduled_swaps if swap["date"] != today]
        agent.storage.set("scheduled_swaps", remaining_swaps)
    else:
        ctx.logger.info("No swaps scheduled for today.")

if __name__ == "__main__":
    print(f"Starting {AGENT_NAME} on http://127.0.0.1:{AGENT_PORT}")
    print(f"My address is: {agent.address}")
    agent.run()