import { useState, useEffect } from "react";

interface CryptoToken {
  symbol: string;
  name: string;
  icon: string;
  color: string;
}

const ChainVisualizer = () => {
  const [activeSwap, setActiveSwap] = useState<number>(0);
  const [swapProgress, setSwapProgress] = useState<number>(0);
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'transform' | 'complete'>('idle');

  const tokens: CryptoToken[] = [
    { symbol: "ETH", name: "Ethereum", icon: "⧫", color: "from-blue-400 to-blue-600" },
    { symbol: "rBTC", name: "Rootstock Bitcoin", icon: "₿", color: "from-orange-400 to-orange-600" },
    { symbol: "USDC", name: "USD Coin", icon: "$", color: "from-blue-300 to-blue-500" },
    { symbol: "USDT", name: "Tether USD", icon: "₮", color: "from-green-300 to-green-500" },
    { symbol: "WBTC", name: "Wrapped Bitcoin", icon: "₿", color: "from-yellow-400 to-yellow-600" },
    { symbol: "DAI", name: "Dai Stablecoin", icon: "◈", color: "from-purple-300 to-purple-500" }
  ];

  const swapPairs = [
    { from: 0, to: 1, route: "ETH → rBTC" },
    { from: 1, to: 2, route: "rBTC → USDC" },
    { from: 2, to: 3, route: "USDC → USDT" },
    { from: 3, to: 4, route: "USDT → WBTC" },
    { from: 4, to: 5, route: "WBTC → DAI" },
    { from: 5, to: 0, route: "DAI → ETH" }
  ];

  useEffect(() => {
    const swapInterval = setInterval(() => {
      setAnimationPhase('transform');
      setSwapProgress(0);
      
      const progressInterval = setInterval(() => {
        setSwapProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            setAnimationPhase('complete');
            setTimeout(() => {
              setAnimationPhase('idle');
              setActiveSwap(prev => (prev + 1) % swapPairs.length);
            }, 1000);
            return 100;
          }
          return prev + 2;
        });
      }, 50);
      
    }, 4000);

    return () => clearInterval(swapInterval);
  }, [activeSwap]);

  const currentPair = swapPairs[activeSwap];
  const fromToken = tokens[currentPair.from];
  const toToken = tokens[currentPair.to];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block glass rounded-full px-6 py-2 mb-6">
            <span className="text-sm font-mono text-cyan-400">CHAIN VISUALIZER</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Cross-Chain Swap <span className="text-blue-400 font-bold">Animation</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Watch as our Markov Chain models predict optimal swap routes across multiple blockchain networks, 
            transforming your assets with AI-powered precision.
          </p>
        </div>

        {/* Main Visualization */}
        <div className="finance-card max-w-5xl mx-auto mb-12">
          
          {/* Chain Network Display */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-8">
            {tokens.map((token, index) => (
              <div
                key={token.symbol}
                className={`relative p-4 rounded-xl border-2 transition-all duration-500 ${
                  index === currentPair.from && animationPhase !== 'idle'
                    ? 'border-cyan-400 shadow-lg shadow-cyan-400/20 scale-105'
                    : index === currentPair.to && animationPhase === 'complete'
                    ? 'border-green-400 shadow-lg shadow-green-400/20 scale-105'
                    : 'border-white/20 hover:border-white/40'
                }`}
              >
                <div className={`w-12 h-12 mx-auto rounded-lg bg-gradient-to-br ${token.color} flex items-center justify-center text-white text-xl font-bold mb-3`}>
                  {token.icon}
                </div>
                <div className="text-center">
                  <div className="font-mono text-white font-bold">{token.symbol}</div>
                  <div className="text-xs text-gray-400">{token.name}</div>
                </div>
                
                {/* Activity Indicator */}
                {index === currentPair.from && animationPhase !== 'idle' && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-400 rounded-full animate-pulse"></div>
                )}
                {index === currentPair.to && animationPhase === 'complete' && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                )}
              </div>
            ))}
          </div>

          {/* Swap Animation */}
          <div className="relative bg-gray-900/50 rounded-2xl p-8 mb-8">
            <div className="flex items-center justify-between">
              
              {/* From Token */}
              <div className="text-center">
                <div className={`w-20 h-20 mx-auto rounded-xl bg-gradient-to-br ${fromToken.color} flex items-center justify-center text-white text-3xl font-bold mb-4 ${
                  animationPhase === 'transform' ? 'animate-pulse' : ''
                }`}>
                  {fromToken.icon}
                </div>
                <div className="font-mono text-white font-bold text-lg">{fromToken.symbol}</div>
                <div className="text-gray-400">From</div>
              </div>

              {/* Swap Arrow with Animation */}
              <div className="flex-1 relative mx-8">
                <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-100"
                    style={{ width: `${swapProgress}%` }}
                  ></div>
                </div>
                
                {/* Moving Particle */}
                <div 
                  className="absolute top-1/2 transform -translate-y-1/2 w-6 h-6 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50 transition-all duration-100 flex items-center justify-center"
                  style={{ 
                    left: `${swapProgress}%`,
                    transform: `translateX(-50%) translateY(-50%) ${animationPhase === 'transform' ? 'scale(1.2)' : 'scale(1)'}`
                  }}
                >
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                
                {/* Route Label */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  <div className="glass rounded-lg px-3 py-1 text-sm font-mono text-cyan-400">
                    {currentPair.route}
                  </div>
                </div>
              </div>

              {/* To Token */}
              <div className="text-center">
                <div className={`w-20 h-20 mx-auto rounded-xl bg-gradient-to-br ${toToken.color} flex items-center justify-center text-white text-3xl font-bold mb-4 ${
                  animationPhase === 'complete' ? 'animate-pulse' : ''
                }`}>
                  {toToken.icon}
                </div>
                <div className="font-mono text-white font-bold text-lg">{toToken.symbol}</div>
                <div className="text-gray-400">To</div>
              </div>
            </div>

            {/* Swap Statistics */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400 mono">0.0045s</div>
                <div className="text-sm text-gray-400">Execution Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400 mono">99.8%</div>
                <div className="text-sm text-gray-400">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400 mono">$0.12</div>
                <div className="text-sm text-gray-400">Gas Fee</div>
              </div>
            </div>
          </div>

          {/* Markov Chain Model Display */}
          <div className="bg-gray-900/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Markov Chain Prediction Model</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-mono text-green-400">ACTIVE</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-gray-400 mb-1">Confidence</div>
                <div className="text-xl font-bold text-cyan-400 mono">94.7%</div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">Liquidity Score</div>
                <div className="text-xl font-bold text-blue-400 mono">8.9/10</div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">Slippage Est.</div>
                <div className="text-xl font-bold text-green-400 mono">0.03%</div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">Next State</div>
                <div className="text-xl font-bold text-purple-400 mono">
                  {tokens[(currentPair.to + 1) % tokens.length].symbol}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Supported Networks */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-6">Supported Networks</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { name: "Rootstock", icon: "₿", color: "bg-orange-500" },
              { name: "Ethereum", icon: "⧫", color: "bg-blue-500" },
              { name: "Bitcoin", icon: "₿", color: "bg-yellow-500" },
              { name: "Polygon", icon: "⬟", color: "bg-purple-500" },
              { name: "Binance", icon: "◆", color: "bg-yellow-400" },
              { name: "Avalanche", icon: "▲", color: "bg-red-500" }
            ].map((network, index) => (
              <div key={network.name} className="flex items-center space-x-2 glass rounded-full px-4 py-2">
                <div className={`w-6 h-6 ${network.color} rounded-full flex items-center justify-center text-white text-sm`}>
                  {network.icon}
                </div>
                <span className="text-sm text-gray-300">{network.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChainVisualizer;