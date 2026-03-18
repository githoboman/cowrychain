// @ts-nocheck
"use client";

import { useState } from "react";
import { useVaultStats, useUserPosition } from "@yo-protocol/react";
import { useAccount } from "wagmi";
import { TrendingUp, Shield, ArrowUpRight, Info, Lock } from "lucide-react";
import type { VaultConfig } from "@/app/lib/vaults";
import { formatAmount } from "@/app/lib/vaults";
import { DepositModal } from "./deposit-modal";
import { RedeemModal } from "./redeem-modal";
import clsx from "clsx";

interface VaultCardProps {
  vault: VaultConfig;
  compact?: boolean;
}

export function VaultCard({ vault, compact = false }: VaultCardProps) {
  const { address, isConnected } = useAccount();
  const [depositOpen, setDepositOpen] = useState(false);
  const [redeemOpen, setRedeemOpen] = useState(false);

  const { stats, isLoading: statsLoading } = useVaultStats();
  const { position, isLoading: posLoading } = useUserPosition(vault.id as any, address);

  const vaultStats = stats?.find((s: any) => s.id === vault.id || s.vaultId === vault.id);
  const tvl = vaultStats?.tvl ? `$${(Number(vaultStats.tvl) / 1e6).toFixed(1)}M` : "—";
  const liveApy = vaultStats?.apy ? `${(Number(vaultStats.apy) * 100).toFixed(2)}%` : vault.estimatedApy;

  const hasPosition = position && position.shares > 0n;
  const positionValue = hasPosition && position.assets
    ? formatAmount(position.assets, 6, 2)
    : null;

  if (compact) {
    return (
      <div
        className="cowry-card cowry-card-hover vault-card p-4 cursor-pointer"
        onClick={() => setDepositOpen(true)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-base vault-icon"
              style={{ background: `${vault.color}20`, color: vault.color }}
            >
              {vault.icon}
            </div>
            <div>
              <div className="font-semibold text-white text-sm">{vault.name}</div>
              <div className="text-xs text-gray-500">{vault.symbol}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-green-400 font-bold text-sm">{liveApy} APY</div>
            {hasPosition && (
              <div className="text-xs text-gray-400">${positionValue}</div>
            )}
          </div>
        </div>

        <DepositModal vault={vault} isOpen={depositOpen} onClose={() => setDepositOpen(false)} />
        <RedeemModal vault={vault} isOpen={redeemOpen} onClose={() => setRedeemOpen(false)} />
      </div>
    );
  }

  return (
    <>
      <div className="cowry-card cowry-card-hover vault-card p-6 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl vault-icon"
              style={{ background: `${vault.color}15`, border: `1px solid ${vault.color}30` }}
            >
              {vault.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white">{vault.name}</h3>
                {vault.tag && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 font-medium border border-green-500/20">
                    {vault.tag}
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-500">{vault.symbol} · {vault.category}</div>
            </div>
          </div>

          {/* Risk badge */}
          <span className={clsx("text-xs px-2.5 py-1 rounded-full font-medium", vault.riskColor)}>
            <Shield size={10} className="inline mr-1" />
            {vault.risk}
          </span>
        </div>

        {/* APY Display */}
        <div className="mb-5 p-4 rounded-xl bg-gradient-to-r from-green-500/8 to-teal-500/8 border border-green-500/15">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                <TrendingUp size={10} />
                Estimated APY
              </div>
              <div className="text-3xl font-bold text-green-400">{liveApy}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400 mb-1">TVL</div>
              <div className="text-base font-semibold text-white">
                {statsLoading ? <span className="shimmer w-12 h-4 rounded block" /> : tvl}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-400 leading-relaxed mb-5 flex-1">
          {vault.description}
        </p>

        {/* User position (if connected) */}
        {isConnected && hasPosition && (
          <div className="mb-4 p-3 rounded-xl bg-[#0d1510] border border-[#1e2920]">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Your savings</span>
              <span className="text-white font-semibold">${positionValue} {vault.inputToken}</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            className="btn-primary flex-1 py-2.5"
            onClick={() => setDepositOpen(true)}
          >
            Deposit
            <ArrowUpRight size={14} />
          </button>
          {isConnected && hasPosition && (
            <button
              className="btn-secondary flex-none px-4 py-2.5"
              onClick={() => setRedeemOpen(true)}
            >
              Withdraw
            </button>
          )}
        </div>
      </div>

      <DepositModal
        vault={vault}
        isOpen={depositOpen}
        onClose={() => setDepositOpen(false)}
      />
      <RedeemModal
        vault={vault}
        isOpen={redeemOpen}
        onClose={() => setRedeemOpen(false)}
      />
    </>
  );
}
