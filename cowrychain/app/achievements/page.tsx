"use client";

import { useAccount } from "wagmi";
import { useTokenBalance } from "@yo-protocol/react";
import { VAULTS } from "@yo-protocol/core";
import { formatUnits } from "viem";
import { Trophy, Star, ShieldCheck, Zap, Medal, Rocket, Lock } from "lucide-react";
import { motion } from "framer-motion";

export default function AchievementsPage() {
  const { address, isConnected } = useAccount();
  const yoUsdAddress = (VAULTS as any)["yoUSD"]?.address;
  const { balance } = useTokenBalance(yoUsdAddress as any, address);

  const rawCollateral = (balance as any)?.value ?? 0n;
  const collateralBalance = Number(formatUnits(rawCollateral, 6));

  const badges = [
    {
      id: "shrimp",
      title: "Shrimp Saver",
      description: "Deposit your first dollar into a Vault.",
      icon: <Star className="text-yellow-500" size={32} />,
      color: "from-yellow-400/20 to-yellow-600/10",
      unlocked: collateralBalance >= 1,
    },
    {
      id: "dolphin",
      title: "Dolphin Dolphin",
      description: "Accumulate over $100 in high-yield savings.",
      icon: <ShieldCheck className="text-blue-400" size={32} />,
      color: "from-blue-400/20 to-blue-600/10",
      unlocked: collateralBalance >= 100,
    },
    {
      id: "whale",
      title: "Base Whale",
      description: "Diamond hands. Push past $1,000 in active TVL.",
      icon: <Trophy className="text-primary" size={32} />,
      color: "from-primary/20 to-emerald-600/10",
      unlocked: collateralBalance >= 1000,
    },
    {
      id: "zap",
      title: "Cross-Chain native",
      description: "Execute 5 auto-zaps using the 0x Router.",
      icon: <Zap className="text-orange-400" size={32} />,
      color: "from-orange-400/20 to-red-600/10",
      unlocked: false, // Locked until we track zap txs
    },
    {
      id: "degen",
      title: "Early Adopter",
      description: "Save onchain during the CowryChain V1 Beta.",
      icon: <Rocket className="text-purple-400" size={32} />,
      color: "from-purple-400/20 to-pink-600/10",
      unlocked: true,
    }
  ];

  const unlockedCount = badges.filter(b => b.unlocked).length;

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 pt-10">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <Medal size={32} />
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
          Your <span className="text-primary">Achievements</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Unlock exclusive on-chain badges as your savings grow. Collect them all to unlock future protocol perks.
        </p>
      </div>

      {!isConnected ? (
        <div className="text-center p-12 bg-secondary/30 rounded-3xl border border-border">
          <Lock className="mx-auto text-muted-foreground mb-4" size={48} />
          <h2 className="text-xl font-bold text-white mb-2">Connect to view Badges</h2>
          <p className="text-muted-foreground">We need to scan your Base L2 history to verify your achievements.</p>
        </div>
      ) : (
        <>
          <div className="bg-card border border-border p-6 rounded-3xl flex justify-between items-center max-w-3xl mx-auto shadow-xl">
            <div className="font-bold text-lg">Progress</div>
            <div className="text-primary font-black text-2xl">{unlockedCount} / {badges.length}</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {badges.map((badge, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={badge.id}
                className={`relative overflow-hidden p-8 rounded-3xl border transition-all ${
                  badge.unlocked 
                    ? `bg-gradient-to-br ${badge.color} border-primary/30 shadow-lg shadow-primary/5` 
                    : 'bg-secondary/20 border-border opacity-60 grayscale'
                }`}
              >
                {!badge.unlocked && (
                  <div className="absolute top-4 right-4 text-muted-foreground">
                    <Lock size={16} />
                  </div>
                )}
                <div className="w-16 h-16 bg-background rounded-2xl flex items-center justify-center mb-6 shadow-xl border border-border">
                  {badge.icon}
                </div>
                <h3 className={`text-xl font-bold mb-2 ${badge.unlocked ? 'text-white' : 'text-muted-foreground'}`}>
                  {badge.title}
                </h3>
                <p className="text-sm text-foreground/70 leading-relaxed">
                  {badge.description}
                </p>
                
                {badge.unlocked && (
                  <div className="mt-6 text-xs font-bold uppercase tracking-widest text-[#6b9e7e] flex items-center gap-1">
                    <ShieldCheck size={14} /> Verified internally
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
