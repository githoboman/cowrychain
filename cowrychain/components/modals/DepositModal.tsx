"use client";

import { useState, useCallback } from "react";
import { useAccount } from "wagmi";
import {
  useDeposit,
  useTokenBalance,
  usePreviewDeposit,
} from "@yo-protocol/react";
import { parseAmount, formatAmount } from "@/lib/utils";
import { USDC_ADDRESS_BASE, WETH_ADDRESS_BASE, USDC_DECIMALS, YO_CHAIN_ID } from "@/lib/constants";
import { X, ArrowDownToLine, Loader2, CheckCircle2, AlertCircle, Info } from "lucide-react";

interface DepositModalProps {
  vaultId: string;
  meta: {
    name: string;
    icon: string;
    color: string;
    asset: string;
    assetSymbol: string;
  };
  onClose: () => void;
}

const QUICK_AMOUNTS = ["10", "50", "100", "500"];

// Map each vault to its underlying asset address and decimals
const VAULT_ASSET_CONFIG: Record<string, { address: `0x${string}`; decimals: number }> = {
  yoUSD: { address: USDC_ADDRESS_BASE, decimals: 6 },
  yoETH: { address: WETH_ADDRESS_BASE, decimals: 18 },
};

export function DepositModal({ vaultId, meta, onClose }: DepositModalProps) {
  const [amount, setAmount] = useState("");
  const { address } = useAccount();

  const assetConfig = VAULT_ASSET_CONFIG[vaultId] ?? VAULT_ASSET_CONFIG.yoUSD;
  const assetAddress = assetConfig.address;
  const assetDecimals = assetConfig.decimals;
  const parsedAmount = parseAmount(amount, assetDecimals);


  const { balance } = useTokenBalance(assetAddress, address);
  const { shares: previewShares } = usePreviewDeposit(vaultId as any, parsedAmount > 0n ? parsedAmount : undefined);

  const {
    deposit,
    reset,
    step,
    isLoading,
    isSuccess,
    error,
    approveHash,
    hash: depositTxHash,
  } = useDeposit({ vault: vaultId as any });

  const handleDeposit = useCallback(async () => {
    if (!parsedAmount || parsedAmount <= 0n) return;
    await deposit({ token: assetAddress, amount: parsedAmount, chainId: YO_CHAIN_ID });
  }, [deposit, parsedAmount, assetAddress]);

  const handleClose = () => {
    if (isSuccess) reset();
    onClose();
  };

  const stepLabels: Record<string, string> = {
    idle: "Ready",
    approving: "Approving USDC...",
    depositing: "Saving to vault...",
    success: "Saved successfully!",
    error: "Transaction failed",
  };

  const isDisabled =
    !amount ||
    parsedAmount <= 0n ||
    isLoading ||
    !address;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl shadow-black/50 overflow-hidden">
        {/* Top accent */}
        <div
          className="h-1 w-full"
          style={{ background: `linear-gradient(90deg, ${meta.color}80, ${meta.color}30)` }}
        />

        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ background: `${meta.color}18`, border: `1px solid ${meta.color}30` }}
            >
              {meta.icon}
            </div>
            <div>
              <h2 className="font-bold text-white text-lg">Save to {meta.name}</h2>
              <p className="text-xs text-muted-foreground">Powered by YO Protocol on Base</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Success state */}
        {isSuccess ? (
          <div className="p-6 pt-2 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} className="text-primary" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Saved! 🎉</h3>
            <p className="text-[#6b9e7e] text-sm mb-4">
              Your funds are now earning yield in the {meta.name} vault.
            </p>
            {depositTxHash && (
              <a
                href={`${process.env.NEXT_PUBLIC_EXPLORER_URL}/tx/${depositTxHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-sm hover:underline"
              >
                View on BaseScan →
              </a>
            )}
            <button
              onClick={handleClose}
              className="mt-6 w-full py-3 rounded-xl font-semibold text-sm bg-primary text-white"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="p-6 pt-2 space-y-5">
            {/* Balance */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Available balance</span>
              <button
                className="font-medium hover:text-white transition-colors"
                style={{ color: meta.color }}
                onClick={() => balance && setAmount(formatAmount((balance as any).value ?? 0n, assetDecimals, 6))}
              >
                {balance ? formatAmount((balance as any).value ?? 0n, assetDecimals, 2) : "0.00"} {meta.assetSymbol}
              </button>
            </div>

            {/* Amount input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                $
              </div>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-secondary/50 border border-border rounded-xl px-8 py-4 text-xl font-bold text-foreground placeholder-muted-foreground/30 focus:outline-none focus:border-primary/50 transition-colors"
                min="0"
                step="0.01"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                {meta.assetSymbol}
              </div>
            </div>

            {/* Quick amounts */}
            <div className="flex gap-2">
              {QUICK_AMOUNTS.map((qa) => (
                <button
                  key={qa}
                  onClick={() => setAmount(qa)}
                  className="flex-1 py-2 rounded-lg text-sm font-medium border border-border text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all"
                >
                  ${qa}
                </button>
              ))}
            </div>

            {/* Preview */}
            {amount && parsedAmount > 0n && (
              <div className="rounded-xl bg-secondary/30 border border-border p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#6b9e7e]">You receive (shares)</span>
                  <span className="text-white font-medium">
                    {previewShares ? formatAmount(previewShares, 6, 6) : "—"} y{meta.assetSymbol}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Network</span>
                  <span className="text-foreground">Base • Est. ~$0.01 fee</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#6b9e7e]">Vault</span>
                  <span className="text-white">{vaultId}</span>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-red-900/20 border border-red-500/20 text-red-400 text-sm">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{error.message?.slice(0, 100) ?? "Transaction failed"}</span>
              </div>
            )}

            {/* Step indicator */}
            {isLoading && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm">
                <Loader2 size={16} className="animate-spin" />
                <span>{stepLabels[step] ?? "Processing..."}</span>
                {approveHash && step === "depositing" && (
                  <span className="text-xs text-[#6b9e7e] ml-auto">Approved ✓</span>
                )}
              </div>
            )}

            {/* Info */}
            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <Info size={13} className="mt-0.5 shrink-0" />
              <span>
                Funds are deposited into the YO Protocol vault on Base. Yield accrues every block.
                You can withdraw anytime.
              </span>
            </div>

            {/* CTA */}
            <button
              onClick={handleDeposit}
              disabled={isDisabled}
              className="w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: isDisabled ? "hsl(var(--secondary))" : `linear-gradient(135deg, ${meta.color}, ${meta.color}cc)`,
                color: isDisabled ? "hsl(var(--muted-foreground))" : "white",
                boxShadow: isDisabled ? "none" : `0 4px 20px ${meta.color}30`,
              }}
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <ArrowDownToLine size={18} />
              )}
              {isLoading ? stepLabels[step] : `Save $${amount || "0"}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
