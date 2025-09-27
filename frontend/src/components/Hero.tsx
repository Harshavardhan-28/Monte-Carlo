import { useState, useEffect } from "react";

const Hero = () => {
  const [currentText, setCurrentText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [showStats, setShowStats] = useState(false);
  
  const heroTexts = [
    "Agent-Driven Synthetic Yield Farming",
    "AI-Powered DeFi Innovation",
    "Advanced Markov Chain Strategies",
    "Rootstock Bitcoin Foundation"
  ];

  const stats = [
    { label: "Total Value Locked", value: "$0M", change: "+0.00%", trend: "up" },
    { label: "Active Strategies", value: "0", change: "+0", trend: "up" },
    { label: "Average APY", value: "0.00%", change: "+0.00%", trend: "up" },
    { label: "Success Rate", value: "0.00%", change: "+0.00%", trend: "up" }
  ];

  useEffect(() => {
    let charIndex = 0;
    const currentFullText = heroTexts[textIndex];
    
    const typeWriter = () => {
      if (charIndex < currentFullText.length) {
        setCurrentText(currentFullText.substring(0, charIndex + 1));
        charIndex++;
        setTimeout(typeWriter, 300); // 300ms per character - much slower and readable
      } else {
        // Text is complete, wait 5 seconds then move to next
        setTimeout(() => {
          setTextIndex((prev) => (prev + 1) % heroTexts.length);
        }, 5000);
      }
    };
    
    // Start fresh with each new text
    setCurrentText("");
    setTimeout(typeWriter, 1000); // Initial delay before typing starts
  }, [textIndex]);

  useEffect(() => {
    const timer = setTimeout(() => setShowStats(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16">
      
      {/* Hero Content */}
      <div className="relative z-10 max-w-6xl mx-auto text-center">
        
        {/* Protocol Status */}
        <div className="mb-8 slide-up">
          <div className="inline-flex items-center space-x-3 px-4 py-2 glass rounded-full border border-white/20">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-mono text-green-400">PROTOCOL STATUS: ACTIVE</span>
            </div>
            <div className="w-px h-4 bg-white/20"></div>
            <span className="text-sm font-mono text-gray-300">BETA v1.0</span>
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 slide-up">
          <span className="block text-white mb-4">SYNAPSE</span>
          <span className="block text-2xl md:text-4xl lg:text-5xl font-semibold text-blue-400 min-h-[80px] flex items-center justify-center">
            {currentText}
            <span className="animate-pulse text-blue-400 ml-1">|</span>
          </span>
        </h1>

        {/* Description */}
        <div className="finance-card max-w-4xl mx-auto mb-12 slide-up" style={{ animationDelay: '0.2s' }}>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
            Experience the future of DeFi with our autonomous AI agents powered by advanced Markov Chain models. 
            Deploy intelligent strategies that leverage synthetic assets on the secure Rootstock Bitcoin network, 
            eliminating liquidity constraints while maximizing yield potential.
          </p>
          
          <div className="flex justify-center items-center mt-6 space-x-8">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-sm text-gray-400">Instant Deployment</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-sm text-gray-400">Bitcoin-Secured</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              <span className="text-sm text-gray-400">AI-Optimized</span>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 slide-up" style={{ animationDelay: '0.4s' }}>
          <button className="bg-blue-400 hover:bg-blue-500 text-white text-lg px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Get Started</span>
            </div>
          </button>
          <button className="bg-white hover:bg-gray-100 text-gray-900 text-lg px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Documentation</span>
            </div>
          </button>
        </div>

        {/* Protocol Statistics */}
        {showStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto slide-up" style={{ animationDelay: '0.6s' }}>
            {stats.map((stat, index) => (
              <div key={index} className="finance-card text-center">
                <div className="flex items-center justify-center space-x-1 mb-2">
                  <div className={`text-3xl font-bold mono ${
                    stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {stat.value}
                  </div>
                  <svg className={`w-4 h-4 ${
                    stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {stat.trend === 'up' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7l9.2 9.2M17 7v10H7" />
                    )}
                  </svg>
                </div>
                <div className="text-sm text-gray-400 mb-1">{stat.label}</div>
                <div className={`text-xs mono ${
                  stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stat.change}
                </div>
                <div className="progress-bar mt-2">
                  <div className="progress-fill" style={{ width: '0%' }}></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Technology Partners */}
        <div className="mt-16 slide-up" style={{ animationDelay: '0.8s' }}>
          <p className="text-sm text-gray-500 mb-4">Powered by leading blockchain technologies</p>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">RSK</span>
              </div>
              <span className="text-sm text-gray-400">Rootstock</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">F.AI</span>
              </div>
              <span className="text-sm text-gray-400">Fetch.ai</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">P</span>
              </div>
              <span className="text-sm text-gray-400">Pyth Network</span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default Hero;