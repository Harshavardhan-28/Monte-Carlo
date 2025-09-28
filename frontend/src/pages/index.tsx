import { useState, useEffect } from "react";
import Head from "next/head";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import MarkovChain from "../components/MarkovChain";
import KeyFeatures from "../components/KeyFeatures";
import HowItWorks from "../components/HowItWorks";
import Footer from "../components/Footer";
import WalletInfo from "../components/WalletInfo";
import { useWallet } from "../hooks/useWallet";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { isConnected } = useWallet();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Monte-Carlo - Agent-Driven Synthetic Yield Farming Protocol</title>
        <meta name="description" content="Experience the future of DeFi with AI-powered synthetic yield farming. Deploy autonomous agents using advanced Markov Chain models on Rootstock." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen relative overflow-x-hidden">
        {/* Background Grid */}
        <div className="fixed inset-0 grid-pattern opacity-20 pointer-events-none"></div>
        
        {/* Background Gradient Orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl float-effect"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl float-effect" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl float-effect" style={{ animationDelay: '2s' }}></div>
        </div>

        <Navbar />
        
        {/* Wallet Info - Show when connected */}
        {mounted && isConnected && (
          <div className="fixed top-20 right-4 z-40">
            <WalletInfo />
          </div>
        )}
        
        <Hero />
        <MarkovChain />
        <KeyFeatures />
        <HowItWorks />
        <Footer />
      </div>
    </>
  );
}
