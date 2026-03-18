"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { SavingsGoals } from "@/components/SavingsGoals";
import { VaultCard } from "@/components/VaultCard";
import { YieldChart } from "@/components/YieldChart";
import { VAULT_META } from "@/lib/constants";
import { Calculator } from "lucide-react";

const VAULT_ENTRIES = Object.entries(VAULT_META);

export default function SavePage() {
  const [calcAmount, setCalcAmount] = useState("1000");
  const [calcVaultIdx, setCalcVaultIdx] = useState(0);

  const [selectedVaultId, selectedMeta] = VAULT_ENTRIES[calcVaultIdx];

  // Parse APY from tagline fallback — use a reasonable default
  const APY_MAP: Record<string, number> = {
    yoUSD: 8.64,
    yoETH: 5.2,
  };
  const apy = APY_MAP[selectedVaultId] ?? 8.64;
  const parsedAmount = parseFloat(calcAmount) || 1000;

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="mb-8 mt-8">
          <h1 className="text-3xl font-black text-white mb-2">Save</h1>
          <p className="text-[#6b9e7e]">Set goals, choose vaults, and watch your money grow</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Goals + Calculator */}
          <div className="space-y-6">
            <SavingsGoals />

            {/* Yield Calculator */}
            <div className="rounded-2xl border border-[#1a4a2e] bg-[#0f2d1e] p-6">
              <div className="flex items-center gap-2 mb-5">
                <Calculator size={18} className="text-[#22c55e]" />
                <h2 className="text-lg font-bold text-white">Yield Calculator</h2>
              </div>

              <div className="space-y-4 mb-5">
                <div>
                  <label className="text-sm font-medium text-[#6b9e7e] block mb-2">
                    Amount to save
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b9e7e] font-medium">$</span>
                    <input
                      className="w-full bg-[#0a1f14] border border-[#1a4a2e] rounded-xl px-8 py-3 text-white placeholder-[#1a4a2e] focus:outline-none focus:border-[#22c55e]/50 transition-colors"
                      type="number"
                      value={calcAmount}
                      onChange={(e) => setCalcAmount(e.target.value)}
                      placeholder="1000"
                      min="1"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-[#6b9e7e] block mb-2">
                    Vault
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {VAULT_ENTRIES.map(([id, meta], i) => (
                      <button
                        key={id}
                        onClick={() => setCalcVaultIdx(i)}
                        className={`text-sm px-3 py-2 rounded-xl border transition-all ${calcVaultIdx === i
                            ? "border-[#22c55e]/40 bg-[#22c55e]/10 text-[#22c55e]"
                            : "border-[#1a4a2e] text-[#6b9e7e] hover:border-[#22c55e]/20"
                          }`}
                      >
                        {meta.icon} {meta.assetSymbol} · {APY_MAP[id] ?? "—"}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick projections */}
              {parsedAmount > 0 && (
                <div className="rounded-xl bg-[#0a1f14] border border-[#1a4a2e] p-4 space-y-2">
                  {[1, 3, 12].map((mo) => {
                    const earned = parsedAmount * (apy / 100 / 12) * mo;
                    return (
                      <div key={mo} className="flex justify-between text-sm">
                        <span className="text-[#6b9e7e]">{mo} month{mo > 1 ? "s" : ""}</span>
                        <span className="text-[#22c55e] font-semibold">+${earned.toFixed(2)}</span>
                      </div>
                    );
                  })}
                  <div className="flex justify-between text-sm pt-2 border-t border-[#1a4a2e]">
                    <span className="text-white font-medium">1 year total</span>
                    <span className="text-white font-bold">
                      ${(parsedAmount * (1 + apy / 100)).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Chart + Vault card */}
          <div className="space-y-6">
            <YieldChart
              initialAmount={parsedAmount}
              apy={apy}
              vaultName={selectedMeta.assetSymbol}
              months={12}
            />

            <div>
              <h2 className="text-base font-bold text-white mb-3">
                Deposit to {selectedMeta.name}
              </h2>
              <VaultCard vaultId={selectedVaultId} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
