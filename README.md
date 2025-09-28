# Monte-Carlo  
An *Agent-Driven Synthetic Yield Farming Protocol*

---

## 🌐 Overview
Monte-Carlo is a decentralized finance (DeFi) platform that lets users gain exposure to the yield of various crypto assets without facing the liquidity challenges of traditional swapping.  
It uses autonomous AI agents, powered by *Fetch.ai, and a **Markov Chain* predictive model to automate synthetic yield farming strategies.

---

## 🏗 Core Concept
Monte-Carlo issues *synthetic tokens (s-Assets)* collateralized by *Rootstock Bitcoin (RBTC)*, enabling users to simulate exposure to popular assets such as ETH or SOV.  
This approach solves the *cold start* problem for new DeFi protocols by using proxy historical data.

---

## ⚙ System Architecture

The architecture has three main layers:

### 1️⃣ On-Chain Layer (The Vault)
- *Technology:* Solidity on the Rootstock (RSK) EVM-compatible blockchain.  
- *Components:*
  - *Vault.sol* – Central contract holding all user-deposited tRBTC collateral, mints/burns synthetic s-Assets.
  - *sAsset.sol* – ERC20 synthetic tokens (e.g., sETH, sSOV).
  - *Pyth Network Oracle* – Provides real-time price feeds for accurate minting/burning.

#### Workflow:
1. User deposits tRBTC into the Vault.
2. Vault reads the Pyth oracle price of the target asset.
3. Vault mints equivalent synthetic tokens (e.g., sETH) to the user.

---

### 2️⃣ Agentic Layer (Autonomous Agents)
- *Technology:* Fetch.ai uAgents (Python).
- *Agents:*
  - *DataFetcherAgent* – Fetches historical price/yield data from Pyth Network.
  - *MarkovModelAgent* – Runs the Markov Chain model to predict the next high-yield asset.
  - *PositionManagerAgent* – Orchestrates strategy execution and interacts with the RSK blockchain using web3.py.

---

### 3️⃣ Predictive Model
- *Methodology:* Markov Chain.
- *Purpose:* Uses historical proxy data (like BTC) to predict which asset will likely enter a “high-yield state,” overcoming the cold start data issue.

---

## 🔄 End-to-End Flow
1. *User deposits* collateral and specifies their goal to PositionManagerAgent.
2. DataFetcherAgent collects historical data → MarkovModelAgent predicts the optimal asset.
3. PositionManagerAgent calls the Vault to mint the synthetic asset.
4. Synthetic tokens remain backed by locked tRBTC collateral.
5. When profit goals are met, PositionManagerAgent can trigger burning of s-Assets to release collateral.

---

## 🌟 Key Innovations
- *Synthetic Asset Model:* Bypasses real-world liquidity constraints.
- *Agent-Driven Automation:* End-to-end automation from prediction to on-chain execution.
- *Proxy Data Prediction:* Uses established asset data to guide new synthetic positions.
- *Composable System:* Modular agents and contracts for easy testing and upgrades.

---

## 🖼 Architecture Diagram
You can visualize the system using the Mermaid diagram below:

```mermaid
flowchart TD
    subgraph PredictiveModel["Predictive Model (Markov Chain)"]
        MC[Markov Chain Model]
    end

    subgraph AgenticLayer["Agentic Layer (Autonomous Agents)"]
        DF[DataFetcherAgent]
        MM[MarkovModelAgent]
        PM[PositionManagerAgent]
    end

    subgraph OnChainLayer["On-Chain Layer (The Vault)"]
        V[Vault.sol (Main Contract)]
        SA[sAsset.sol (Synthetic Tokens)]
        P[Pyth Network Oracle]
    end

    MC --> DF
    DF --> MM
    MM --> PM
    PM --> V
    V --> SA
    V --> P
    User([User]) --> PM
    SA --> User