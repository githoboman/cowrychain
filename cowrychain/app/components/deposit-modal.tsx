// @ts-nocheck
"use client";

import { useState, useCallback } from "react";
import { useDeposit, usePreviewDeposit, useVaultState, useTokenBalance } from "@yo-protocol/react";
import { useAccount } from "wagmi";
import { X, ArrowRight, CheckCircle, Loader2, AlertCircle, Info } from "lucide-react";
import type { VaultConfig } from "@/app/lib/vaults";
import { parseAmount, formatAmount } from "@/app/lib/vaults";
import toast from "react-hot-toast";
import clsx from "clsx";
import { USDC_DECIMALS } from "@/lib/constants";

interface DepositModalProps {
  vault: VaultConfig;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (hash: string) => void;
}

const STEP_LABELS: Record<string, string> = {
  idle: "Ready to deposit",
  approving: "Approving token spend...",
  depositing: "Depositing to vault...",
  success: "Deposit successful!",
  error: "Transaction failed",
};

export function DepositModal({ vault, isOpen, onClose, onSuccess }: DepositModalProps) {
  const { address, isConnected } = useAccount();
  const [amount, setAmount] = useState("");
  const [agreedToRisk, setAgreedToRisk] = useState(false);

  const parsedAmount = amount ? parseAmount(amount, USDC_DECIMALS) : 0n;

  const { balance: tokenBalance } = useTokenBalance(vault.inputTokenAddress, address);
  const { shares: previewShares } = usePreviewDeposit(vault.id as any, parsedAmount > 0n ? parsedAmount : undefined);
  const { vaultState } = useVaultState(vault.id as any);

  const {
    deposit,
    step,
    isLoading,
    isSuccess,
    hash: depositTxHash,
    error,
    reset,
  } = useDeposit(vault.id as any);

  const handleDeposit = useCallback(async () => {
    if (!parsedAmount || !isConnected) return;
    try {
      const txHash = await deposit(parsedAmount);
      if (txHash) onSuccess?.(txHash);
      toast.success(`Deposited ${amount} ${vault.inputToken}!`);
    } catch (e: any) {
      toast.error(e?.message || "Deposit failed");
    }
  }, [deposit, parsedAmount, vault, isConnected, amount, onSuccess]);

  const handleClose = () => {
    reset();
    setAmount("");
    setAgreedToRisk(false);
    onClose();
  };

  const formattedBalance = tokenBalance ? formatAmount(BigInt(tokenBalance.toString()), USDC_DECIMALS, 2) : "0.00";

  const setMax = () => {
    if (tokenBalance) setAmount(formatAmount(BigInt(tokenBalance.toString()), USDC_DECIMALS, 6));
  };

  const setPercent = (pct: number) => {
    if (tokenBalance) {
      const pctAmount = (BigInt(tokenBalance.toString()) * BigInt(pct)) / 100n;
      setAmount(formatAmount(pctAmount, USDC_DECIMALS, 6));
    }
  };

  if (!isOpen) return null;

  const isProcessing = isLoading;

  const estimatedYearlyYield =
    amount && parseFloat(amount) > 0
      ? (parseFloat(amount) * parseFloat(vault.estimatedApy) / 100).toFixed(2)
      : "0.00";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-[#1a4a2e] bg-[#0f2d1e] shadow-2xl overflow-hidden">
        <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${vault.color}80, ${vault.color}30)` }} />

        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ background: `${vault.color}18`, border: `1px solid ${vault.color}30` }}
            >
              {vault.icon}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Deposit to {vault.name}</h2>
              <p className="text-xs text-[#6b9e7e]">Earn {vault.estimatedApy} APY</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 rounded-lg hover:bg-[#1a4a2e] text-[#6b9e7e] hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-6 pt-2 text-center">
            <div className="w-16 h-16 rounded-full bg-[#22c55e]/15 border border-[#22c55e]/30 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-[#22c55e]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Deposit Successful!</h3>
            <p className="text-[#6b9e7e] mb-1">
              You deposited <span className="text-white font-semibold">{amount} {vault.inputToken}</span>
            </p>
            <p className="text-sm text-[#6b9e7e] mb-6">You are now earning {vault.estimatedApy} APY</p>
            {depositTxHash && (
              <a href={`https://basescan.org/tx/${depositTxHash}`} target="_blank" rel="noopener noreferrer" className="text-sm text-[#22c55e] hover:underline block mb-6">
                View on Basescan →
              </a>
            )}
            <button onClick={handleClose} className="w-full py-3 rounded-xl font-semibold bg-[#22c55e] text-[#0a1f14]">Done</button>
          </div>
        ) : (
          <div className="p-6 pt-2 space-y-4">
            {/* Balance + Input */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-[#6b9e7e]">Amount to Deposit</label>
                <span className="text-xs text-[#6b9e7e]">Balance: <span className="text-white">{formattedBalance} {vault.inputToken}</span></span>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b9e7e]">$</span>
                <input
                  className="w-full bg-[#0a1f14] border border-[#1a4a2e] rounded-xl px-8 py-4 text-lg font-semibold text-white placeholder-[#1a4a2e] focus:outline-none focus:border-[#22c55e]/50 transition-colors"
                  type="number" placeholder="0.00" value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={isProcessing} min="0" step="0.01"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#6b9e7e]">{vault.inputToken}</span>
              </div>
              <div className="flex gap-2 mt-2">
                {[25, 50, 75].map((pct) => (
                  <button key={pct} onClick={() => setPercent(pct)} disabled={isProcessing}
                    className="text-xs px-3 py-1.5 rounded-lg border border-[#1a4a2e] text-[#6b9e7e] hover:text-[#22c55e] hover:border-[#22c55e]/30 transition-colors">
                    {pct}%
                  </button>
                ))}
                <button onClick={setMax} disabled={isProcessing}
                  className="text-xs px-3 py-1.5 rounded-lg border border-[#22c55e]/20 text-[#22c55e] hover:bg-[#22c55e]/10 transition-colors">
                  MAX
                </button>
              </div>
            </div>

            {/* Preview */}
            {amount && parseFloat(amount) > 0 && (
              <div className="rounded-xl bg-[#0a1f14] border border-[#1a4a2e] p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#6b9e7e]">You receive</span>
                  <span className="text-white font-medium">{previewShares ? formatAmount(previewShares, 6, 6) : "..."} {vault.symbol}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#6b9e7e]">Estimated APY</span>
                  <span className="text-[#22c55e] font-semibold">{vault.estimatedApy}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#6b9e7e]">Yearly earnings</span>
                  <span className="text-white font-medium">~${estimatedYearlyYield} {vault.inputToken}</span>
                </div>
              </div>
            )}

            {/* Risk disclosure */}
            <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/5 border border-amber-500/15">
              <Info size={14} className="text-amber-400 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-200/70 leading-relaxed">Smart contract and strategy risk apply. Only deposit funds you can afford to have locked. Yields are variable and not guaranteed.</p>
            </div>

            {/* Risk agreement */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={agreedToRisk} onChange={(e) => setAgreedToRisk(e.target.checked)} className="w-4 h-4 rounded accent-green-500" />
              <span className="text-sm text-[#6b9e7e]">I understand the risks and want to proceed</span>
            </label>

            {/* Step indicator */}
            {isProcessing && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-[#22c55e]/10 border border-[#22c55e]/20 text-[#22c55e] text-sm">
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
              className="w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={handleDeposit}
              style={{
                background: !amount || parseFloat(amount) <= 0 || !agreedToRisk || isProcessing ? "#1a4a2e" : `linear-gradient(135deg, ${vault.color}, ${vault.color}cc)`,
                color: !amount || parseFloat(amount) <= 0 || !agreedToRisk || isProcessing ? "#6b9e7e" : "#0a1f14",
              }}
              disabled={!amount || parseFloat(amount) <= 0 || !agreedToRisk || isProcessing || !isConnected}
            >
              {isProcessing ? <><Loader2 size={16} className="animate-spin" />{STEP_LABELS[step]}</> : <>Deposit {amount || "0"} {vault.inputToken}<ArrowRight size={16} /></>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
