import os
import numpy as np
from typing import List, Dict, Any, Optional
from uagents import Agent, Context, Model, Protocol
from uagents.setup import fund_agent_if_low
from dotenv import load_dotenv

# --- Load environment ---
load_dotenv()

# --- Message Models ---

class EnhancedMatrixRequest(Model):
    ticker: str
    name: str

class EnhancedMatrixResponse(Model):
    asset_name: str
    transition_matrix: List[List[float]]
    states: List[str]
    last_known_state: str
    state_returns: Dict[str, float]
    state_volatility: Dict[str, float]
    trend_momentum: float
    confidence_score: float
    expected_return_30d: float
    risk_score: float
    relative_strength: float

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

# --- Agent Configuration ---
AGENT_PORT = 8002
AGENT_SEED = os.getenv("STRATEGIC_PLANNER_SEED", "strategic_planner_secret_seed")
AGENT_NAME = "simplified_strategic_planner_agent"
ENHANCED_MARKOV_AGENT_ADDRESS = os.getenv("MARKOV_MODEL_ADDRESS", "agent1qgvwcpjdcdn87rmynn6y93ny6mgez5mgwvywr8u4sc36kqg70hktxqt7ufr")

agent = Agent(
    name=AGENT_NAME,
    port=AGENT_PORT,
    seed=AGENT_SEED,
    endpoint=[f"http://127.0.0.1:{AGENT_PORT}/submit"],
)

# --- Agent Memory ---
agent.storage.set("pending_requests", {})

@agent.on_event("startup")
async def startup(ctx: Context):
    ctx.logger.info(f"{AGENT_NAME} starting...")
    ctx.logger.info(f"My address is: {agent.address}")
    fund_agent_if_low(agent.wallet.address())

@agent.on_message(model=PlanRequest)
async def handle_enhanced_plan_request(ctx: Context, sender: str, msg: PlanRequest):
    """Handle requests for asset analysis"""
    ctx.logger.info(f"Received plan request for {msg.name} from {sender}")

    # Store the sender to respond later
    pending_requests = agent.storage.get("pending_requests") or {}
    request_id = f"{msg.ticker}_{msg.name}"
    pending_requests[request_id] = {
        "sender": sender,
        "ticker": msg.ticker,
        "name": msg.name,
        "target_return": msg.target_return,
        "time_horizon_days": msg.time_horizon_days
    }
    agent.storage.set("pending_requests", pending_requests)
    
    # Request data from Markov model agent
    ctx.logger.info(f"Requesting transition matrix for {msg.name}...")
    await ctx.send(
        ENHANCED_MARKOV_AGENT_ADDRESS,
        EnhancedMatrixRequest(ticker=msg.ticker, name=msg.name)
    )

@agent.on_message(model=EnhancedMatrixResponse)
async def handle_enhanced_matrix_response(ctx: Context, sender: str, msg: EnhancedMatrixResponse):
    """Process Markov model data and generate trading plan"""
    ctx.logger.info(f"Received matrix data for {msg.asset_name}")
    
    # Get original request details
    pending_requests = agent.storage.get("pending_requests") or {}
    request_id = f"{msg.asset_name}-USD_{msg.asset_name}"
    
    if request_id not in pending_requests:
        ctx.logger.warning(f"No pending request found for {msg.asset_name}")
        return
    
    request = pending_requests[request_id]
    user_goal = {
        "target_return": request["target_return"],
        "time_horizon_days": request["time_horizon_days"]
    }
    
    # Generate analysis
    ctx.logger.info(f"Generating enhanced analysis for {msg.asset_name}")
    try:
        analysis_result = perform_enhanced_analysis(msg, user_goal, ctx)
        
        # Create response
        response = EnhancedPlanResponse(
            asset_name=msg.asset_name,
            action=analysis_result["action"],
            hold_duration_days=analysis_result["hold_duration"],
            projected_return=analysis_result["projected_return"],
            confidence=analysis_result["confidence"],
            risk_adjusted_score=analysis_result["risk_adjusted_score"],
            momentum_factor=analysis_result["momentum_factor"],
            volatility_opportunity=analysis_result["volatility_opportunity"],
            trading_signal=analysis_result["trading_signal"],
            signal_strength=analysis_result["signal_strength"],
            reasoning=analysis_result["reasoning"]
        )
        
        # Send response back to original requestor
        await ctx.send(request["sender"], response)
        ctx.logger.info(f"Sent analysis for {msg.asset_name} to {request['sender']}")
    except Exception as e:
        ctx.logger.error(f"Error processing {msg.asset_name}: {e}")
        
        # Send default analysis if something went wrong
        default = create_default_analysis(msg.asset_name, str(e))
        await ctx.send(request["sender"], default)
        
    # Clean up the pending request
    del pending_requests[request_id]
    agent.storage.set("pending_requests", pending_requests)


def perform_enhanced_analysis(data: EnhancedMatrixResponse, user_goal: dict, ctx):
    """Sophisticated analysis that goes beyond just state predictions"""
    
    # Simplified analysis for hackathon
    
    # If no data is available, provide a default response
    if not data.states or not data.transition_matrix:
        ctx.logger.warning(f"No valid matrix data for {data.asset_name}")
        return {
            "action": "Hold",
            "hold_duration": 30,
            "projected_return": 1.02,
            "confidence": 0.5,
            "risk_adjusted_score": 0.5,
            "momentum_factor": 0.0,
            "volatility_opportunity": 0.5,
            "trading_signal": "HOLD",
            "signal_strength": 0.5,
            "reasoning": "Insufficient data for reliable analysis. Taking a cautious approach."
        }
    
    # Extract data and calculate scores
    trend_momentum = data.trend_momentum
    expected_return = data.expected_return_30d
    risk_score = data.risk_score
    confidence = data.confidence_score
    
    # Simplified scoring
    momentum_score = max(0.0, (trend_momentum + 1.0) / 2.0)
    expected_return_score = min(1.0, max(0.0, expected_return * 5))  # Scale to 0-1
    volatility_score = 0.5  # Neutral score for volatility
    
    # Determine risk-adjusted score
    risk_adjusted_score = (momentum_score * 0.4 + expected_return_score * 0.4 + volatility_score * 0.2) * confidence
    
    # Trading decision logic - simplified
    if trend_momentum > 0.3 and expected_return > 0.02:
        trading_signal = "BUY"
        signal_strength = min(1.0, trend_momentum * 0.7 + expected_return * 15)
        reasoning = f"Strong upward momentum ({trend_momentum:.2f}) with good expected return ({expected_return:.2%})"
    elif trend_momentum < -0.3:
        trading_signal = "SELL"
        signal_strength = min(1.0, abs(trend_momentum) * 0.7)
        reasoning = f"Downward momentum detected ({trend_momentum:.2f})"
    else:
        trading_signal = "HOLD"
        signal_strength = 0.5
        reasoning = "No strong signals detected"
    
    # Optimal holding period
    if trading_signal == "BUY":
        hold_duration = min(60, user_goal.get("time_horizon_days", 30))
    else:
        hold_duration = 14  # Two weeks for non-buy signals
    
    projected_return = 1.0 + (expected_return * (hold_duration / 30))
    
    ctx.logger.info(f"Enhanced analysis for {data.asset_name}:")
    ctx.logger.info(f"  Risk-adjusted score: {risk_adjusted_score:.3f}")
    ctx.logger.info(f"  Trading signal: {trading_signal} (strength: {signal_strength:.3f})")
    ctx.logger.info(f"  Reasoning: {reasoning}")
    
    return {
        "action": "Invest" if trading_signal == "BUY" else ("Sell" if trading_signal == "SELL" else "Hold"),
        "hold_duration": hold_duration,
        "projected_return": projected_return,
        "confidence": confidence,
        "risk_adjusted_score": risk_adjusted_score,
        "momentum_factor": trend_momentum,
        "volatility_opportunity": volatility_score,
        "trading_signal": trading_signal,
        "signal_strength": signal_strength,
        "reasoning": reasoning
    }


def create_default_analysis(asset_name, reason):
    """Create default analysis when data is insufficient"""
    return EnhancedPlanResponse(
        asset_name=asset_name,
        action="Hold",
        hold_duration_days=30,
        projected_return=1.02,
        confidence=0.5,
        risk_adjusted_score=0.5,
        momentum_factor=0.0,
        volatility_opportunity=0.5,
        trading_signal="HOLD",
        signal_strength=0.5,
        reasoning=f"Default analysis due to: {reason}"
    )


if __name__ == "__main__":
    print(f"Starting {AGENT_NAME} on http://127.0.0.1:{AGENT_PORT}")
    print(f"My address is: {agent.address}")
    agent.run()