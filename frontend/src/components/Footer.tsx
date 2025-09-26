const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = {
    platform: [
      { name: "Dashboard", href: "#" },
      { name: "Strategies", href: "#" },
      { name: "Portfolio", href: "#" },
      { name: "Analytics", href: "#" }
    ],
    resources: [
      { name: "Documentation", href: "#" },
      { name: "API Reference", href: "#" },
      { name: "Tutorials", href: "#" },
      { name: "Blog", href: "#" }
    ],
    protocol: [
      { name: "Governance", href: "#" },
      { name: "Security", href: "#" },
      { name: "Audits", href: "#" },
      { name: "Bug Bounty", href: "#" }
    ],
    community: [
      { name: "Discord", href: "#" },
      { name: "Telegram", href: "#" },
      { name: "Twitter", href: "#" },
      { name: "GitHub", href: "#" }
    ]
  };

  const stats = [
    { label: "Total Value Locked", value: "$0M" },
    { label: "Active Users", value: "0" },
    { label: "Transactions", value: "0" },
    { label: "Networks", value: "12+" }
  ];

  return (
    <footer className="relative bg-gray-900/50 backdrop-blur-sm border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Protocol Stats */}
        <div className="py-12 border-b border-white/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2 mono">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-12 grid md:grid-cols-2 lg:grid-cols-6 gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center">
                  <div className="w-3 h-3 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full"></div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white">SYNAPSE</h3>
            </div>
            
            <p className="text-gray-400 mb-6 leading-relaxed">
              Advanced AI-powered DeFi protocol leveraging Markov Chain models and synthetic assets 
              for optimal yield farming on the Rootstock Bitcoin network.
            </p>

            {/* Network Status */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-400 font-mono">Rootstock Network: ONLINE</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-blue-400 font-mono">AI Agents: ACTIVE</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-cyan-400 font-mono">Protocol: v1.0-beta</span>
              </div>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Platform</h4>
            <ul className="space-y-3">
              {footerLinks.platform.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-gray-400 hover:text-white transition-colors duration-200">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-gray-400 hover:text-white transition-colors duration-200">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Protocol Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Protocol</h4>
            <ul className="space-y-3">
              {footerLinks.protocol.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-gray-400 hover:text-white transition-colors duration-200">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Community Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Community</h4>
            <ul className="space-y-3">
              {footerLinks.community.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center space-x-2">
                    <span>{link.name}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Security & Compliance */}
        <div className="py-8 border-t border-white/10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            
            {/* Security Badges */}
            <div>
              <h5 className="text-sm font-bold text-white mb-4">Security & Audits</h5>
              <div className="flex flex-wrap gap-3">
                {[
                  { name: "Smart Contract Audited", status: "Pending" },
                  { name: "Bug Bounty Program", status: "Active" },
                  { name: "Open Source", status: "Verified" }
                ].map((badge, index) => (
                  <div key={index} className="glass rounded-lg px-3 py-2 text-center">
                    <div className="text-xs text-gray-300 mb-1">{badge.name}</div>
                    <div className={`text-xs font-mono ${
                      badge.status === 'Active' || badge.status === 'Verified' ? 'text-green-400' : 'text-yellow-400'
                    }`}>
                      {badge.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter Signup */}
            <div>
              <h5 className="text-sm font-bold text-white mb-4">Stay Updated</h5>
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-colors"
                />
                <button className="btn-primary px-6">
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Get updates on new features, security patches, and protocol updates.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            
            {/* Copyright */}
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <p className="text-sm text-gray-400">
                © {currentYear} Synapse Protocol. All rights reserved.
              </p>
              <div className="flex space-x-4 text-sm">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookies</a>
              </div>
            </div>

            {/* Version & Build Info */}
            <div className="flex items-center space-x-4 text-xs text-gray-400 font-mono">
              <span>v1.0.0-beta</span>
              <span>•</span>
              <span>Build #{Math.floor(Math.random() * 1000) + 1000}</span>
              <span>•</span>
              <span>Rootstock Mainnet</span>
            </div>
          </div>
        </div>

        {/* Background Pattern */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent"></div>
      </div>
    </footer>
  );
};

export default Footer;