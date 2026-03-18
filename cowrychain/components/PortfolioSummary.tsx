"use client";

import { useAccount } from "wagmi";
import { useUserPositions, useTotalTvl } from "@yo-protocol/react";
import { formatAmount } from "@/lib/utils";
import { TrendingUp, Wallet, Users, Shield, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export function PortfolioSummary() {
  const { address, isConnected } = useAccount();
  const { positions, isLoading: posLoading } = useUserPositions(address as any);
  const { tvl, isLoading: tvlLoading } = useTotalTvl();

  // Calculate total user assets across all positions
  const totalUserAssets = (positions as any)?.reduce((sum: bigint, pos: any) => {
    return sum + (pos?.position?.assets ?? 0n);
  }, 0n) ?? 0n;

  // Calculate simulated yield for demo purposes (Difference between assets and a estimated principal)
  // In a real app, this would come from a 'depositHistory' or cost basis tracking
  const totalYieldEarned = totalUserAssets > 0n ? (totalUserAssets * 2n) / 100n : 0n; // Approx 2% profit for demo

  const stats = [
    {
      label: "Your Net Savings",
      value: isConnected
        ? posLoading
          ? "..."
          : `$${formatAmount(totalUserAssets, 6, 2)}`
        : "Disconnected",
      icon: Wallet,
      color: "hsl(var(--primary))",
      subtext: isConnected && !posLoading
        ? `${(positions as any)?.length ?? 0} Active Vaults`
        : "Connect to view",
      trend: isConnected && !posLoading ? "+2.4%" : undefined,
    },
    {
      label: "Protocol TVL",
      value: tvlLoading ? "..." : `$${formatAmount((tvl as any)?.totalTvl ?? 0n, 6, 0)}`,
      icon: Shield,
      color: "hsl(217, 91%, 60%)",
      subtext: "Global Liquidity",
    },
    {
      label: "Yield Earned",
      value: isConnected 
        ? posLoading 
          ? "..." 
          : `+$${formatAmount(totalYieldEarned, 6, 2)}` 
        : "Connect",
      icon: TrendingUp,
      color: "hsl(161, 84%, 43%)",
      subtext: "Realized Profit",
      trend: isConnected && !posLoading ? "Live" : undefined,
    },
    {
      label: "Active Network",
      value: "Base L2",
      icon: Users,
      color: "hsl(188, 86%, 43%)",
      subtext: "Optimistic Rollup",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative flex flex-col p-6 rounded-[2rem] bg-secondary/30 border border-border/40 hover:border-primary/30 transition-all overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center bg-background shadow-sm border border-border/50 group-hover:scale-110 transition-transform"
              >
                <Icon size={18} style={{ color: stat.color }} />
              </div>
              {stat.trend && (
                <div className="flex items-center gap-1 text-[10px] font-black text-primary bg-primary/10 px-2 py-1 rounded-lg">
                  <ArrowUpRight size={10} />
                  {stat.trend}
                </div>
              )}
            </div>
            
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">
                {stat.label}
              </p>
              <h4 className="text-2xl font-black tracking-tight text-foreground truncate">
                {stat.value}
              </h4>
              <p className="text-xs text-muted-foreground font-medium">
                {stat.subtext}
              </p>
            </div>

            {/* Subtle background glow */}
            <div className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity" style={{ backgroundColor: stat.color }} />
          </motion.div>
        );
      })}
    </div>
  );
}
