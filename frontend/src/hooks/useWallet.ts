import { useAccount, useConnect, useDisconnect, useBalance, useEnsName } from 'wagmi';

export const useWallet = () => {
  const { address, isConnected, chain, status } = useAccount();
  const { connect, connectors, error, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: balance, isLoading: isBalanceLoading } = useBalance({ address });

  const disconnectWallet = () => {
    disconnect();
  };

  const getDisplayAddress = () => {
    if (!address) return null;
    return ensName || `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getFormattedBalance = () => {
    if (!balance) return null;
    return `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}`;
  };

  return {
    // Account info
    address,
    isConnected,
    chain,
    status,
    ensName,
    balance,
    isBalanceLoading,
    
    // Connection functions
    connect,
    disconnect: disconnectWallet,
    connectors,
    error,
    isPending,
    
    // Utility functions
    getDisplayAddress,
    getFormattedBalance,
  };
};