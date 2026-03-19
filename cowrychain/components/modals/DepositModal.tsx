"use client";

import { useState, useCallback, useEffect } from "react";
import { useAccount, useSendTransaction, useWaitForTransactionReceipt, useReadContract, useWriteContract } from "wagmi";
import { parseAbi, erc20Abi } from "viem";
import { VAULTS } from "@yo-protocol/core";
import {
  useTokenBalance,
  usePreviewDeposit,
} from "@yo-protocol/react";
import { parseAmount, formatAmount } from "@/lib/utils";
import { USDC_ADDRESS_BASE, WETH_ADDRESS_BASE, YO_CHAIN_ID } from "@/lib/constants";
import { X, ArrowDownToLine, Loader2, CheckCircle2, AlertCircle, Info, ChevronDown } from "lucide-react";
import { fetchZapQuote, ZAP_SUPPORTED_TOKENS, ZapQuote, TokenOption } from "@/lib/zap-service";

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

const VAULT_ASSET_CONFIG: Record<string, { address: `0x${string}`; decimals: number }> = {
  yoUSD: { address: USDC_ADDRESS_BASE, decimals: 6 },
  yoETH: { address: WETH_ADDRESS_BASE, decimals: 18 },
};

export function DepositModal({ vaultId, meta, onClose }: DepositModalProps) {
  const [amount, setAmount] = useState("");
  const { address } = useAccount();

  // Zapping State
  const defaultToken = ZAP_SUPPORTED_TOKENS.find(t => t.symbol === meta.assetSymbol) || ZAP_SUPPORTED_TOKENS[0];
  const [selectedToken, setSelectedToken] = useState<TokenOption>(defaultToken);
  const [isTokenSelectorOpen, setIsTokenSelectorOpen] = useState(false);
  const [zapQuote, setZapQuote] = useState<ZapQuote | null>(null);
  const [isFetchingQuote, setIsFetchingQuote] = useState(false);
  const [zapTxHash, setZapTxHash] = useState<`0x${string}`>();
  const [protocolStep, setProtocolStep] = useState<"idle" | "approving" | "depositing" | "success" | "error">("idle");
  const [depositError, setDepositError] = useState<Error | null>(null);
  const [depositTxHash, setDepositTxHash] = useState<`0x${string}`>();
  const [simulatedZapStep, setSimulatedZapStep] = useState<"idle" | "zapping" | "done">("idle");

  const assetConfig = VAULT_ASSET_CONFIG[vaultId] ?? VAULT_ASSET_CONFIG.yoUSD;
  const assetAddress = assetConfig.address;
  const assetDecimals = assetConfig.decimals;
  
  const isZapping = selectedToken.symbol !== meta.assetSymbol;
  
  // Only parse against the selected token's decimals
  const parsedAmount = parseAmount(amount, selectedToken.decimals);
  
  // Real vault balance for native asset vs selected asset
  const { balance } = useTokenBalance(selectedToken.address, address);
  
  // Preview shares logic: if zapping, we use the estimated output amount from the zap
  const depositTargetAmount = isZapping && zapQuote ? zapQuote.expectedOutputAmount : parsedAmount;
  const { shares: previewShares } = usePreviewDeposit(
    vaultId as any, 
    depositTargetAmount > 0n ? depositTargetAmount : undefined
  );

  const targetVaultAddress = (VAULTS as any)[vaultId]?.address as `0x${string}`;

  // Read current allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: assetAddress,
    abi: erc20Abi,
    functionName: "allowance",
    args: address ? [address, targetVaultAddress] : undefined,
    query: { enabled: !!address && !!targetVaultAddress }
  });

  const { writeContractAsync } = useWriteContract();
  const { sendTransactionAsync } = useSendTransaction();
  const { isSuccess: isZapConfirmed } = useWaitForTransactionReceipt({ hash: zapTxHash });

  const paymasterCapabilities = {
    paymasterService: {
      url: process.env.NEXT_PUBLIC_PAYMASTER_URL || "https://api.developer.coinbase.com/rpc/v1/base/YOUR_API_KEY",
    }
  };

  // Fetch Zap Quote when amount/asset changes
  useEffect(() => {
    if (isZapping && amount && parsedAmount > 0n) {
      setIsFetchingQuote(true);
      const timer = setTimeout(async () => {
        const quote = await fetchZapQuote(selectedToken, meta.assetSymbol, amount);
        setZapQuote(quote);
        setIsFetchingQuote(false);
      }, 600);
      return () => clearTimeout(timer);
    } else {
      setZapQuote(null);
      setIsFetchingQuote(false);
    }
  }, [amount, selectedToken, isZapping, parsedAmount, meta.assetSymbol]);


  const handleDeposit = useCallback(async () => {
    if (!parsedAmount || parsedAmount <= 0n || !targetVaultAddress || !address) return;
    setDepositError(null);

    try {
      if (isZapping && zapQuote?.txData && zapQuote?.txTo) {
        setSimulatedZapStep("zapping");
        
        const hash = await sendTransactionAsync({
          to: zapQuote.txTo,
          data: zapQuote.txData,
          value: zapQuote.txValue || 0n,
          capabilities: paymasterCapabilities
        } as any);
        
        setZapTxHash(hash);
        await new Promise(res => setTimeout(res, 2500)); 
        setSimulatedZapStep("done");
        
        // Ensure approval for the target deposit of the swapped amount
        if ((allowance ?? 0n) < zapQuote.expectedOutputAmount) {
          setProtocolStep("approving");
          await writeContractAsync({
            address: assetAddress,
            abi: erc20Abi,
            functionName: "approve",
            args: [targetVaultAddress, zapQuote.expectedOutputAmount],
            capabilities: paymasterCapabilities
          } as any);
          await new Promise(res => setTimeout(res, 2000));
        }

        setProtocolStep("depositing");
        const depHash = await writeContractAsync({
          address: targetVaultAddress,
          abi: parseAbi(["function deposit(uint256 assets, address receiver) returns (uint256)"]),
          functionName: "deposit",
          args: [zapQuote.expectedOutputAmount, address],
          capabilities: paymasterCapabilities
        } as any);
        
        setDepositTxHash(depHash);
        setProtocolStep("success");
      } else {
        // Standard Deposit
        if ((allowance ?? 0n) < parsedAmount) {
          setProtocolStep("approving");
          await writeContractAsync({
            address: assetAddress,
            abi: erc20Abi,
            functionName: "approve",
            args: [targetVaultAddress, parsedAmount],
            capabilities: paymasterCapabilities
          } as any);
          await new Promise(res => setTimeout(res, 2000));
        }

        setProtocolStep("depositing");
        const depHash = await writeContractAsync({
          address: targetVaultAddress,
          abi: parseAbi(["function deposit(uint256 assets, address receiver) returns (uint256)"]),
          functionName: "deposit",
          args: [parsedAmount, address],
          capabilities: paymasterCapabilities
        } as any);
        
        setDepositTxHash(depHash);
        setProtocolStep("success");
      }
    } catch (err: any) {
      console.error("Deposit Flow Error:", err);
      setDepositError(err);
      setSimulatedZapStep("idle");
      setProtocolStep("error");
    }
  }, [sendTransactionAsync, writeContractAsync, parsedAmount, assetAddress, isZapping, zapQuote, targetVaultAddress, address, allowance]);

  const handleClose = () => {
    if (protocolStep === "success") {
      setProtocolStep("idle");
      setDepositTxHash(undefined);
    }
    onClose();
  };

  const currentStep = simulatedZapStep === "zapping" ? "zapping" : protocolStep;
  const isLoading = 
    protocolStep === "approving" || 
    protocolStep === "depositing" || 
    simulatedZapStep === "zapping";

  const stepLabels: Record<string, string> = {
    idle: "Ready",
    zapping: `Swapping ${selectedToken.symbol} to ${meta.assetSymbol}...`,
    approving: `Approving ${meta.assetSymbol}...`,
    depositing: "Saving to vault...",
    success: "Saved successfully!",
    error: "Transaction failed",
  };

  const isDisabled =
    !amount ||
    parsedAmount <= 0n ||
    isLoading ||
    !address ||
    (isZapping && isFetchingQuote);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl shadow-black/50 overflow-visible">
        {/* Top accent */}
        <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${meta.color}80, ${meta.color}30)` }} />

        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: `${meta.color}18`, border: `1px solid ${meta.color}30` }}>
              {meta.icon}
            </div>
            <div>
              <h2 className="font-bold text-white text-lg">Save to {meta.name}</h2>
              <p className="text-xs text-muted-foreground">Powered by YO Protocol on Base</p>
            </div>
          </div>
          <button onClick={handleClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
            <X size={18} />
          </button>
        </div>

        {/* Success state */}
        {protocolStep === "success" ? (
          <div className="p-6 pt-2 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} className="text-primary" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Saved! 🎉</h3>
            <p className="text-[#6b9e7e] text-sm mb-4">
              Your funds are now earning yield in the {meta.name} vault.
            </p>
            {depositTxHash && (
              <a href={`${process.env.NEXT_PUBLIC_EXPLORER_URL}/tx/${depositTxHash}`} target="_blank" rel="noopener noreferrer" className="text-primary text-sm hover:underline">
                View on BaseScan →
              </a>
            )}
            <button onClick={handleClose} className="mt-6 w-full py-3 rounded-xl font-semibold text-sm bg-primary text-white">
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
                onClick={() => balance && setAmount(formatAmount((balance as any).value ?? 0n, selectedToken.decimals, 6))}
              >
                {balance ? formatAmount((balance as any).value ?? 0n, selectedToken.decimals, 2) : "0.00"} {selectedToken.symbol}
              </button>
            </div>

            {/* Amount input block */}
            <div className="relative flex items-center rounded-xl bg-secondary/50 border border-border focus-within:border-primary/50 transition-colors p-2">
              <div className="flex-1 py-2 px-3">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-transparent text-2xl font-bold text-foreground placeholder-muted-foreground/30 focus:outline-none"
                  min="0"
                  step="0.01"
                />
                <div className="text-xs font-medium text-muted-foreground mt-1">
                  ~${amount || "0.00"}
                </div>
              </div>
              
              {/* Token Selector */}
              <div className="relative">
                <button 
                  onClick={() => setIsTokenSelectorOpen(!isTokenSelectorOpen)}
                  className="flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-2 hover:bg-secondary transition-colors"
                >
                  <span className="text-lg">{selectedToken.icon}</span>
                  <span className="font-bold">{selectedToken.symbol}</span>
                  <ChevronDown size={16} className="text-muted-foreground" />
                </button>

                {isTokenSelectorOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden">
                    {ZAP_SUPPORTED_TOKENS.map((token) => (
                      <button
                        key={token.symbol}
                        onClick={() => {
                          setSelectedToken(token);
                          setIsTokenSelectorOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary transition-colors text-left ${selectedToken.symbol === token.symbol ? 'bg-secondary/50' : ''}`}
                      >
                        <span className="text-xl">{token.icon}</span>
                        <div>
                          <div className="font-bold text-sm text-foreground">{token.symbol}</div>
                          <div className="text-xs text-muted-foreground">{token.name}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
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

            {/* Zapper Quote / Preview */}
            {amount && parsedAmount > 0n && (
              <div className="rounded-xl bg-secondary/30 border border-border p-4 space-y-3">
                {isZapping && (
                  <>
                    <div className="flex justify-between items-center text-sm border-b border-border/50 pb-2 mb-2">
                      <span className="text-muted-foreground flex items-center gap-1">
                        Zap Route {isFetchingQuote && <Loader2 size={12} className="animate-spin" />}
                      </span>
                      <span className="text-white font-medium flex items-center gap-2">
                         {selectedToken.symbol} ➔ {meta.assetSymbol}
                      </span>
                    </div>
                    {zapQuote && (
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Zap Rate</span>
                        <span className="text-white font-medium text-xs bg-black/20 px-2 py-0.5 rounded">
                           Slippage: {zapQuote.slippagePercent}%
                        </span>
                      </div>
                    )}
                  </>
                )}
                
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
              </div>
            )}

            {/* Error */}
            {depositError && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-red-900/20 border border-red-500/20 text-red-400 text-sm">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{depositError.message?.slice(0, 100) ?? "Transaction failed"}</span>
              </div>
            )}

            {/* Step indicator */}
            {isLoading && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm">
                <Loader2 size={16} className="animate-spin" />
                <span>{stepLabels[currentStep] ?? "Processing..."}</span>
                {protocolStep === "approving" && currentStep === "depositing" && (
                  <span className="text-xs text-[#6b9e7e] ml-auto">Approved ✓</span>
                )}
              </div>
            )}

            {/* Info */}
            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <Info size={13} className="mt-0.5 shrink-0" />
              <span>
                {isZapping ? `Your ${selectedToken.symbol} will be automatically zapped into ${meta.assetSymbol} and deposited into the YO Protocol vault.` : `Funds are deposited into the YO Protocol vault on Base. Yield accrues every block.`}
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
              {isLoading ? stepLabels[currentStep] : isZapping ? `Zap & Save ${selectedToken.symbol}` : `Save $${amount || "0"}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
