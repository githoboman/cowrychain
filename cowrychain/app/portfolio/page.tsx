"use client";

import { Navbar } from "@/components/Navbar";
import { PortfolioSummary } from "@/components/PortfolioSummary";
import { YieldChart } from "@/components/YieldChart";
import { useUserPosition, useVaultHistory } from "@yo-protocol/react";
import { useAccount } from "wagmi";
import { VAULT_META } from "@/lib/constants";
import { formatAmount } from "@/lib/utils";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ExternalLink, TrendingUp } from "lucide-react";

interface VaultMeta {
  name: string;
  icon: string;
  color: string;
  asset: string;
  assetSymbol: string;
  description: string;
  tagline: string;
}

function VaultRow({ vaultId, meta }: { vaultId: string; meta: VaultMeta }) {
  const { address } = useAccount();
  const { position, isLoading } = useUserPosition(vaultId as any, address);
  const { yieldHistory } = useVaultHistory(vaultId as any);

  const hasPosition = position && position.shares > 0n;
  if (!hasPosition) return null;

  const latestApy = (yieldHistory?.[yieldHistory.length - 1] as any)?.apy;
  const apyDisplay = latestApy !== undefined ? `${(latestApy * 100).toFixed(2)}%` : "—";

  const assetVal = position.assets ? formatAmount(position.assets, 6, 2) : "0.00";
  const shareVal = formatAmount(position.shares, 6, 6);

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-[#1a4a2e] bg-[#0a1f14] hover:border-[#22c55e]/30 transition-all">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
        style={{ background: `${meta.color}15`, border: `1px solid ${meta.color}30` }}
      >
        {meta.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-white">{meta.name}</div>
        <div className="text-xs text-[#6b9e7e]">{meta.assetSymbol} · {meta.tagline}</div>
      </div>
      <div className="text-center hidden sm:block">
        <div className="text-xs text-[#6b9e7e] mb-0.5">Shares</div>
        <div className="text-sm font-medium text-white">{shareVal}</div>
      </div>
      <div className="text-center">
        <div className="text-xs text-[#6b9e7e] mb-0.5">Value</div>
        <div className="text-sm font-bold text-white">${assetVal}</div>
      </div>
      <div className="text-center">
        <div className="text-xs text-[#6b9e7e] mb-0.5">APY</div>
        <div className="text-sm font-bold text-[#22c55e]">{apyDisplay}</div>
      </div>
      <a
        href={`https://basescan.org/address/${vaultId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-lg hover:bg-[#1a4a2e] text-[#6b9e7e] hover:text-[#22c55e] shrink-0 transition-all"
      >
        <ExternalLink size={14} />
      </a>
    </div>
  );
}

export default function PortfolioPage() {
  const { isConnected } = useAccount();

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        <div className="mb-8 mt-8">
          <h1 className="text-3xl font-black text-white mb-2">Portfolio</h1>
          <p className="text-[#6b9e7e]">Track your savings across all YO vaults</p>
        </div>

        {!isConnected ? (
          <div className="rounded-2xl border border-[#1a4a2e] bg-[#0f2d1e] p-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#22c55e]/10 border border-[#22c55e]/20 flex items-center justify-center mx-auto mb-4">
              <TrendingUp size={28} className="text-[#22c55e]" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Connect to View Portfolio</h2>
            <p className="text-[#6b9e7e] mb-6">Connect your wallet to see your DeFi savings portfolio</p>
            <ConnectButton />
          </div>
        ) : (
          <div className="space-y-6">
            <PortfolioSummary />

            <YieldChart initialAmount={1000} apy={8.64} months={12} />

            <div>
              <h2 className="text-lg font-bold text-white mb-4">Active Positions</h2>
              <div className="space-y-3">
                {Object.entries(VAULT_META).map(([vaultId, meta]) => (
                  <VaultRow key={vaultId} vaultId={vaultId} meta={meta} />
                ))}
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-[#6b9e7e]">
                  No positions yet?{" "}
                  <a href="/vaults" className="text-[#22c55e] hover:underline">
                    Browse vaults
                  </a>{" "}
                  to start earning.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
