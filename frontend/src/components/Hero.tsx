import TextType from "./TextType";
import Link from "next/link";

const Hero = () => {
  const heroTexts = [
    "Agent-Driven Synthetic Yield Farming",
    "AI-Powered DeFi Innovation", 
    "Advanced Markov Chain Strategies",
    "Rootstock Bitcoin Foundation"
  ];

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
          <span className="block text-white mb-4">MONTE-CARLO</span>
          <span className="block text-2xl md:text-4xl lg:text-5xl font-semibold text-blue-400 min-h-[80px] flex items-center justify-center">
            <TextType
              text={heroTexts}
              typingSpeed={50}
              deletingSpeed={30}
              pauseDuration={2000}
              className="text-blue-400"
              cursorClassName="text-blue-400"
              style={{ color: '#60a5fa' }}
              variableSpeed={{ min: 30, max: 70 }}
              onSentenceComplete={() => {}}
            />
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
          <Link href="/chatbot">
            <button className="bg-blue-400 hover:bg-blue-500 text-white text-lg px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Get Started</span>
              </div>
            </button>
          </Link>
          <Link href="/chatbot">
            <button className="bg-white hover:bg-gray-100 text-gray-900 text-lg px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Launch Platform</span>
              </div>
            </button>
          </Link>
        </div>

        

      </div>
    </section>
  );
};

export default Hero;