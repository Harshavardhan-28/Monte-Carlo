import numpy as np
from uagents import Agent, Context, Model, Protocol
from uagents.setup import fund_agent_if_low

class MatrixRequest(Model):
    ticker: str
    name: str

class MatrixResponse(Model):
    asset_name: str
    transition_matrix: list[list[float]]
    states: list[str]
    last_known_state: str
    state_returns: dict[str, float]

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

AGENT_PORT = 8002
AGENT_SEED = "strategic_planner_secret_seed"
AGENT_NAME = "strategic_planner_agent"
MARKOV_AGENT_ADDRESS = "agent1qgvwcpjdcdn87rmynn6y93ny6mgez5mgwvywr8u4sc36kqg70hktxqt7ufr"

agent = Agent(
    name=AGENT_NAME,
    port=AGENT_PORT,
    seed=AGENT_SEED,
    # THE FIX IS HERE: Corrected 12.0.0.1 to 127.0.0.1
    endpoint=[f"http://127.0.0.1:{AGENT_PORT}/submit"],
)

# NOTE: The fund_agent_if_low line is removed to prevent potential network errors.
# fund_agent_if_low(agent.wallet.address()) 

@agent.on_message(model=PlanRequest)
async def handle_plan_request(ctx: Context, sender: str, msg: PlanRequest):
    ctx.logger.info(f"Received planning request for {msg.name}. Storing goal and requesting data.")
    agent.storage.set("user_goal", msg.dict())
    agent.storage.set("reply_to", sender)
    await ctx.send(
        destination=MARKOV_AGENT_ADDRESS,
        message=MatrixRequest(ticker=msg.ticker, name=msg.name)
    )

@agent.on_message(model=MatrixResponse)
async def handle_matrix_response(ctx: Context, sender: str, msg: MatrixResponse):
    ctx.logger.info(f"Received matrix data for {msg.asset_name}. Running simulation.")
    user_goal = agent.storage.get("user_goal")
    reply_to = agent.storage.get("reply_to")
    if not user_goal or not reply_to:
        return

    p1_matrix = np.array(msg.transition_matrix)
    states = msg.states
    state_returns = msg.state_returns
    initial_state_vector = np.zeros(len(states))
    initial_state_vector[states.index(msg.last_known_state)] = 1.0
    best_plan = {"hold_duration_days": 0, "projected_return": 1.0, "confidence": 0.0}

    for n in range(1, user_goal['time_horizon_days'] + 1):
        pn_matrix = np.linalg.matrix_power(p1_matrix, n)
        prob_dist_at_n = initial_state_vector @ pn_matrix
        expected_daily_return_at_n = sum(prob_dist_at_n[i] * state_returns[states[i]] for i in range(len(states)))
        projected_cumulative_return = (1 + expected_daily_return_at_n)**n
        if projected_cumulative_return >= user_goal['target_return']:
            bull_neutral_prob = prob_dist_at_n[states.index('Bull')] + prob_dist_at_n[states.index('Neutral')]
            best_plan = {
                "hold_duration_days": n,
                "projected_return": projected_cumulative_return,
                "confidence": bull_neutral_prob
            }
            ctx.logger.info(f"Found a potential plan for {msg.asset_name}: Invest for {n} days.")
            break

    if best_plan["hold_duration_days"] > 0:
        await ctx.send(reply_to, PlanResponse(asset_name=msg.asset_name, action="Invest", **best_plan))
    else:
        ctx.logger.info(f"No viable plan found for {msg.asset_name} within the given constraints.")
        await ctx.send(reply_to, PlanResponse(asset_name=msg.asset_name, action="Hold", **best_plan))

if __name__ == "__main__":
    print(f"Starting {AGENT_NAME} on http://127.0.0.1:{AGENT_PORT}")
    print(f"My address is: {agent.address}")
    agent.run()