import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Navbar from "../components/Navbar";
import { useWallet } from "../hooks/useWallet";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'code' | 'strategy' | 'analysis';
}

interface QuickAction {
  label: string;
  icon: string;
  action: () => void;
}

export default function Chatbot() {
  const [mounted, setMounted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [chatSize, setChatSize] = useState<'normal' | 'large' | 'fullscreen'>('normal');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Welcome to Monte-Carlo AI Assistant! I'm here to help you navigate the world of synthetic yield farming and Markov Chain strategies. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { isConnected, address } = useWallet();

  useEffect(() => {
    setMounted(true);
    inputRef.current?.focus();
    
    // Add keyboard shortcuts for size control
    const handleKeyDown = (event: KeyboardEvent) => {
      // F11 or Ctrl/Cmd + Shift + F for fullscreen
      if (event.key === 'F11' || 
          (event.key === 'f' && (event.ctrlKey || event.metaKey) && event.shiftKey)) {
        event.preventDefault();
        handleSizeChange(chatSize === 'fullscreen' ? 'normal' : 'fullscreen');
      }
      // Ctrl/Cmd + Shift + L for large
      if (event.key === 'l' && (event.ctrlKey || event.metaKey) && event.shiftKey) {
        event.preventDefault();
        handleSizeChange(chatSize === 'large' ? 'normal' : 'large');
      }
      // Escape key to exit fullscreen
      if (event.key === 'Escape' && chatSize === 'fullscreen') {
        handleSizeChange('normal');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [chatSize]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getChatContainerClasses = () => {
    switch (chatSize) {
      case 'large':
        return 'max-w-6xl mx-auto';
      case 'fullscreen':
        return 'fixed inset-0 z-50 p-4 bg-gray-900/95 backdrop-blur-xl';
      default:
        return 'max-w-4xl mx-auto';
    }
  };

  const getChatHeight = () => {
    switch (chatSize) {
      case 'large':
        return 'h-[75vh]';
      case 'fullscreen':
        return 'h-full';
      default:
        return 'h-[60vh]';
    }
  };

  const handleSizeChange = (size: 'normal' | 'large' | 'fullscreen') => {
    setChatSize(size);
    setIsFullscreen(size === 'fullscreen');
  };

  const quickActions: QuickAction[] = [
    {
      label: "Explain Markov Chains",
      icon: "🔗",
      action: () => sendMessage("Explain how Markov Chains work in synthetic yield farming")
    },
    {
      label: "Portfolio Strategy",
      icon: "📈",
      action: () => sendMessage("Suggest a portfolio strategy for a beginner")
    },
    {
      label: "Risk Analysis",
      icon: "⚠️",
      action: () => sendMessage("Analyze the risks in synthetic yield farming")
    },
    {
      label: "Deploy Agent",
      icon: "🤖",
      action: () => sendMessage("How do I deploy an autonomous trading agent?")
    }
  ];

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('markov') || lowerMessage.includes('chain')) {
      return "Markov Chains in Monte-Carlo are probabilistic models that help predict future states based on current conditions. In synthetic yield farming, they analyze market patterns, liquidity flows, and risk factors to optimize trading strategies automatically. Our agents use multi-state Markov models to adapt to changing market conditions in real-time.";
    }
    
    if (lowerMessage.includes('risk') || lowerMessage.includes('danger')) {
      return "Key risks in synthetic yield farming include: 1) Impermanent loss from price divergence 2) Smart contract vulnerabilities 3) Liquidity risks during market volatility 4) Oracle manipulation attacks. Our AI agents monitor these risks continuously and implement stop-loss mechanisms automatically.";
    }
    
    if (lowerMessage.includes('strategy') || lowerMessage.includes('portfolio')) {
      return "For beginners, I recommend starting with conservative strategies: 1) Diversify across multiple synthetic assets 2) Use lower leverage ratios (2-3x) 3) Set strict risk limits (max 5% portfolio per position) 4) Start with established protocols. Our Monte-Carlo simulation engine can backtest strategies before deployment.";
    }
    
    if (lowerMessage.includes('deploy') || lowerMessage.includes('agent')) {
      return "To deploy an autonomous agent: 1) Connect your wallet 2) Define your risk parameters 3) Choose a Markov Chain strategy template 4) Set your capital allocation 5) Monitor via our real-time dashboard. Agents can trade 24/7 and automatically rebalance based on market conditions.";
    }
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return `Hello${address ? ` ${address.slice(0, 6)}...${address.slice(-4)}` : ''}! I'm your Monte-Carlo AI assistant. I can help you understand synthetic yield farming, deploy trading agents, and optimize your DeFi strategies. What would you like to explore?`;
    }
    
    return "I understand you're interested in Monte-Carlo's advanced DeFi solutions. Could you be more specific about what you'd like to know? I can help with strategy optimization, risk management, agent deployment, or explain our Markov Chain technology in detail.";
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(text),
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputText);
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      <Head>
        <title>AI Assistant - Monte-Carlo</title>
        <meta name="description" content="Get help with synthetic yield farming and Markov Chain strategies from Monte-Carlo's AI assistant." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen relative overflow-hidden">
        {/* Background Grid */}
        <div className="fixed inset-0 grid-pattern opacity-20 pointer-events-none"></div>
        
        {/* Background Gradient Orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl float-effect"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl float-effect" style={{ animationDelay: '1s' }}></div>
        </div>

        <Navbar />
        
        <div className="pt-24 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-3 px-4 py-2 glass rounded-full border border-white/20 mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-mono text-green-400">AI ASSISTANT: ONLINE</span>
              </div>
              <div className="w-px h-4 bg-white/20"></div>
              <span className="text-sm font-mono text-gray-300">MARKOV v2.1</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Monte-Carlo AI Assistant
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Your intelligent guide to synthetic yield farming, Markov Chain strategies, and autonomous trading agents.
            </p>
          </div>

          {/* Chat Container */}
          <div className={getChatContainerClasses()}>
            <div className={`finance-card ${getChatHeight()} flex flex-col`}>
              {/* Chat Header with Controls */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-white">AI</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Monte-Carlo Assistant</h3>
                    <p className="text-xs text-gray-400">Powered by Markov Chain AI</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {/* Size Controls */}
                  <div className="flex items-center space-x-1 mr-2">
                    <button
                      onClick={() => handleSizeChange('normal')}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        chatSize === 'normal' 
                          ? 'text-blue-400 bg-blue-400/20' 
                          : 'text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                      title="Normal Size"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => handleSizeChange('large')}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        chatSize === 'large' 
                          ? 'text-blue-400 bg-blue-400/20' 
                          : 'text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                      title="Large Size"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <rect x="2" y="2" width="20" height="20" rx="2" ry="2"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => handleSizeChange('fullscreen')}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        chatSize === 'fullscreen' 
                          ? 'text-blue-400 bg-blue-400/20' 
                          : 'text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                      title="Fullscreen (F11)"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16v12H4z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M1 3h22v18H1z" />
                      </svg>
                    </button>
                  </div>
                  {chatSize === 'fullscreen' && (
                    <button
                      onClick={() => handleSizeChange('normal')}
                      className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                      title="Exit Fullscreen"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              {/* Messages */}
              <div className={`flex-1 overflow-y-auto p-6 space-y-4 ${isFullscreen ? 'max-h-none' : ''}`}>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-2xl ${
                        message.sender === 'user'
                          ? 'bg-blue-500 text-white ml-auto'
                          : 'glass border border-white/20 text-gray-100'
                      }`}
                    >
                      {message.sender === 'bot' && (
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-white">AI</span>
                          </div>
                          <span className="text-xs text-gray-400 font-mono">Monte-Carlo Assistant</span>
                        </div>
                      )}
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                      <div className={`text-xs mt-2 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] p-4 rounded-2xl glass border border-white/20">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-white">AI</span>
                        </div>
                        <span className="text-xs text-gray-400 font-mono">Monte-Carlo Assistant</span>
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions */}
              <div className={`px-6 py-4 border-t border-white/10 ${chatSize === 'fullscreen' ? 'bg-gray-900/50' : ''}`}>
                <div className={`flex flex-wrap gap-2 mb-4 ${chatSize === 'fullscreen' ? 'justify-center' : ''}`}>
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={action.action}
                      className="flex items-center space-x-2 px-3 py-2 text-sm bg-white/5 hover:bg-white/10 rounded-lg border border-white/20 transition-all duration-200 hover:scale-105"
                    >
                      <span>{action.icon}</span>
                      <span className="text-gray-300">{action.label}</span>
                    </button>
                  ))}
                </div>

                {/* Input Form */}
                <form onSubmit={handleSubmit} className="flex space-x-3">
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Ask me about Markov Chains, strategies, or deployment..."
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                      disabled={isTyping}
                    />
                    {!isConnected && (
                      <div className="absolute right-3 top-3">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={!inputText.trim() || isTyping}
                    className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    <span>Send</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Connection Status */}
            {!isConnected && (
              <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <p className="text-yellow-400 font-medium">Wallet not connected</p>
                    <p className="text-sm text-gray-400">Connect your wallet to access advanced features like agent deployment and portfolio analysis.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Keyboard Shortcuts Help */}
            <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <p className="text-blue-400 font-medium text-sm">Keyboard Shortcuts</p>
                  <div className="text-xs text-gray-400 mt-1 space-y-1">
                    <div className="flex justify-between">
                      <span>Fullscreen:</span>
                      <kbd className="px-1 bg-gray-800 rounded text-gray-300">F11</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span>Large View:</span>
                      <kbd className="px-1 bg-gray-800 rounded text-gray-300">Ctrl+Shift+L</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span>Exit Fullscreen:</span>
                      <kbd className="px-1 bg-gray-800 rounded text-gray-300">Esc</kbd>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}