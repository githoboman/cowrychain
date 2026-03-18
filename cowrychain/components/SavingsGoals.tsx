"use client";

import { useState } from "react";
import { Target, Plus, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatUnits } from "viem";

import { useAccount } from "wagmi";
import { useUserPositions } from "@yo-protocol/react";
import { formatAmount } from "@/lib/utils";

export function SavingsGoals() {
  const { address, isConnected } = useAccount();
  const { positions } = useUserPositions(address as any);
  
  // Calculate total user assets across all positions for use in goals
  const totalAssets = (positions as any)?.reduce((sum: bigint, pos: any) => {
    return sum + (pos?.position?.assets ?? 0n);
  }, 0n) ?? 0n;
  
  const totalAssetsNum = parseFloat(formatUnits(totalAssets, 6));

  const [goals, setGoals] = useState([
    { id: 1, name: "New Laptop", target: 2000, color: "#10b981" },
    { id: 2, name: "Summer Trip", target: 5000, color: "#3b82f6" },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: "", target: "" });

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.name || !newGoal.target) return;

    const id = goals.length + 1;
    const colors = ["#10b981", "#3b82f6", "#f59e0b", "#ec4899", "#8b5cf6"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    setGoals([...goals, {
      id,
      name: newGoal.name,
      target: parseFloat(newGoal.target),
      color: randomColor
    }]);

    setNewGoal({ name: "", target: "" });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Target className="text-primary" size={20} />
          </div>
          <div>
            <h3 className="font-bold text-lg">Savings Goals</h3>
            <p className="text-xs text-muted-foreground">Track your progress.</p>
          </div>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <Plus size={18} />
        </button>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {goals.map((goal) => {
            // Distribute total assets proportionally across goals based on target weight
            const totalTargets = goals.reduce((sum, g) => sum + g.target, 0);
            const weight = totalTargets > 0 ? goal.target / totalTargets : 1 / goals.length;
            const current = isConnected ? Math.min(totalAssetsNum * weight * goals.length, goal.target) : 0;
            const progress = (current / goal.target) * 100;
            return (
              <motion.div 
                key={goal.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="p-4 rounded-2xl border border-border bg-background/40 hover:border-primary/30 transition-colors group"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-sm group-hover:text-primary transition-colors">{goal.name}</h4>
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest mt-0.5">
                      ${current.toLocaleString(undefined, { maximumFractionDigits: 0 })} / ${goal.target.toLocaleString()}
                    </p>
                  </div>
                  {progress >= 100 && <CheckCircle2 size={16} className="text-primary" />}
                </div>

                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(progress, 100)}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: goal.color }}
                  />
                </div>
                
                <div className="flex justify-between mt-2 text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                  <span>{progress.toFixed(0)}% reached</span>
                  <span className="group-hover:text-foreground transition-colors text-primary italic">Yield Compounding</span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Create Goal Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
              onClick={() => setIsModalOpen(false)} 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm bg-card border border-border rounded-[2rem] p-8 shadow-2xl"
            >
              <h2 className="text-xl font-bold mb-6">Create New Goal</h2>
              <form onSubmit={handleAddGoal} className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
                    Goal Name
                  </label>
                  <input
                    autoFocus
                    type="text"
                    value={newGoal.name}
                    onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                    placeholder="e.g. New Car, Savings..."
                    className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
                    Target Amount ($)
                  </label>
                  <input
                    type="number"
                    value={newGoal.target}
                    onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                    placeholder="2500"
                    className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50"
                  />
                </div>
                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-3 rounded-xl border border-border text-sm font-bold hover:bg-secondary transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 rounded-xl bg-primary text-white text-sm font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-primary/20"
                  >
                    Create Goal
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
