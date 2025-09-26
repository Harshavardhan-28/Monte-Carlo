import { useState, useEffect } from "react";

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'processing' | 'complete'>('idle');

  const steps = [
    {
      title: "On-Chain Foundation",
      subtitle: "Blockchain Infrastructure",
      description: "Deploy smart contracts on the Rootstock network, establishing secure on-chain foundations for synthetic asset creation and yield farming operations.",
      details: [
        "Smart contract deployment on Rootstock network",
        "Cross-chain bridge establishment for multi-network support",
        "Liquidity pool initialization with dynamic parameters",
        "Security audit and validation protocols implementation"
      ],
      icon: "⛓️",
      color: "from-blue-400 to-blue-600",
      metrics: {
        security: "Bitcoin-level",
        speed: "< 30s blocks",
        cost: "Low gas fees"
      }
    },
    {
      title: "Agentic Layer",
      subtitle: "AI-Powered Automation",
      description: "Autonomous AI agents analyze market conditions, execute trades, and manage portfolios using advanced machine learning algorithms and real-time data processing.",
      details: [
        "AI agent deployment with decision-making capabilities",
        "Real-time market data ingestion and processing",
        "Strategy execution with risk management protocols",
        "Performance monitoring and optimization feedback loops"
      ],
      icon: "🤖",
      color: "from-cyan-400 to-cyan-600",
      metrics: {
        response: "< 100ms",
        accuracy: "97.3%",
        uptime: "99.9%"
      }
    },
    {
      title: "Predictive Model",
      subtitle: "Markov Chain Intelligence",
      description: "Advanced Markov Chain models predict optimal asset allocation and timing decisions by analyzing historical patterns and calculating probability transitions.",
      details: [
        "Markov Chain model training on historical data",
        "State transition probability calculations",
        "Predictive asset allocation recommendations",
        "Continuous model refinement and validation"
      ],
      icon: "📊",
      color: "from-purple-400 to-purple-600",
      metrics: {
        states: "256+",
        confidence: "94.7%",
        predictions: "Real-time"
      }
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase('processing');
      setTimeout(() => {
        setAnimationPhase('complete');
        setTimeout(() => {
          setAnimationPhase('idle');
          setActiveStep(prev => (prev + 1) % steps.length);
        }, 1000);
      }, 2000);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block glass rounded-full px-6 py-2 mb-6">
            <span className="text-sm font-mono text-cyan-400">HOW IT WORKS</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Three-Layer <span className="gradient-text">Architecture</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our sophisticated system operates through three interconnected layers that work in harmony 
            to deliver optimal yield farming results with minimal risk.
          </p>
        </div>

        {/* Architecture Flow */}
        <div className="finance-card max-w-6xl mx-auto mb-16">
          
          {/* Layer Navigation */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-1 bg-gray-900/50 rounded-full p-1">
              {steps.map((step, index) => (
                <button
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className={`px-4 py-2 rounded-full text-sm font-mono transition-all duration-300 ${
                    activeStep === index
                      ? 'bg-cyan-500 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Layer {index + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Active Layer Display */}
          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            
            {/* Layer Information */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-4 mb-6">
                <div className={`w-16 h-16 bg-gradient-to-br ${steps[activeStep].color} rounded-2xl flex items-center justify-center text-3xl ${
                  animationPhase === 'processing' ? 'animate-pulse' : ''
                }`}>
                  {steps[activeStep].icon}
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">
                    {steps[activeStep].title}
                  </h3>
                  <p className="text-lg text-cyan-400 font-mono">
                    {steps[activeStep].subtitle}
                  </p>
                </div>
              </div>

              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                {steps[activeStep].description}
              </p>

              {/* Process Details */}
              <div className="space-y-4">
                {steps[activeStep].details.map((detail, index) => (
                  <div 
                    key={index} 
                    className={`flex items-start space-x-3 transition-all duration-500 ${
                      animationPhase === 'processing' && index <= 1 ? 'text-cyan-400' : ''
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 transition-all duration-500 ${
                      animationPhase === 'complete' || (animationPhase === 'processing' && index <= 1)
                        ? 'border-cyan-400 bg-cyan-400 text-gray-900'
                        : 'border-gray-600'
                    }`}>
                      {animationPhase === 'complete' || (animationPhase === 'processing' && index <= 1) ? (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span className="text-xs font-bold">{index + 1}</span>
                      )}
                    </div>
                    <span className="text-gray-300">{detail}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Layer Metrics */}
            <div>
              <div className="bg-gray-900/50 rounded-2xl p-6 mb-6">
                <h4 className="text-lg font-bold text-white mb-4">Layer Metrics</h4>
                <div className="space-y-4">
                  {Object.entries(steps[activeStep].metrics).map(([key, value], index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-400 capitalize">{key}</span>
                        <span className="font-mono text-cyan-400 font-bold">{value}</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className={`progress-fill transition-all duration-1000 ${
                            animationPhase === 'processing' ? 'animate-pulse' : ''
                          }`}
                          style={{ width: `${90 - index * 5}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Display */}
              <div className="glass rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-white">Layer Status</span>
                  <div className={`w-3 h-3 rounded-full ${
                    animationPhase === 'idle' ? 'bg-blue-400' :
                    animationPhase === 'processing' ? 'bg-yellow-400 animate-pulse' :
                    'bg-green-400'
                  }`}></div>
                </div>
                <div className={`text-sm font-mono ${
                  animationPhase === 'idle' ? 'text-blue-400' :
                  animationPhase === 'processing' ? 'text-yellow-400' :
                  'text-green-400'
                }`}>
                  {animationPhase === 'idle' ? 'READY' :
                   animationPhase === 'processing' ? 'PROCESSING' :
                   'COMPLETE'}
                </div>
              </div>
            </div>
          </div>

          {/* Data Flow Visualization */}
          <div className="bg-gray-900/30 rounded-2xl p-6">
            <h4 className="text-lg font-bold text-white mb-6 text-center">Data Flow Visualization</h4>
            
            <div className="flex items-center justify-between relative">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center relative z-10">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-xl mb-2 transition-all duration-500 ${
                    index === activeStep ? 'scale-110 shadow-lg' : ''
                  }`}>
                    {step.icon}
                  </div>
                  <div className="text-xs text-gray-400 text-center max-w-20">
                    {step.title}
                  </div>
                  
                  {/* Connection Lines */}
                  {index < steps.length - 1 && (
                    <div className="absolute top-6 left-12 w-20 md:w-32 h-0.5 bg-gradient-to-r from-cyan-400/50 to-transparent">
                      <div className={`h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-1000 ${
                        activeStep === index && animationPhase === 'processing' ? 'animate-pulse' : ''
                      }`} style={{ width: activeStep > index ? '100%' : '0%' }}></div>
                    </div>
                  )}
                </div>
              ))}
              
              {/* Flow Animation */}
              <div className="absolute top-6 left-0 w-full h-0.5 pointer-events-none">
                <div className={`w-2 h-2 bg-cyan-400 rounded-full shadow-lg transition-all duration-2000 ${
                  animationPhase === 'processing' ? 'animate-pulse' : ''
                }`} style={{
                  transform: `translateX(${activeStep * 33}%)`,
                  left: '1rem'
                }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Integration Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="finance-card text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
              🔗
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Blockchain Integration</h3>
            <p className="text-gray-300 mb-4">Seamless integration with multiple blockchain networks through secure cross-chain bridges and smart contract interfaces.</p>
            <div className="flex justify-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-mono text-green-400">CONNECTED</span>
            </div>
          </div>

          <div className="finance-card text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
              🧠
            </div>
            <h3 className="text-xl font-bold text-white mb-3">AI Processing</h3>
            <p className="text-gray-300 mb-4">Advanced machine learning models process market data and execute intelligent trading strategies with human-level decision making.</p>
            <div className="flex justify-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-mono text-blue-400">LEARNING</span>
            </div>
          </div>

          <div className="finance-card text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
              📈
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Yield Optimization</h3>
            <p className="text-gray-300 mb-4">Continuous optimization of yield farming strategies through predictive modeling and automated portfolio rebalancing.</p>
            <div className="flex justify-center space-x-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-mono text-cyan-400">OPTIMIZING</span>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="finance-card max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Get Started?</h3>
            <p className="text-gray-300 mb-6">
              Experience the power of AI-driven DeFi with our three-layer architecture. 
              Deploy your first autonomous agent today.
            </p>
            <button className="btn-primary text-lg px-8 py-4">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Launch Platform</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;