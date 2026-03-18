"use client";

import { useState } from "react";
import { TrendingUp, Calculator, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

import { useVaults, useVaultHistory } from "@yo-protocol/react";

export function YieldCalculator() {
  const [amount, setAmount] = useState(1000);
  const [years, setYears] = useState(1);
  
  const { vaults } = useVaults();
  // Get the highest APY from available vaults or fallback to 8.15%
  const defaultApy = 0.0815;
  
  // Use the first available vault for the yield history projection
  // APY from SDK is in basis points (e.g. 815 = 8.15%), so divide by 10000 to get decimal
  const { yieldHistory } = useVaultHistory(vaults?.[0]?.id as any);
  const latestApy = yieldHistory?.length ? (yieldHistory[yieldHistory.length - 1] as any).apy / 10000 : defaultApy;
  
  const futureValue = amount * Math.pow(1 + latestApy, years);
  const earnings = futureValue - amount;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Calculator className="text-primary" size={20} />
        </div>
        <div>
          <h3 className="font-bold text-lg">Yield Projection</h3>
          <p className="text-xs text-muted-foreground">Estimated earnings over time.</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground mb-2 block">
            Initial Deposit ($)
          </label>
          <input
            type="range"
            min="100"
            max="50000"
            step="100"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between mt-2 font-mono text-sm">
            <span>$100</span>
            <span className="text-primary font-bold">${amount.toLocaleString()}</span>
            <span>$50k</span>
          </div>
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground mb-2 block">
            Time Horizon (Years)
          </label>
          <div className="flex gap-2">
            {[1, 3, 5, 10].map((y) => (
              <button
                key={y}
                onClick={() => setYears(y)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${
                  years === y 
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                    : "bg-secondary text-muted-foreground border-transparent hover:border-border"
                }`}
              >
                {y}Y
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-5 rounded-3xl bg-primary/5 border border-primary/10 relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">Total Earnings</p>
          <div className="text-3xl font-black text-primary">
            +${earnings.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed italic">
            *Based on current variable APY of {(latestApy * 100).toFixed(2)}%. Results may vary.
          </p>
        </div>
        <TrendingUp className="absolute -bottom-4 -right-4 w-24 h-24 text-primary opacity-5 rotate-12" />
      </div>

      <button className="w-full py-4 rounded-2xl bg-foreground text-background font-bold text-sm flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform active:scale-95">
        Boost Your Savings <ArrowRight size={16} />
      </button>
    </div>
  );
}
