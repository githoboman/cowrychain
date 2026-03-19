"use client";

import { X, ArrowRight, Loader2, Info } from "lucide-react";
import { useState } from "react";
import { useCreditStore } from "@/lib/credit-store";

interface BorrowModalProps {
  maxCredit: number;
  currentDebt: number;
  onClose: () => void;
}

export function BorrowModal({ maxCredit, currentDebt, onClose }: BorrowModalProps) {
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState<"idle" | "borrowing" | "success">("idle");

  const { borrow } = useCreditStore();
  const numAmount = Number(amount);
  const isOverLimit = numAmount > maxCredit;
  const isValid = numAmount > 0 && !isOverLimit;

  const handleBorrow = async () => {
    if (!isValid) return;
    setStep("borrowing");
    
    // Simulate transaction delay
    await new Promise(res => setTimeout(res, 2500));
    borrow(numAmount);
    setStep("success");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-card border border-border rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-[20%] sm:zoom-in-95 duration-300">
        {/* Top accent */}
        <div className="h-1 w-full bg-gradient-to-r from-red-500/80 to-red-500/20" />

        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-black text-white">Borrow against Yield</h2>
              <p className="text-muted-foreground text-sm mt-1">Receive cUSD instantly.</p>
            </div>
            <button onClick={onClose} className="p-2 bg-secondary rounded-xl text-muted-foreground hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>

          {step === "success" ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-20 h-20 bg-primary/20 text-primary border border-primary/30 rounded-full flex items-center justify-center mx-auto text-4xl">
                💸
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Borrow Successful</h3>
                <p className="text-muted-foreground">You received <strong className="text-white">${amount} cUSD</strong>. Your debt will now begin to automatically decrease via yield.</p>
              </div>
              <button 
                onClick={onClose}
                className="w-full mt-4 bg-white text-black font-bold py-4 rounded-xl hover:bg-white/90 shadow-xl"
              >
                Go to Dashboard
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Borrow Amount</span>
                  <span className="text-white font-bold max-w-[50%] overflow-hidden text-ellipsis whitespace-nowrap">
                    Available: <span className="text-primary cursor-pointer hover:underline" onClick={() => setAmount(maxCredit.toString())}>
                      ${maxCredit.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </span>
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-lg">$</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className={`w-full bg-secondary border ${isOverLimit ? 'border-red-500 focus:border-red-500 text-red-100' : 'border-border focus:border-primary text-white'} rounded-xl py-4 pl-8 pr-16 text-2xl font-black focus:outline-none transition-colors`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">cUSD</span>
                </div>
                {isOverLimit && <p className="text-red-400 text-xs font-medium">Amount exceeds your maximum credit line.</p>}
              </div>

              <div className="bg-secondary/50 rounded-xl p-4 space-y-3 border border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Current Debt</span>
                  <span className="text-white font-medium">${currentDebt.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">New Debt</span>
                  <span className="text-red-400 font-bold">${(currentDebt + numAmount).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                </div>
                <div className="w-full h-px bg-border my-2" />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="text-[#6b9e7e] font-medium">Infinite (Auto-repaying)</span>
                </div>
              </div>

              <div className="flex gap-2 p-3 bg-primary/10 border border-primary/20 rounded-xl text-xs text-primary/80">
                <Info size={14} className="shrink-0 mt-0.5" />
                <p>This is a non-liquidating loan. Ensure you maintain your yoUSD/yoETH collateral until the loan is fully repaid by yield.</p>
              </div>

              <button
                onClick={handleBorrow}
                disabled={!isValid || step === "borrowing"}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl
                  ${isValid && step !== "borrowing" 
                    ? 'bg-white text-black hover:scale-[1.02] active:scale-[0.98]' 
                    : 'bg-secondary text-muted-foreground cursor-not-allowed border border-border'
                  }`}
              >
                {step === "borrowing" ? (
                  <><Loader2 size={18} className="animate-spin" /> Confirming...</>
                ) : (
                  <><ArrowRight size={18} /> Borrow cUSD</>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
