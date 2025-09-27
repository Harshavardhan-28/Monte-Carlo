import { getDefaultConfig } from 'connectkit';
import { createConfig, http } from 'wagmi';
import { 
  mainnet, 
  sepolia, 
  polygon, 
  polygonMumbai,
  bsc, 
  bscTestnet,
  arbitrum, 
  arbitrumSepolia,
  optimism, 
  optimismSepolia,
  avalanche,
  avalancheFuji,
  base,
  baseSepolia
} from 'wagmi/chains';

// Include popular chains for DeFi and trading
const chains = [
  mainnet,
  sepolia,
  polygon,
  polygonMumbai,
  bsc,
  bscTestnet,
  arbitrum,
  arbitrumSepolia,
  optimism,
  optimismSepolia,
  avalanche,
  avalancheFuji,
  base,
  baseSepolia
] as const;

export const config = createConfig(
  getDefaultConfig({
    // Your dApp name and metadata
    appName: 'Monte-Carlo',
    appDescription: 'Advanced Monte Carlo Simulation for Crypto Portfolio Management',
    appUrl: typeof window !== 'undefined' ? window.location.origin : 'https://localhost:3000',
    appIcon: typeof window !== 'undefined' ? `${window.location.origin}/favicon.ico` : '/favicon.ico',

    // WalletConnect Project ID (optional for development)
    walletConnectProjectId: '',

    // Supported chains
    chains,

    // Minimal transports for all chains
    transports: {
      [mainnet.id]: http(),
      [sepolia.id]: http(),
      [polygon.id]: http(),
      [polygonMumbai.id]: http(),
      [bsc.id]: http(),
      [bscTestnet.id]: http(),
      [arbitrum.id]: http(),
      [arbitrumSepolia.id]: http(),
      [optimism.id]: http(),
      [optimismSepolia.id]: http(),
      [avalanche.id]: http(),
      [avalancheFuji.id]: http(),
      [base.id]: http(),
      [baseSepolia.id]: http(),
    },

    // Conservative settings to minimize network calls
    batch: {
      multicall: {
        batchSize: 256,
      },
    },

    // Longer polling interval
    pollingInterval: 60_000,
    
    // SSR support
    ssr: false,
  }),
);