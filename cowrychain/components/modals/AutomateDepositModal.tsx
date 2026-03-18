"use client";

import { X, CalendarClock, ArrowRight, Infinity, CheckCircle2, ShieldAlert } from "lucide-react";
import { useState } from "react";

interface AutomateDepositModalProps {
  goalName: string;
  onClose: () => void;
}

export function AutomateDepositModal({ goalName, onClose }: AutomateDepositModalProps) {
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState<"Daily" | "Weekly" | "Monthly">("Weekly");
  const [asset, setAsset] = useState("USDC");
  const [step, setStep] = useState<"idle" | "signing" | "success">("idle");

  const isComplete = Number(amount) > 0;

  const handleCreateTask = async () => {
    if (!isComplete) return;
    setStep("signing");
    // Simulate smart contract interactions for Gelato task creation
    await new Promise(res => setTimeout(res, 2500));
    setStep("success");
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-card border border-border rounded-3xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-6 right-6 text-muted-foreground hover:text-white transition-colors p-2 bg-secondary/50 rounded-full">
          <X size={18} />
        </button>

        {step === "success" ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-20 h-20 bg-primary/20 text-primary border border-primary/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">Automation Active</h3>
            <p className="text-muted-foreground">
              You are now automatically saving <strong className="text-white">${amount} {asset}</strong> {frequency.toLowerCase()} towards your <strong>{goalName}</strong> goal.
            </p>
            <div className="pt-4 flex justify-between text-sm bg-secondary/30 p-4 rounded-xl border border-border">
              <span className="text-muted-foreground">Next deposit</span>
              <span className="text-white font-medium">Tomorrow, 12:00 PM</span>
            </div>
            <button 
              onClick={onClose}
              className="w-full mt-4 bg-primary text-primary-foreground font-bold py-4 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-4 border border-blue-500/30">
                <CalendarClock size={24} />
              </div>
              <h2 className="text-2xl font-black text-white">Smart DCA</h2>
              <p className="text-muted-foreground text-sm mt-1">Automate deposits for: <strong className="text-white">{goalName}</strong></p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-white flex justify-between">
                  <span>How much?</span>
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">$</span>
                    <input 
                      type="number" 
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      placeholder="50" 
                      className="w-full bg-secondary border border-border py-4 pl-8 pr-4 rounded-xl text-white text-xl font-bold focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <select 
                    value={asset}
                    onChange={e => setAsset(e.target.value)}
                    className="bg-secondary border border-border px-4 rounded-xl text-white font-bold inline-block"
                  >
                    <option value="USDC">USDC</option>
                    <option value="WETH">WETH</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-white">How often?</label>
                <div className="grid grid-cols-3 gap-2">
                  {["Daily", "Weekly", "Monthly"].map(freq => (
                    <button
                      key={freq}
                      onClick={() => setFrequency(freq as any)}
                      className={`py-3 rounded-xl text-sm font-bold transition-all border
                        ${frequency === freq 
                          ? 'bg-blue-500/20 text-blue-400 border-blue-500/50' 
                          : 'bg-secondary text-muted-foreground border-border hover:border-border/80'
                        }
                      `}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-xl flex gap-3">
                <ShieldAlert size={18} className="text-orange-400 shrink-0 mt-0.5" />
                <div className="text-xs text-orange-200/70 leading-relaxed">
                  You are generating a session key. This gives the Gelato Network restricted permission to spend up to ${amount} {asset} {frequency.toLowerCase()} on your behalf to deposit into the vault. It cannot withdraw your funds.
                </div>
              </div>

              <button 
                onClick={handleCreateTask}
                disabled={!isComplete || step === "signing"}
                className={`w-full font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-xl
                  ${isComplete && step !== "signing" 
                    ? 'bg-blue-600 text-white hover:bg-blue-500 hover:scale-105 active:scale-95 shadow-blue-500/20' 
                    : 'bg-secondary text-muted-foreground border border-border cursor-not-allowed'
                  }
                `}
              >
                {step === "signing" ? (
                  <>Signing permissions...</>
                ) : (
                  <>Initialize Automation <Infinity size={18} /></>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
