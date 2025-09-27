import { useState } from 'react';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
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

const chainInfo: Record<number, { name: string; color: string; icon: string }> = {
  [mainnet.id]: { name: 'Ethereum', color: 'bg-blue-500', icon: '🔷' },
  [sepolia.id]: { name: 'Sepolia', color: 'bg-blue-400', icon: '🔷' },
  [polygon.id]: { name: 'Polygon', color: 'bg-purple-500', icon: '⬟' },
  [polygonMumbai.id]: { name: 'Mumbai', color: 'bg-purple-400', icon: '⬟' },
  [bsc.id]: { name: 'BSC', color: 'bg-yellow-500', icon: '🟡' },
  [bscTestnet.id]: { name: 'BSC Testnet', color: 'bg-yellow-400', icon: '🟡' },
  [arbitrum.id]: { name: 'Arbitrum', color: 'bg-cyan-500', icon: '🔵' },
  [arbitrumSepolia.id]: { name: 'Arbitrum Sepolia', color: 'bg-cyan-400', icon: '🔵' },
  [optimism.id]: { name: 'Optimism', color: 'bg-red-500', icon: '🔴' },
  [optimismSepolia.id]: { name: 'OP Sepolia', color: 'bg-red-400', icon: '🔴' },
  [avalanche.id]: { name: 'Avalanche', color: 'bg-red-600', icon: '🏔️' },
  [avalancheFuji.id]: { name: 'Fuji', color: 'bg-red-400', icon: '🏔️' },
  [base.id]: { name: 'Base', color: 'bg-blue-600', icon: '🏗️' },
  [baseSepolia.id]: { name: 'Base Sepolia', color: 'bg-blue-400', icon: '🏗️' },
};

const ChainSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  if (!isConnected) return null;

  const currentChain = chainInfo[chainId];
  const availableChains = Object.keys(chainInfo).map(id => ({
    id: parseInt(id),
    ...chainInfo[parseInt(id)]
  }));

  const testnetIds = [sepolia.id, polygonMumbai.id, bscTestnet.id, arbitrumSepolia.id, optimismSepolia.id, avalancheFuji.id, baseSepolia.id];

  const handleChainSwitch = (newChainId: number) => {
    switchChain({ chainId: newChainId });
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-white transition-all duration-200 ${
          currentChain?.color || 'bg-gray-500'
        } hover:opacity-80`}
      >
        <span>{currentChain?.icon || '🔗'}</span>
        <span>{currentChain?.name || 'Unknown'}</span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-20 max-h-64 overflow-y-auto">
            <div className="p-2">
              <div className="text-xs text-gray-400 px-2 py-1 font-semibold">Mainnets</div>
              {availableChains
                .filter(chain => !testnetIds.includes(chain.id as any))
                .map((chain) => (
                <button
                  key={chain.id}
                  onClick={() => handleChainSwitch(chain.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-700 rounded-md transition-colors ${
                    chainId === chain.id ? 'bg-gray-700 ring-1 ring-white/20' : ''
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full ${chain.color}`}></span>
                  <span className="text-sm text-white">{chain.name}</span>
                  {chainId === chain.id && (
                    <div className="ml-auto w-2 h-2 bg-green-400 rounded-full"></div>
                  )}
                </button>
              ))}
              
              <div className="text-xs text-gray-400 px-2 py-1 font-semibold mt-2">Testnets</div>
              {availableChains
                .filter(chain => testnetIds.includes(chain.id as any))
                .map((chain) => (
                <button
                  key={chain.id}
                  onClick={() => handleChainSwitch(chain.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-700 rounded-md transition-colors ${
                    chainId === chain.id ? 'bg-gray-700 ring-1 ring-white/20' : ''
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full ${chain.color}`}></span>
                  <span className="text-sm text-white">{chain.name}</span>
                  {chainId === chain.id && (
                    <div className="ml-auto w-2 h-2 bg-green-400 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChainSelector;