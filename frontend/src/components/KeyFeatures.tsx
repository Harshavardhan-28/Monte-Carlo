import { useState } from "react";

const KeyFeatures = () => {
  const [activeFeature, setActiveFeature] = useState<number>(0);

  const features = [
    {
      title: "AI-Powered Strategy Optimization",
      description: "Advanced machine learning algorithms analyze market patterns and optimize yield farming strategies in real-time, adapting to changing market conditions automatically.",
      icon: "🤖",
      stats: {
        accuracy: "97.3%",
        efficiency: "+340%",
        automation: "100%"
      },
      benefits: [
        "Real-time market analysis",
        "Automated strategy adjustments",
        "Risk mitigation protocols",
        "Performance optimization"
      ]
    },
    {
      title: "Markov Chain Prediction Models",
      description: "Sophisticated probabilistic models predict optimal asset allocation and timing decisions, leveraging historical data patterns to forecast future market states.",
      icon: "⛓️",
      stats: {
        prediction: "94.7%",
        states: "256",
        transitions: "∞"
      },
      benefits: [
        "Predictive asset allocation",
        "State transition modeling",
        "Probability-based decisions",
        "Historical pattern analysis"
      ]
    },
    {
      title: "Synthetic Asset Generation",
      description: "Create synthetic representations of any asset without requiring direct ownership, enabling exposure to diverse markets while maintaining capital efficiency.",
      icon: "🔬",
      stats: {
        assets: "1000+",
        liquidity: "∞",
        efficiency: "95%"
      },
      benefits: [
        "Unlimited asset exposure",
        "No liquidity constraints",
        "Capital efficiency",
        "Diversification opportunities"
      ]
    },
    {
      title: "Rootstock Bitcoin Security",
      description: "Built on the Rootstock network, leveraging Bitcoin's security model while enabling smart contract functionality and cross-chain interoperability.",
      icon: "🔒",
      stats: {
        security: "Bitcoin-level",
        uptime: "99.9%",
        validators: "5000+"
      },
      benefits: [
        "Bitcoin-secured network",
        "Smart contract capabilities",
        "Cross-chain bridges",
        "Decentralized validation"
      ]
    },
    {
      title: "Autonomous Agent Deployment",
      description: "Deploy intelligent agents that operate independently, executing complex strategies 24/7 without human intervention while maintaining strict risk parameters.",
      icon: "🚀",
      stats: {
        agents: "Active 24/7",
        response: "<100ms",
        strategies: "Dynamic"
      },
      benefits: [
        "24/7 autonomous operation",
        "Multi-strategy execution",
        "Risk parameter enforcement",
        "Performance monitoring"
      ]
    },
    {
      title: "Cross-Chain Yield Aggregation",
      description: "Aggregate yield opportunities across multiple blockchain networks, automatically routing capital to the highest-performing strategies while managing cross-chain risks.",
      icon: "🌐",
      stats: {
        networks: "12+",
        protocols: "50+",
        yield: "Variable"
      },
      benefits: [
        "Multi-chain optimization",
        "Yield opportunity scanning",
        "Automated capital routing",
        "Risk-adjusted returns"
      ]
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block glass rounded-full px-6 py-2 mb-6">
            <span className="text-sm font-mono text-cyan-400">KEY FEATURES</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Advanced <span className="text-blue-400 font-bold">DeFi Technology</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience the next generation of decentralized finance with our cutting-edge AI-powered platform 
            that revolutionizes yield farming and synthetic asset management.
          </p>
        </div>

        {/* Feature Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {features.map((feature, index) => (
            <button
              key={index}
              onClick={() => setActiveFeature(index)}
              className={`px-4 py-2 rounded-full text-sm font-mono transition-all duration-300 ${
                activeFeature === index
                  ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                  : 'glass text-gray-300 hover:text-white'
              }`}
            >
              {feature.icon} {feature.title.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Active Feature Display */}
        <div className="finance-card max-w-6xl mx-auto mb-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            
            {/* Feature Content */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center text-2xl">
                  {features[activeFeature].icon}
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white">
                  {features[activeFeature].title}
                </h3>
              </div>
              
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                {features[activeFeature].description}
              </p>

              {/* Benefits List */}
              <div className="space-y-3">
                {features[activeFeature].benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                    <span className="text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature Stats */}
            <div className="space-y-6">
              
              {/* Performance Metrics */}
              <div className="bg-gray-900/50 rounded-2xl p-6">
                <h4 className="text-lg font-bold text-white mb-4">Performance Metrics</h4>
                <div className="space-y-4">
                  {Object.entries(features[activeFeature].stats).map(([key, value], index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-400 capitalize">{key}</span>
                        <span className="font-mono text-cyan-400 font-bold">{value}</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill transition-all duration-1000"
                          style={{ 
                            width: typeof value === 'string' && value.includes('%') 
                              ? value 
                              : `${85 + index * 5}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Indicators */}
              <div className="grid grid-cols-2 gap-4">
                <div className="glass rounded-xl p-4 text-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full mx-auto mb-2 animate-pulse"></div>
                  <div className="text-sm font-mono text-green-400">ACTIVE</div>
                  <div className="text-xs text-gray-400">System Status</div>
                </div>
                <div className="glass rounded-xl p-4 text-center">
                  <div className="w-3 h-3 bg-blue-400 rounded-full mx-auto mb-2 animate-pulse"></div>
                  <div className="text-sm font-mono text-blue-400">OPTIMAL</div>
                  <div className="text-xs text-gray-400">Performance</div>
                </div>
              </div>

              {/* Integration Status */}
              <div className="glass rounded-xl p-4">
                <h5 className="text-sm font-bold text-white mb-3">Integration Status</h5>
                <div className="space-y-2">
                  {[
                    { name: "Rootstock Network", status: "Connected", color: "text-green-400" },
                    { name: "AI Model", status: "Training", color: "text-blue-400" },
                    { name: "Liquidity Pools", status: "Active", color: "text-cyan-400" }
                  ].map((integration, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">{integration.name}</span>
                      <span className={`text-xs font-mono ${integration.color}`}>
                        {integration.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              onClick={() => setActiveFeature(index)}
              className={`finance-card cursor-pointer transition-all duration-300 hover:scale-105 ${
                activeFeature === index ? 'ring-2 ring-cyan-400 shadow-lg shadow-cyan-400/20' : ''
              }`}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center text-xl">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-white">{feature.title}</h3>
              </div>
              
              <p className="text-sm text-gray-300 mb-4 line-clamp-3">
                {feature.description}
              </p>

              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  {Object.values(feature.stats).slice(0, 2).map((stat, statIndex) => (
                    <div key={statIndex} className="text-xs font-mono text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded">
                      {stat}
                    </div>
                  ))}
                </div>
                <svg 
                  className={`w-5 h-5 transition-transform duration-300 ${
                    activeFeature === index ? 'text-cyan-400 rotate-90' : 'text-gray-400'
                  }`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Technology Stack */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-white mb-8">Built on Advanced Technology</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              "Machine Learning", "Markov Chains", "Rootstock Network", 
              "Smart Contracts", "Cross-Chain Bridges", "Synthetic Assets",
              "Yield Optimization", "Risk Management", "Autonomous Agents"
            ].map((tech, index) => (
              <div key={tech} className="glass rounded-full px-4 py-2">
                <span className="text-sm text-gray-300">{tech}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default KeyFeatures;