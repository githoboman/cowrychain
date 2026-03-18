// @ts-nocheck
"use client";

import { useState, useCallback } from "react";
import { useRedeem, usePreviewRedeem, useUserPosition } from "@yo-protocol/react";
import { useAccount } from "wagmi";
import { X, ArrowRight, CheckCircle, Loader2, AlertCircle, Clock } from "lucide-react";
import type { VaultConfig } from "@/app/lib/vaults";
import { parseAmount, formatAmount } from "@/app/lib/vaults";
import toast from "react-hot-toast";

interface RedeemModalProps {
  vault: VaultConfig;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (hash: string) => void;
}

const STEP_LABELS: Record<string, string> = {
  idle: "Ready to withdraw",
  approving: "Approving...",
  redeeming: "Processing withdrawal...",
  success: "Withdrawal successful!",
  error: "Withdrawal failed",
};

export function RedeemModal({ vault, isOpen, onClose, onSuccess }: RedeemModalProps) {
  const { address, isConnected } = useAccount();
  const [shareAmount, setShareAmount] = useState("");

  const parsedShares = shareAmount ? parseAmount(shareAmount, 6) : 0n;

  const { position } = useUserPosition(vault.id as any, address);
  const { assets: previewAssets } = usePreviewRedeem(vault.id as any, parsedShares > 0n ? parsedShares : undefined);

  const {
    redeem,
    step,
    isLoading,
    isSuccess,
    hash: redeemTxHash,
    instant,
    error,
    reset,
  } = useRedeem(vault.id as any);

  const handleRedeem = useCallback(async () => {
    if (!parsedShares || !isConnected) return;
    try {
      await redeem(parsedShares);
      if (redeemTxHash) onSuccess?.(redeemTxHash);
      toast.success("Withdrawal confirmed!");
    } catch (e: any) {
      toast.error(e?.message || "Withdrawal failed");
    }
  }, [redeem, parsedShares, redeemTxHash, isConnected, onSuccess]);

  const handleClose = () => {
    reset();
    setShareAmount("");
    onClose();
  };

  const setMax = () => {
    if (position?.shares) {
      setShareAmount(formatAmount(position.shares, 6, 6));
    }
  };

  if (!isOpen) return null;

  const isProcessing = isLoading;
  const userShares = position?.shares ? formatAmount(position.shares, 6, 4) : "0.0000";
  const userAssets = position?.assets ? formatAmount(position.assets, 6, 2) : "0.00";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-[#1a4a2e] bg-[#0f2d1e] shadow-2xl overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-amber-500/60 to-amber-500/20" />

        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-900/30 border border-amber-500/20 flex items-center justify-center text-xl">
              {vault.icon}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Withdraw from {vault.name}</h2>
              <p className="text-xs text-[#6b9e7e]">Balance: {userAssets} {vault.inputToken}</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 rounded-lg text-[#6b9e7e] hover:text-white hover:bg-[#1a4a2e] transition-all flex items-center justify-center">
            <X size={18} />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-6 pt-2 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-amber-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {instant ? "Withdrawal Successful!" : "Withdrawal Queued!"}
            </h3>
            {instant ? (
              <p className="text-[#6b9e7e] mb-6">Your {vault.inputToken} has been returned to your wallet.</p>
            ) : (
              <div className="flex items-center gap-2 justify-center text-amber-400 mb-6">
                <Clock size={16} />
                <p className="text-sm">Queued — funds arrive within 24h</p>
              </div>
            )}
            {redeemTxHash && (
              <a href={`https://basescan.org/tx/${redeemTxHash}`} target="_blank" rel="noopener noreferrer"
                className="text-sm text-amber-400 hover:underline block mb-6">
                View on Basescan →
              </a>
            )}
            <button onClick={handleClose} className="w-full py-3 rounded-xl font-semibold bg-amber-500 text-[#0a1f14]">Done</button>
          </div>
        ) : (
          <div className="p-6 pt-2 space-y-4">
            {/* Current position */}
            <div className="rounded-xl bg-[#0a1f14] border border-[#1a4a2e] p-4">
              <div className="text-xs text-[#6b9e7e] mb-1">Your position</div>
              <div className="text-2xl font-bold text-white">{userAssets} {vault.inputToken}</div>
              <div className="text-sm text-[#6b9e7e] mt-0.5">{userShares} {vault.symbol} shares</div>
            </div>

            {/* Share input */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-[#6b9e7e]">Shares to Redeem</label>
              </div>
              <div className="relative">
                <input
                  className="w-full bg-[#0a1f14] border border-[#1a4a2e] rounded-xl px-4 py-4 text-lg font-semibold text-white placeholder-[#1a4a2e] focus:outline-none focus:border-amber-500/50 transition-colors"
                  type="number" placeholder="0.000000" value={shareAmount}
                  onChange={(e) => setShareAmount(e.target.value)}
                  disabled={isProcessing} min="0" step="0.000001"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#6b9e7e]">{vault.symbol}</span>
              </div>
              <div className="flex gap-2 mt-2">
                {[25, 50, 75].map((pct) => (
                  <button key={pct} onClick={() => {
                    if (position?.shares) {
                      const pctAmt = (position.shares * BigInt(pct)) / 100n;
                      setShareAmount(formatAmount(pctAmt, 6, 6));
                    }
                  }} className="text-xs px-3 py-1.5 rounded-lg border border-[#1a4a2e] text-[#6b9e7e] hover:text-amber-400 hover:border-amber-500/30 transition-colors">
                    {pct}%
                  </button>
                ))}
                <button onClick={setMax} className="text-xs px-3 py-1.5 rounded-lg border border-amber-500/20 text-amber-400 hover:bg-amber-500/10 transition-colors">MAX</button>
              </div>
            </div>

            {/* Preview */}
            {shareAmount && parseFloat(shareAmount) > 0 && (
              <div className="rounded-xl bg-[#0a1f14] border border-[#1a4a2e] p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#6b9e7e]">You receive</span>
                  <span className="text-white font-medium">~{previewAssets ? formatAmount(previewAssets, 6, 4) : "..."} {vault.inputToken}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#6b9e7e]">Redemption type</span>
                  <span className={instant ? "text-[#22c55e]" : "text-amber-400"}>
                    {instant === undefined ? "—" : instant ? "⚡ Instant" : "⏳ Queued"}
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-500/5 border border-blue-500/15">
              <Clock size={13} className="text-blue-400 mt-0.5 shrink-0" />
              <p className="text-xs text-blue-200/70">Some withdrawals may be queued if instant liquidity is unavailable. You'll receive assets within 24 hours.</p>
            </div>

            {isProcessing && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-900/15 border border-amber-500/20 text-amber-400 text-sm">
                <Loader2 size={16} className="animate-spin" />
                <span>{STEP_LABELS[step] ?? "Processing..."}</span>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-900/20 border border-red-500/20 text-red-400 text-sm">
                <AlertCircle size={16} />
                <span>{error.message?.slice(0, 100) ?? "Transaction failed"}</span>
              </div>
            )}

            <button
              className="w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-amber-500 text-[#0a1f14] hover:bg-amber-400"
              onClick={handleRedeem}
              disabled={!shareAmount || parseFloat(shareAmount) <= 0 || isProcessing || !isConnected}
            >
              {isProcessing ? <><Loader2 size={16} className="animate-spin" />{STEP_LABELS[step]}</> : <>Withdraw <ArrowRight size={16} /></>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
