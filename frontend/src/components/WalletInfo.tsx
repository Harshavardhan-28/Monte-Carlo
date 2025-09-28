import { useAccount, useBalance, useEnsName } from 'wagmi';
import { useState, useEffect } from 'react';

const WalletInfo = () => {
  const { address, isConnected, chain } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { data: balance } = useBalance({ address });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isConnected || !address) {
    return null;
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 space-y-3">
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-sm font-medium text-gray-300">Wallet Connected</span>
      </div>
      
      <div className="space-y-2">
        <div>
          <label className="text-xs text-gray-400 uppercase tracking-wide">Address</label>
          <p className="text-sm font-mono text-white break-all">
            {ensName || `${address.slice(0, 6)}...${address.slice(-4)}`}
          </p>
        </div>
        
        {balance && (
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wide">Balance</label>
            <p className="text-sm text-white">
              {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
            </p>
          </div>
        )}
        
        {chain && (
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wide">Network</label>
            <p className="text-sm text-white">{chain.name}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletInfo;