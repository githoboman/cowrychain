"use client";

import { CreditCard, TrendingDown, DollarSign, Clock, ShieldCheck, Info } from "lucide-react";
import { useState } from "react";
import { BorrowModal } from "./modals/BorrowModal";

export function CreditDashboard() {
  const [isBorrowOpen, setIsBorrowOpen] = useState(false);

  // Mock data for the borrowing module
  const collateralBalance = 4500; // yoUSD
  const maxLtv = 0.5; // 50%
  const creditLimit = collateralBalance * maxLtv;
  const currentDebt = 850;
  const currentLtv = currentDebt / collateralBalance;
  const apy = 12.5; // 12.5% APY on the collateral

  // Time until debt is $0
  const annualYield = collateralBalance * (apy / 100);
  const yearsToRepay = currentDebt / annualYield;
  const monthsToRepay = Math.ceil(yearsToRepay * 12);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-primary">
          <CreditCard size={20} />
          <h2 className="font-semibold uppercase tracking-wider text-sm">Self-Repaying Loans</h2>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
          Borrow instantly. <span className="text-primary">No liquidations.</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl">
          Use your yield-bearing `yoUSD` or `yoETH` as collateral. Your daily yield automatically repays your loan.
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Debt Card */}
        <div className="lg:col-span-2 bg-card border border-border rounded-3xl p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 blur-[80px] bg-red-500/10 group-hover:bg-red-500/20 transition-colors" />
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between md:items-end gap-6">
            <div>
              <div className="text-muted-foreground font-medium mb-2 flex items-center gap-2">
                <TrendingDown size={18} className="text-red-400" /> Outstanding Debt
              </div>
              <div className="text-5xl font-black text-white tracking-tight">
                ${currentDebt.toLocaleString()}
              </div>
              <div className="mt-4 inline-flex items-center gap-2 bg-secondary/80 px-4 py-2 rounded-xl text-sm border border-border">
                <Clock size={16} className="text-primary" />
                <span>Estimated payoff in <strong className="text-white">{monthsToRepay} months</strong></span>
              </div>
            </div>

            <button 
              onClick={() => setIsBorrowOpen(true)}
              className="bg-white text-black hover:bg-white/90 px-8 py-4 rounded-xl font-black border border-transparent hover:scale-105 active:scale-95 transition-all shadow-xl"
            >
              Borrow More
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-border grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Repayment APY</div>
              <div className="font-bold text-primary flex items-center gap-1">+{apy}%</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Borrow APR</div>
              <div className="font-bold text-red-400">0.00%</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Total Paid</div>
              <div className="font-bold text-white">$142.50</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Status</div>
              <div className="font-bold text-[#6b9e7e] flex items-center gap-1">
                <ShieldCheck size={16} /> Healthy
              </div>
            </div>
          </div>
        </div>

        {/* Collateral Card */}
        <div className="bg-secondary/30 border border-border rounded-3xl p-8 relative">
          <div className="text-muted-foreground font-medium mb-6 flex items-center gap-2">
            <DollarSign size={18} className="text-primary" /> Collateral Provided
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="text-3xl font-black text-white">${collateralBalance.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">in yoUSD / yoETH</div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-muted-foreground">Loan-to-Value (LTV)</span>
                <span className={currentLtv > 0.4 ? "text-yellow-500" : "text-[#6b9e7e]"}>
                  {(currentLtv * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${currentLtv > 0.4 ? "bg-yellow-500" : "bg-primary"}`}
                  style={{ width: `${(currentLtv / maxLtv) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Safe</span>
                <span>Max {maxLtv * 100}% LTV</span>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-4 flex gap-3 text-sm">
              <Info size={16} className="text-primary shrink-0 mt-0.5" />
              <span className="text-muted-foreground leading-relaxed">
                Your collateral continues to earn yield, which is automatically swept to manually pay down your debt block-by-block.
              </span>
            </div>
          </div>
        </div>
      </div>

      {isBorrowOpen && (
        <BorrowModal 
          maxCredit={creditLimit - currentDebt} 
          currentDebt={currentDebt}
          onClose={() => setIsBorrowOpen(false)} 
        />
      )}
    </div>
  );
}
