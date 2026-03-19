"use client";

import { Clock, Code2, Cpu, Rocket, Users, FileLock } from "lucide-react";
import { motion } from "framer-motion";

export default function ComingSoonPage() {
  const features = [
    {
      title: "Multiplayer Squad Savings",
      icon: <Users className="text-blue-500" size={32} />,
      color: "from-blue-500/20 to-cyan-500/5",
      description: "Pool your capital with friends, families, or DAOs into a singular trustless smart contract. Members share proportional yields while collectively tracking real-time progress toward a shared vacation or treasury goal.",
      status: "Smart Contract in Audit"
    },
    {
      title: "Self-Repaying Loans",
      icon: <FileLock className="text-red-500" size={32} />,
      color: "from-red-500/20 to-orange-500/5",
      description: "Borrow up to 50% of your vault balance in stablecoins instantly. Because your collateral is locked in high-yield Yo-Protocol vaults, your debt mathematically pays itself off automatically, block by block, with zero liquidation risk.",
      status: "Architecture Drafted"
    },
    {
      title: "Smart DCA Automations",
      icon: <Cpu className="text-purple-500" size={32} />,
      color: "from-purple-500/20 to-pink-500/5",
      description: "Connect your wallet to Gelato Network execution tasks to automatically sweep USDC into your targeted savings goals every week. Never miss a saving milestone again.",
      status: "Awaiting Devnet Deployment"
    }
  ];

  return (
    <div className="max-w-5xl mx-auto py-12 space-y-16 animate-in fade-in duration-700">
      
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-secondary border border-border px-4 py-2 rounded-full text-sm font-medium text-muted-foreground">
          <Clock size={16} className="text-primary" /> Roadmap & Protocol Evolution
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight">
          Building the <br/><span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-emerald-400">Future of Yield</span>
        </h1>
        <p className="text-muted-foreground text-xl leading-relaxed">
          CowryChain is dedicated to remaining a 100% frontend-native interface prioritizing ultra-secure, standard ERC-4626 integrations. However, the following custom protocol modules are currently being engineered for our ultimate V2 Mainnet launch.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        {features.map((feature, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            key={feature.title} 
            className={`bg-gradient-to-b ${feature.color} border border-border p-8 rounded-3xl relative overflow-hidden group hover:border-border/80 transition-all`}
          >
            <div className="w-16 h-16 bg-background rounded-2xl flex items-center justify-center mb-8 border border-border shadow-xl">
              {feature.icon}
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-4 leading-tight">{feature.title}</h3>
            <p className="text-muted-foreground leading-relaxed mb-8">
              {feature.description}
            </p>

            <div className="pt-6 border-t border-border/50">
              <div className="text-xs font-bold uppercase tracking-widest text-[#6b9e7e] flex items-center gap-2">
                <Code2 size={14} /> {feature.status}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-20 p-12 bg-card border border-border rounded-[3rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px]" />
        <Rocket className="mx-auto text-primary mb-6" size={48} />
        <h2 className="text-3xl font-black text-white mb-4">Want early access?</h2>
        <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
          We push new features to our Base Sepolia testnet environment daily. Connect your wallet and enable notifications to be the first to test these custom smart contracts.
        </p>
        <button className="bg-primary hover:bg-emerald-600 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-xl shadow-primary/20">
          Join the Beta Waitlist
        </button>
      </div>

    </div>
  );
}
