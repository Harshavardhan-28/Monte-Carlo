import express from "express";
import fetch from "node-fetch";
import { paymentMiddleware } from "x402-express";
// import { facilitator } from "@coinbase/x402"; // For mainnet

const app = express();

app.use(paymentMiddleware(
  "0xCA3953e536bDA86D1F152eEfA8aC7b0C82b6eC00", // receiving wallet address
  {  // Route configurations for protected endpoints
    "GET /prices": {
      // USDC amount in dollars
      price: "$0.001",
      network: "polygon-amoy",
      // Optional: Add metadata for better discovery in x402 Bazaar
      config: {
        description: "Get current prices for BTC, ETH, and LTC",
        outputSchema: {
          type: "object",
          properties: {
            btc: { type: "number" },
            eth: { type: "number" },
            ltc: { type: "number" }
          }
        }
      }
    },
  },
  {
    url: process.env.FACILITATOR_URL || "https://x402.polygon.technology", // Polygon Amoy facilitator
  }
));

// Implement your route
app.get("/prices", async (req, res) => {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,litecoin&vs_currencies=usd');
    const data = await response.json();

    res.send({
      report: {
        btc: data.bitcoin.usd,
        eth: data.ethereum.usd,
        ltc: data.litecoin.usd,
      },
    });
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch crypto prices." });
  }
});

app.listen(4021, () => {
  console.log(`Server listening at http://localhost:4021`);
});