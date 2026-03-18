// @ts-nocheck
"use client";

import { useUserPosition, useVaultStats } from "@yo-protocol/react";
import { useAccount } from "wagmi";
import { TrendingUp, Wallet, Layers } from "lucide-react";
import { VAULTS, formatAmount } from "@/app/lib/vaults";

export function PortfolioSummary() {
  const { address, isConnected } = useAccount();

  const usdPos = useUserPosition("yoUSD" as any, address);
  const ethPos = useUserPosition("yoETH" as any, address);
  const btcPos = useUserPosition("yoBTC" as any, address);
  const eurPos = useUserPosition("yoEUR" as any, address);

  const positions = [
    { vault: VAULTS[0], pos: usdPos.position },
    { vault: VAULTS[1], pos: ethPos.position },
    { vault: VAULTS[2], pos: btcPos.position },
    { vault: VAULTS[3], pos: eurPos.position },
  ];

  const totalUSD = positions.reduce((acc, { pos }) => {
    if (!pos?.assets) return acc;
    return acc + Number(formatAmount(pos.assets, 6, 2).replace(",", ""));
  }, 0);

  const activePositions = positions.filter((p) => p.pos && p.pos.shares > 0n);

  if (!isConnected) {
    return (
      <div className="cowry-card p-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto mb-4">
          <Wallet size={24} className="text-green-400" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">Connect Your Wallet</h3>
        <p className="text-gray-400 text-sm">
          Connect your wallet to see your portfolio and start saving
        </p>
      </div>
    );
  }

  return (
    <div className="cowry-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-white">Your Portfolio</h2>
        {activePositions.length > 0 && (
          <span className="text-xs text-gray-400">{activePositions.length} active vault{activePositions.length !== 1 ? "s" : ""}</span>
        )}
      </div>

      {/* Total */}
      <div className="mb-6">
        <div className="text-xs text-gray-400 mb-1">Total Savings</div>
        <div className="text-4xl font-bold text-white">
          ${totalUSD.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        {totalUSD > 0 && (
          <div className="flex items-center gap-1.5 mt-1.5">
            <TrendingUp size={12} className="text-green-400" />
            <span className="text-sm text-green-400 font-medium">Earning yield right now</span>
          </div>
        )}
      </div>

      {/* Position list */}
      {activePositions.length > 0 ? (
        <div className="space-y-3">
          {activePositions.map(({ vault, pos }) => {
            if (!pos || pos.shares === 0n) return null;
            const assetVal = pos.assets ? formatAmount(pos.assets, 6, 2) : "0.00";
            const shareVal = formatAmount(pos.shares, 18, 4);
            const pct = totalUSD > 0 ? (Number(assetVal) / totalUSD * 100).toFixed(0) : "0";
            return (
              <div key={vault.id} className="flex items-center gap-3 p-3 rounded-xl bg-[#0d1510] border border-[#1e2920]">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0"
                  style={{ background: `${vault.color}15`, color: vault.color }}
                >
                  {vault.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white">{vault.name}</div>
                  <div className="text-xs text-gray-500">{shareVal} {vault.symbol}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-semibold text-white">${assetVal}</div>
                  <div className="text-xs text-gray-500">{pct}%</div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-6">
          <Layers size={24} className="text-gray-600 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No active positions yet</p>
          <p className="text-xs text-gray-600 mt-1">Make your first deposit to start earning</p>
        </div>
      )}
    </div>
  );
}
