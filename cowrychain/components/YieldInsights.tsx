"use client";

import { useVaults, useTotalTvl, useLeaderboard } from "@yo-protocol/react";
import { formatAmount } from "@/lib/utils";
import { Trophy, Zap, BarChart3, Info } from "lucide-react";
import { motion } from "framer-motion";

export function YieldInsights() {
  const { vaults, isLoading: vaultsLoading } = useVaults();
  const { tvl, isLoading: tvlLoading } = useTotalTvl();
  const { data: weeklyLB } = (useLeaderboard as any)("weekly", 1) as any;

  return (
    <div className="space-y-6">
      {/* Protocol Stats */}
      <div>
        <h3 className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
          <BarChart3 size={14} className="text-primary" />
          Network Health
        </h3>
        <div className="space-y-4">
          {[
            { label: "Total Liquidity", value: tvlLoading ? "..." : `$${formatAmount((tvl as any)?.totalTvl ?? 0n, 6, 0)}` },
            { label: "Active Yield Vaults", value: vaultsLoading ? "..." : vaults?.length ?? 0 },
            { label: "Settlement Layer", value: "Base Mainnet", color: "text-primary" },
            { label: "Integration", value: "YO Protocol" },
          ].map((stat) => (
            <div key={stat.label} className="flex justify-between items-center group">
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{stat.label}</span>
              <span className={`font-bold tabular-nums ${stat.color ?? "text-foreground"}`}>
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <hr className="border-border/50" />

      {/* Why CowryChain */}
      <div>
        <h3 className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
          <Zap size={14} className="text-amber-500" />
          Security First
        </h3>
        <div className="space-y-3">
          {[
            { icon: <Info size={14} />, text: "Non-custodial smart contracts" },
            { icon: <Zap size={14} />, text: "Live yield calculations" },
            { icon: <Trophy size={14} />, text: "Risk-optimized by experts" },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 text-xs leading-relaxed">
              <span className="mt-0.5 text-muted-foreground">{item.icon}</span>
              <span className="text-muted-foreground font-medium">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      <hr className="border-border/50" />

      {/* Weekly Leaderboard snippet */}
      {weeklyLB && weeklyLB.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h3 className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
            <Trophy size={14} className="text-amber-500" />
            Top Performance
          </h3>
          <div className="space-y-3">
            {(weeklyLB || []).slice(0, 3).map((entry: any, i: number) => (
              <div key={entry.address} className="flex items-center gap-3 p-2 rounded-xl bg-background/40 border border-border/50">
                <span className="text-[10px] font-black w-4 text-muted-foreground">#{(i + 1).toString().padStart(2, '0')}</span>
                <span className="text-xs font-mono text-muted-foreground flex-1 truncate">
                  {entry.address.slice(0, 6)}...{entry.address.slice(-4)}
                </span>
                <span className="text-xs font-bold text-primary">
                  ${formatAmount(entry.assets ?? 0n, 6, 0)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
