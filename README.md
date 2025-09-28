># Monte-Carlo  
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

## 🪙 Rootstock Integration  
Monte-Carlo is deployed on the **Rootstock (RSK) network**, leveraging its **EVM compatibility** and **Bitcoin-backed security**.  
We used Rootstock for:  
- **Contract Deployment** – All core contracts (Vault, sAssets, Liquidity Pool) live on the RSK chain.  
- **Transactions** – Users interact with the protocol using tRBTC as collateral.  
- **Liquidity Pool & Swapping** – Synthetic asset swaps are executed directly through Rootstock’s DeFi ecosystem, ensuring low-cost and secure transactions.  

By anchoring to Bitcoin via Rootstock, Monte-Carlo inherits Bitcoin’s security while enabling Ethereum-like programmability.  

<img width="1920" height="1080" alt="Screenshot (492)" src="https://github.com/user-attachments/assets/31583809-e6f9-4290-9370-3761f49aab2d" />

<img width="1920" height="1080" alt="Screenshot (493)" src="https://github.com/user-attachments/assets/75d114fe-3d06-44ca-a287-537165ae7a01" />

---

## 🤖 Agentic System (uAgents)  
The intelligence of Monte-Carlo comes from **Fetch.ai’s uAgents**, built on the **mailbox template** for scalable and asynchronous communication.  
- **Multiple uAgents** were developed for data fetching, prediction, and execution.  
- Agents are **integrated with our frontend**, enabling seamless interaction for users.  
- A detailed **README is available in the `/agents` folder**, explaining each agent, its role, and the mailbox setup.  

This modular design ensures that agents can be easily extended or swapped without touching the on-chain contracts.  

---

## 💸 X402 Payments  
Monte-Carlo integrates **X402 payments** to facilitate decentralized micro-transactions between agents and services.  
- **Price Feeds:** Whenever the DataFetcherAgent retrieves oracle data, it pays the data provider using X402.  
- **Tool Calling & Access:** In our **second MCP (Multi-Chain Protocol)** module, agents handling contract interactions use X402 for gated access and secure tool execution.  

This **agent-to-agent economy** ensures that every service call, whether fetching data or executing blockchain transactions, is **self-sustaining and economically incentivized**.  

---
