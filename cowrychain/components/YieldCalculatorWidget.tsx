"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useT } from "@/lib/i18n/LanguageProvider";
import { formatCompactAmount } from "@/lib/utils";
import { Calculator, TrendingUp } from "lucide-react";

export function YieldCalculatorWidget({ defaultApy = 15.2 }) {
  const [deposit, setDeposit] = useState<number>(1000);
  const t = useT();

  const dailyYield = (deposit * (defaultApy / 100)) / 365;
  const yearlyYield = deposit * (defaultApy / 100);

  return (
    <div className="relative premium-glass rounded-[40px] p-8 overflow-hidden group">
      {/* Background glowing effects */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-all duration-700" />
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
              <Calculator size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold">Yield Projection</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <TrendingUp size={14} className="text-primary" /> {defaultApy}% Auto-Compounding APY
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 flex-grow">
          <div>
            <div className="flex justify-between text-sm mb-2 font-semibold">
              <span className="text-muted-foreground">If you deposit</span>
              <span className="text-foreground">${deposit.toLocaleString()}</span>
            </div>
            <input 
              type="range" 
              min="100" 
              max="100000" 
              step="100"
              value={deposit}
              onChange={(e) => setDeposit(Number(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-3xl bg-primary/10 border border-primary/20 flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold text-primary tracking-wider">30 Day Projection</span>
              <span className="text-2xl font-black text-foreground">+${formatCompactAmount(BigInt(Math.floor(dailyYield * 30)), 0)}</span>
            </div>
            <div className="p-4 rounded-3xl bg-secondary/50 border border-border flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">1 Year Projection</span>
              <span className="text-2xl font-black text-foreground">+${formatCompactAmount(BigInt(Math.floor(yearlyYield)), 0)}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Total Value (1 Yr)</span>
            <span className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-primary/80">
              ${(deposit + yearlyYield).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
