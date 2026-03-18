"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import {
  useVaultState,
  useUserPosition,
  useVaultHistory,
} from "@yo-protocol/react";
import { formatAmount, formatAPY } from "@/lib/utils";
import { VAULT_META } from "@/lib/constants";
import { ArrowDownToLine, ArrowUpFromLine, TrendingUp, Info, Target, PiggyBank } from "lucide-react";
import { DepositModal } from "./modals/DepositModal";
import { RedeemModal } from "./modals/RedeemModal";
import { motion, AnimatePresence } from "framer-motion";

interface VaultCardProps {
  vaultId: string;
}

export function VaultCard({ vaultId }: VaultCardProps) {
  const [showDeposit, setShowDeposit] = useState(false);
  const [showRedeem, setShowRedeem] = useState(false);

  const { address, isConnected } = useAccount();
  const meta = VAULT_META[vaultId] ?? {
    name: vaultId,
    description: "YO Protocol Vault",
    icon: "🏦",
    color: "#10b981",
    tagline: "Optimized Yield",
    asset: "USDC",
    assetSymbol: "USDC",
  };

  const { vaultState, isLoading: stateLoading } = useVaultState(vaultId as any);
  const { position, isLoading: posLoading } = useUserPosition(vaultId as any, address as any);
  const { yieldHistory, isLoading: histLoading } = useVaultHistory(vaultId as any);

  // Get latest APY from history
  const latestApy = (yieldHistory?.[yieldHistory.length - 1] as any)?.apy;
  const apyDisplay = formatAPY(latestApy);

  const userAssets = position?.assets ?? 0n;
  const userShares = position?.shares ?? 0n;
  const hasPosition = userShares > 0n;

  const tvl = vaultState?.totalAssets;

  return (
    <>
      <motion.div 
        whileHover={{ y: -4 }}
        className="group relative rounded-[2rem] border border-border/50 bg-card overflow-hidden transition-all duration-300 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5"
      >
        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-1 opacity-60"
          style={{ background: `linear-gradient(90deg, transparent, ${meta.color}, transparent)` }}
        />

        {/* Card header */}
        <div className="p-7 pb-5">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-xl transition-transform group-hover:scale-110"
                style={{ background: `${meta.color}15`, border: `1px solid ${meta.color}30` }}
              >
                {meta.icon}
              </div>
              <div>
                <h3 className="font-bold text-xl tracking-tight text-foreground">{meta.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                   <span
                    className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-lg border border-border"
                    style={{ color: meta.color }}
                  >
                    {meta.tagline}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-bold uppercase tracking-widest bg-secondary px-2 py-0.5 rounded-lg">
                    <Target size={10} />
                    Goal: Custom
                  </div>
                </div>
              </div>
            </div>

            {/* APY badge */}
            <div className="text-right">
              <div className="text-[10px] text-muted-foreground mb-1 flex items-center gap-1 justify-end font-bold uppercase tracking-widest">
                <TrendingUp size={12} className="text-primary" />
                Variable APY
              </div>
              <div
                className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-br from-primary to-emerald-400"
              >
                {histLoading ? (
                  <span className="text-muted-foreground text-sm font-medium animate-pulse">Scanning...</span>
                ) : (
                  apyDisplay
                )}
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{meta.description}</p>
        </div>

        {/* Stats */}
        <div className="px-7 py-5 bg-secondary/30 grid grid-cols-2 gap-4 border-y border-border/50">
          <div>
            <div className="text-[10px] text-muted-foreground mb-1 uppercase tracking-widest font-bold">Vault TVL</div>
            <div className="text-lg font-bold text-foreground">
              {stateLoading ? (
                <span className="shimmer inline-block w-20 h-5 rounded-lg" />
              ) : (
                `$${formatAmount(tvl, 6, 0)}`
              )}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground mb-1 uppercase tracking-widest font-bold">Base Asset</div>
            <div className="text-lg font-bold text-foreground flex items-center gap-1.5">
              <span>{meta.assetSymbol}</span>
              <div className="w-4 h-4 rounded-full bg-blue-500/20 text-[8px] flex items-center justify-center font-black">B</div>
            </div>
          </div>
        </div>

        {/* User position */}
        <div className="px-7 py-5 h-[100px] flex flex-col justify-center">
          {isConnected ? (
            posLoading ? (
              <div className="shimmer h-10 rounded-2xl w-full" />
            ) : hasPosition ? (
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">Current Balance</div>
                  <div className="text-2xl font-black text-foreground">
                    ${formatAmount(userAssets, 6, 2)}
                  </div>
                </div>
                <div className="flex flex-col items-end">
                   <div className="text-[10px] text-muted-foreground font-mono mb-1">
                     {formatAmount(userShares, 6, 4)} y{meta.assetSymbol}
                   </div>
                   <div
                    className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-sm"
                  >
                    ● Yielding
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 rounded-2xl border border-dashed border-border text-muted-foreground text-sm">
                 <PiggyBank className="opacity-40" />
                 <span>Start saving to grow your fortune.</span>
              </div>
            )
          ) : (
            <div className="flex items-center gap-3 p-4 rounded-2xl border border-dashed border-border text-muted-foreground text-sm italic">
               <Info size={16} />
               Connect wallet to view position
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-7 pt-2 flex gap-3">
          <button
            onClick={() => setShowDeposit(true)}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-sm transition-all shadow-xl bg-primary text-white hover:bg-emerald-600 hover:shadow-primary/30 active:scale-95 border-b-4 border-emerald-700"
          >
            <ArrowDownToLine size={18} />
            Save Now
          </button>
          <AnimatePresence>
            {hasPosition && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => setShowRedeem(true)}
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-sm bg-secondary text-foreground hover:bg-muted transition-all border border-border active:scale-95"
              >
                <ArrowUpFromLine size={18} />
                Withdraw
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Modals */}
      {showDeposit && (
        <DepositModal
          vaultId={vaultId}
          meta={meta}
          onClose={() => setShowDeposit(false)}
        />
      )}
      {showRedeem && (
        <RedeemModal
          vaultId={vaultId}
          meta={meta}
          userShares={userShares}
          onClose={() => setShowRedeem(false)}
        />
      )}
    </>
  );
}

