from uagents import Agent, Context, Model
from uagents.setup import fund_agent_if_low

class PlanRequest(Model):
    ticker: str
    name: str
    target_return: float
    time_horizon_days: int

class PlanResponse(Model):
    asset_name: str
    action: str
    hold_duration_days: int
    projected_return: float
    confidence: float

AGENT_PORT = 8001
AGENT_SEED = "position_manager_secret_seed_phrase"
AGENT_NAME = "position_manager_agent"

STRATEGIC_PLANNER_ADDRESS = "agent1q0znrpquraaendh0raljrx97jkdsed40vmvyhfv9q44st42fmrzq7mlat4g"

agent = Agent(
    name=AGENT_NAME,
    port=AGENT_PORT,
    seed=AGENT_SEED,
    endpoint=[f"http://127.0.0.1:{AGENT_PORT}/submit"],
)

# NOTE: The fund_agent_if_low line is removed to prevent potential network errors.
# fund_agent_if_low(agent.wallet.address()) 

ASSETS_TO_ANALYZE = { 'ETH': 'ETH-USD', 'RBTC': 'WBTC-USD', 'SOL': 'SOL-USD' }

# Initialize storage keys at startup to ensure they always exist
agent.storage.set("pending_responses", 0)
agent.storage.set("all_plans", [])
agent.storage.set("cycle_running", False)

USER_GOAL = {"target_return": 1.1, "time_horizon_days": 60}

@agent.on_interval(period=120.0)
async def start_planning_cycle(ctx: Context):
    if agent.storage.get("cycle_running"):
        return
    
    ctx.logger.info(f"--- Starting New Planning Cycle for Goal: {USER_GOAL['target_return']}x in {USER_GOAL['time_horizon_days']} days ---")
    agent.storage.set("cycle_running", True)
    agent.storage.set("pending_responses", len(ASSETS_TO_ANALYZE))
    agent.storage.set("all_plans", []) # Reset the list for the new cycle

    for name, ticker in ASSETS_TO_ANALYZE.items():
        ctx.logger.info(f"Requesting a plan for {name} from Strategic Planner...")
        await ctx.send(
            destination=STRATEGIC_PLANNER_ADDRESS,
            message=PlanRequest(
                ticker=ticker, 
                name=name,
                target_return=USER_GOAL["target_return"],
                time_horizon_days=USER_GOAL["time_horizon_days"]
            )
        )

@agent.on_message(model=PlanResponse)
async def handle_plan_response(ctx: Context, sender: str, msg: PlanResponse):
    if not agent.storage.get("cycle_running"):
        return

    ctx.logger.info(f"Received a plan for {msg.asset_name} from the Planner.")
    
    # THE FIX IS HERE: Call .get() with only one argument
    all_plans = agent.storage.get("all_plans")
    all_plans.append(msg.dict())
    agent.storage.set("all_plans", all_plans)
    
    # AND HERE
    pending_count = agent.storage.get("pending_responses") - 1
    agent.storage.set("pending_responses", pending_count)

    if pending_count == 0:
        ctx.logger.info("--- All plans received. Making final decision. ---")
        
        # AND HERE
        final_plans = agent.storage.get("all_plans")
        viable_plans = [p for p in final_plans if p['action'] == "Invest"]
        
        if not viable_plans:
            ctx.logger.info("No viable investment plans found that meet the user's goal. Holding all positions.")
        else:
            best_plan = min(viable_plans, key=lambda p: p['hold_duration_days'])

            ctx.logger.info("--- Decision Complete ---")
            ctx.logger.info(f"Optimal Plan: Invest in {best_plan['asset_name']}")
            ctx.logger.info(f"  -> Hold for: {best_plan['hold_duration_days']} days")
            ctx.logger.info(f"  -> Projected Return: {best_plan['projected_return']:.2f}x")
            ctx.logger.info(f"  -> Confidence: {best_plan['confidence']:.2%}")

            print("\n" + "="*50)
            print("      >>> SIMULATING ON-CHAIN CALL <<<")
            print(f"      Calling 'mintSynthetic' on the Vault contract.")
            print(f"      Asset to simulate: {best_plan['asset_name']}")
            print("="*50 + "\n")
        
        agent.storage.set("cycle_running", False)

if __name__ == "__main__":
    print(f"Starting {AGENT_NAME} on http://127.0.0.1:{AGENT_PORT}")
    print(f"My address is: {agent.address}")
    agent.run()