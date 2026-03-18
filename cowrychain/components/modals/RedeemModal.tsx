"use client";

import { useState, useCallback } from "react";
import { useAccount } from "wagmi";
import { useRedeem, usePreviewRedeem, usePendingRedemptions } from "@yo-protocol/react";
import { parseAmount, formatAmount } from "@/lib/utils";
import { USDC_DECIMALS } from "@/lib/constants";
import { X, ArrowUpFromLine, Loader2, CheckCircle2, AlertCircle, Clock, Info } from "lucide-react";

interface RedeemModalProps {
  vaultId: string;
  meta: {
    name: string;
    icon: string;
    color: string;
    asset: string;
    assetSymbol: string;
  };
  userShares: bigint;
  onClose: () => void;
}

export function RedeemModal({ vaultId, meta, userShares, onClose }: RedeemModalProps) {
  const [shareAmount, setShareAmount] = useState("");
  const { address } = useAccount();

  const parsedShares = parseAmount(shareAmount, 6);
  const { assets: previewAssets } = usePreviewRedeem(vaultId as any, parsedShares > 0n ? parsedShares : undefined);
  const { pendingRedemptions } = (usePendingRedemptions as any)(vaultId as any, address as any);

  const {
    redeem,
    reset,
    step,
    isLoading,
    isSuccess,
    error,
    hash: redeemTxHash,
    instant,
  } = useRedeem({ vault: vaultId as any });

  const handleRedeem = useCallback(async () => {
    if (!parsedShares || parsedShares <= 0n) return;
    await redeem(parsedShares);
  }, [redeem, parsedShares]);

  const handleClose = () => {
    if (isSuccess) reset();
    onClose();
  };

  const isDisabled = !shareAmount || parsedShares <= 0n || isLoading || !address;

  const stepLabels: Record<string, string> = {
    idle: "Ready",
    approving: "Approving shares...",
    redeeming: "Processing withdrawal...",
    success: "Withdrawal initiated!",
    error: "Transaction failed",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-amber-500/60 to-amber-500/20" />

        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-900/30 border border-amber-500/20 flex items-center justify-center text-xl">
              {meta.icon}
            </div>
            <div>
              <h2 className="font-bold text-white text-lg">Withdraw from {meta.name}</h2>
               <p className="text-xs text-muted-foreground">Redeem your vault shares</p>
            </div>
          </div>
          <button onClick={handleClose} className="w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all flex items-center justify-center">
            <X size={18} />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-6 pt-2 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} className="text-amber-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Withdrawal Initiated!</h3>
            <p className="text-muted-foreground text-sm mb-4">
              {instant ? "Instant redemption completed." : "Your redemption is queued. Funds will arrive shortly."}
            </p>
            {redeemTxHash && (
              <a href={`${process.env.NEXT_PUBLIC_EXPLORER_URL ?? "https://basescan.org"}/tx/${redeemTxHash}`} target="_blank" rel="noopener noreferrer" className="text-amber-400 text-sm hover:underline">
                View on BaseScan →
              </a>
            )}
            <button onClick={handleClose} className="mt-6 w-full py-3 rounded-xl font-semibold text-sm bg-amber-500 text-[#0a1f14]">
              Done
            </button>
          </div>
        ) : (
          <div className="p-6 pt-2 space-y-5">
            {/* Balance */}
            <div className="flex items-center justify-between text-sm">
               <span className="text-muted-foreground">Your shares</span>
              <button
                className="font-medium text-amber-400 hover:text-amber-300 transition-colors"
                onClick={() => setShareAmount(formatAmount(userShares, 6, 6))}
              >
                {formatAmount(userShares, 6, 4)} y{meta.assetSymbol} (max)
              </button>
            </div>

            {/* Input */}
            <div className="relative">
              <input
                type="number"
                value={shareAmount}
                onChange={(e) => setShareAmount(e.target.value)}
                placeholder="0.000000"
                 className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-4 text-xl font-bold text-foreground placeholder-muted-foreground/30 focus:outline-none focus:border-amber-500/50 transition-colors"
                min="0"
                step="0.000001"
              />
               <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                y{meta.assetSymbol}
              </div>
            </div>

            {/* Quick percentages */}
            <div className="flex gap-2">
              {["25%", "50%", "75%", "100%"].map((pct) => (
                <button
                  key={pct}
                  onClick={() => {
                    const p = parseInt(pct) / 100;
                    const amt = (userShares * BigInt(Math.floor(p * 10000))) / 10000n;
                    setShareAmount(formatAmount(amt, 6, 6));
                  }}
                   className="flex-1 py-2 rounded-lg text-sm font-medium border border-border text-muted-foreground hover:border-amber-500/30 hover:text-amber-400 transition-all"
                >
                  {pct}
                </button>
              ))}
            </div>

            {/* Preview */}
            {shareAmount && parsedShares > 0n && (
               <div className="rounded-xl bg-secondary/30 border border-border p-4 space-y-2">
                <div className="flex justify-between text-sm">
                   <span className="text-muted-foreground">You receive</span>
                  <span className="text-white font-medium">
                    ~${formatAmount(previewAssets, 6, 4)} {meta.assetSymbol}
                  </span>
                </div>
                 <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Redemption type</span>
                  <span className={instant ? "text-primary" : "text-amber-400"}>
                    {instant === undefined ? "—" : instant ? "⚡ Instant" : "⏳ Queued"}
                  </span>
                </div>
              </div>
            )}

            {/* Pending redemptions */}
            {pendingRedemptions && (pendingRedemptions as any)?.length > 0 && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-900/15 border border-amber-500/20 text-amber-400 text-xs">
                <Clock size={13} className="mt-0.5 shrink-0" />
                <span>You have {(pendingRedemptions as any)?.length} pending redemption(s). They will settle automatically.</span>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-red-900/20 border border-red-500/20 text-red-400 text-sm">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{error.message?.slice(0, 100) ?? "Transaction failed"}</span>
              </div>
            )}

            {/* Loading */}
            {isLoading && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-900/15 border border-amber-500/20 text-amber-400 text-sm">
                <Loader2 size={16} className="animate-spin" />
                <span>{stepLabels[step] ?? "Processing..."}</span>
              </div>
            )}

            {/* Info */}
             <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <Info size={13} className="mt-0.5 shrink-0" />
              <span>Redemptions may be instant or queued depending on vault liquidity. All transactions happen onchain on Base.</span>
            </div>

            {/* CTA */}
            <button
              onClick={handleRedeem}
              disabled={isDisabled}
               className="w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-amber-500 text-white hover:bg-amber-400"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <ArrowUpFromLine size={18} />}
              {isLoading ? stepLabels[step] : "Withdraw"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
