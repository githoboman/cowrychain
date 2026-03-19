"use client";

import { Navbar } from "./Navbar";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ArrowRight, Shield, Zap, TrendingUp, Globe, Smartphone, PiggyBank, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";
import { useTotalTvl, useVaults } from "@yo-protocol/react";
import { formatUnits } from "viem";
import { formatAmount } from "@/lib/utils";

export function LandingPage() {
  const { tvl } = useTotalTvl();
  const { vaults } = useVaults();
  
  const protocolTvl = (tvl as any)?.totalTvl ?? 0n;
  const activeVaults = vaults?.length ?? 0;

  const features = [
    {
      icon: <Zap className="text-primary" />,
      title: "100% Gasless. Always.",
      description: "Sign transactions with Coinbase Smart Wallet. We pay the gas. No hidden fees, no friction."
    },
    {
      icon: <Shield className="text-primary" />,
      title: "Gamified Savings",
      description: "Unlock premium on-chain badges based on your verified Collateral balance. Prove your Diamond Hands."
    },
    {
      icon: <TrendingUp className="text-primary" />,
      title: "Auto-Zapping",
      description: "Swap cbBTC, DEGEN, or any Token seamlessly into Vault shares in one unified click via 0x Router."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 sm:px-10 lg:px-20 overflow-hidden">
        {/* Background glow items */}
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-x-1/2 opacity-30" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] translate-x-1/4 opacity-20" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-8 uppercase tracking-widest">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Next-Gen Savings on Base
            </div>
            
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-[1.1] mb-8">
              The smartest way <br />
              to <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-emerald-400">save onchain.</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-10 max-w-lg leading-relaxed">
              Earn institutional-grade yield on your USDC and ETH without the complexity. 
              Non-custodial, permissionless, and built on the future of finance.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <ConnectButton.Custom>
                {({ openConnectModal }) => (
                  <button
                    onClick={openConnectModal}
                    className="w-full sm:w-auto px-8 py-5 rounded-2xl font-bold bg-primary text-white shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.03] transition-all flex items-center justify-center gap-2 text-lg"
                  >
                    Start Saving Now <ArrowRight size={20} />
                  </button>
                )}
              </ConnectButton.Custom>
              <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                <Globe size={18} />
                <span>Join {formatAmount(protocolTvl, 6, 0)}+ savers</span>
              </div>
            </div>
          </motion.div>

          {/* Visual / Mockup Area */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="relative glass-card rounded-[40px] p-8 aspect-square flex flex-col justify-between overflow-hidden group">
               <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                    <PiggyBank className="text-primary" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">Your Savings</p>
                    <p className="text-3xl font-bold">${formatAmount(protocolTvl, 6, 2)}</p>
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "65%" }}
                      transition={{ duration: 2, delay: 1 }}
                      className="h-full bg-primary" 
                    />
                  </div>
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-muted-foreground">Earning Rate</span>
                    <span className="text-primary">Variable APY</span>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-3xl bg-primary/10 border border-primary/20 flex flex-col items-center gap-1 italic">
                    <span className="text-xs uppercase font-bold text-primary not-italic">Daily Projection</span>
                    <span className="text-xl font-bold">+${formatAmount(protocolTvl / (365n * 10n), 6, 2)}</span>
                  </div>
                  <div className="p-4 rounded-3xl bg-secondary/50 border border-border flex flex-col items-center gap-1">
                    <span className="text-xs uppercase font-bold text-muted-foreground">Active Systems</span>
                    <span className="text-xl font-bold text-foreground">{activeVaults} Vaults</span>
                  </div>
               </div>

               {/* Absolute decorative icons */}
               <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
            </div>
            
            {/* Floating badges */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 glass px-5 py-3 rounded-2xl border border-primary/30 shadow-xl flex items-center gap-3"
            >
              <RefreshCcw className="text-primary animate-spin-slow" />
              <div className="text-xs">
                <p className="font-bold">Auto-Compounding</p>
                <p className="text-muted-foreground">Every block</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4">Built for the future of savings.</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              DeFi doesn't have to be difficult. We've combined security, 
              yield, and simplicity into one powerful platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="p-8 rounded-[32px] glass-card group hover:border-primary/50 transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {f.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Showcase - Explaining "What we did" */}
      <section className="py-24 px-6 border-y border-border/50 bg-secondary/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-bold mb-4">Our Engineering Journey</h2>
              <p className="text-muted-foreground text-lg">
                We've spent thousands of hours perfecting every pixel and line of code 
                to bring you the most robust savings experience on Base.
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-background border border-border text-xs font-bold uppercase tracking-widest text-primary">
              <Smartphone size={14} />
              v1.0.0 Stable
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Live Gamification",
                desc: "Real-time Wagmi scanners award animated cryptographic badges the moment your Collateral crosses milestones.",
                tag: "Achievements"
              },
              {
                title: "Zero-Gas Engine",
                desc: "Integrated EIP-5792 payload capabilities completely eliminate transaction friction for Smart Wallet users.",
                tag: "Paymasters"
              },
              {
                title: "Cross-Chain Zapping",
                desc: "Live 0x API integration automatically routes any token deposited into native YO Protocol vault shares.",
                tag: "Routing"
              },
              {
                title: "Network Telemetry",
                desc: "A globally active Gas Tracker monitors the Base network congestion heartbeat dynamically block-by-block.",
                tag: "Analytics"
              }
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-[2.5rem] bg-background border border-border/60 hover:border-primary/40 transition-all group">
                <div className="text-[10px] font-black uppercase tracking-widest text-primary mb-4 px-2 py-1 rounded-lg bg-primary/5 inline-block">
                  {item.tag}
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust area */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
           <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-full bg-blue-600" />
             <span className="font-bold text-2xl tracking-tighter">BASE</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-full bg-emerald-500" />
             <span className="font-bold text-2xl tracking-tighter uppercase">YO Protocol</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-full bg-orange-500" />
             <span className="font-bold text-2xl tracking-tighter">UNISWAP</span>
           </div>
           <div className="flex items-center gap-2 text-2xl font-black">
             <span>AERODROME</span>
           </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto rounded-[48px] bg-primary p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 relative">Ready to start earning?</h2>
          <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto relative">
            Connect your wallet and start your onchain savings journey in less than 60 seconds.
          </p>
          <div className="flex justify-center relative">
            <ConnectButton.Custom>
               {({ openConnectModal }) => (
                 <button 
                  onClick={openConnectModal}
                  className="px-10 py-5 rounded-2xl bg-white text-primary font-bold text-xl hover:scale-[1.05] transition-all shadow-xl"
                 >
                   Connect Wallet
                 </button>
               )}
            </ConnectButton.Custom>
          </div>
        </div>
      </section>
    </div>
  );
}
