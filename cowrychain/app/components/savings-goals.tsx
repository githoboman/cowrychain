// @ts-nocheck
"use client";

import { useState } from "react";
import { useGoalsStore } from "@/app/lib/goals-store";
import { VAULTS } from "@/app/lib/vaults";
import { Plus, Target, X, Calendar } from "lucide-react";
import clsx from "clsx";

const GOAL_EMOJIS = ["🏠", "✈️", "💻", "🎓", "🛡️", "💍", "🚗", "📱", "🌴", "💰"];

export function SavingsGoals() {
  const { goals, addGoal, removeGoal } = useGoalsStore();
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    name: "",
    emoji: "🎯",
    targetAmount: "",
    vaultId: "yoUSD",
    deadline: "",
  });

  const handleCreate = () => {
    if (!form.name || !form.targetAmount) return;
    addGoal({
      name: form.name,
      emoji: form.emoji,
      targetAmount: parseFloat(form.targetAmount),
      currentAmount: 0,
      vaultId: form.vaultId,
      deadline: form.deadline || undefined,
      color: "",
    });
    setForm({ name: "", emoji: "🎯", targetAmount: "", vaultId: "yoUSD", deadline: "" });
    setShowCreate(false);
  };

  return (
    <div className="cowry-card p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-white">Savings Goals</h2>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 text-sm font-medium text-green-400 hover:text-green-300 px-3 py-1.5 rounded-lg hover:bg-green-500/8 transition-all"
        >
          <Plus size={15} />
          New Goal
        </button>
      </div>

      {goals.length === 0 ? (
        <div className="text-center py-8">
          <Target size={24} className="text-gray-600 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No savings goals yet</p>
          <p className="text-xs text-gray-600 mt-1">Create a goal to track your progress</p>
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map((goal) => {
            const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
            const remaining = goal.targetAmount - goal.currentAmount;
            const vault = VAULTS.find((v) => v.id === goal.vaultId);

            return (
              <div key={goal.id} className="p-4 rounded-xl bg-[#0d1510] border border-[#1e2920] group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{goal.emoji}</span>
                    <div>
                      <div className="font-semibold text-white text-sm">{goal.name}</div>
                      <div className="text-xs text-gray-500">
                        via {vault?.symbol || goal.vaultId}
                        {goal.deadline && (
                          <span className="ml-2 flex items-center gap-1 inline-flex">
                            <Calendar size={10} />
                            {new Date(goal.deadline).toLocaleDateString("en", { month: "short", year: "numeric" })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="text-sm font-bold text-white">${goal.currentAmount.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">of ${goal.targetAmount.toLocaleString()}</div>
                    </div>
                    <button
                      onClick={() => removeGoal(goal.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-all"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>

                {/* Progress */}
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${progress}%`,
                      background: `linear-gradient(90deg, ${vault?.color || "#22c55e"}, ${vault?.color || "#22c55e"}cc)`,
                    }}
                  />
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="text-xs text-gray-500">{progress.toFixed(0)}% reached</span>
                  <span className="text-xs text-gray-500">${remaining.toLocaleString()} to go</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Goal Modal */}
      {showCreate && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowCreate(false)}>
          <div className="modal-content">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Create Savings Goal</h3>
              <button onClick={() => setShowCreate(false)} className="p-2 rounded-lg hover:bg-white/5 text-gray-400">
                <X size={18} />
              </button>
            </div>

            {/* Emoji picker */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-300 block mb-2">Pick an icon</label>
              <div className="flex flex-wrap gap-2">
                {GOAL_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setForm((f) => ({ ...f, emoji }))}
                    className={clsx(
                      "w-9 h-9 rounded-lg text-lg transition-all",
                      form.emoji === emoji
                        ? "bg-green-500/20 border border-green-500/40 scale-110"
                        : "bg-[#1a2420] border border-[#1e2920] hover:border-green-500/30"
                    )}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 mb-5">
              <div>
                <label className="text-sm font-medium text-gray-300 block mb-1">Goal name</label>
                <input
                  className="cowry-input"
                  placeholder="e.g. Emergency Fund"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 block mb-1">Target amount (USD)</label>
                <input
                  className="cowry-input"
                  type="number"
                  placeholder="5000"
                  value={form.targetAmount}
                  onChange={(e) => setForm((f) => ({ ...f, targetAmount: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 block mb-1">Savings vault</label>
                <select
                  className="cowry-input"
                  value={form.vaultId}
                  onChange={(e) => setForm((f) => ({ ...f, vaultId: e.target.value }))}
                >
                  {VAULTS.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.icon} {v.name} — {v.estimatedApy} APY
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 block mb-1">
                  Target date <span className="text-gray-500">(optional)</span>
                </label>
                <input
                  className="cowry-input"
                  type="date"
                  value={form.deadline}
                  onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))}
                />
              </div>
            </div>

            <button
              className="btn-primary w-full"
              onClick={handleCreate}
              disabled={!form.name || !form.targetAmount}
            >
              Create Goal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
