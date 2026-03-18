"use client";

import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useTotalTvl } from "@yo-protocol/react";
import { formatAmount } from "@/lib/utils";

export function HeroBanner() {
  const { isConnected } = useAccount();
  const { tvl } = useTotalTvl();

  if (isConnected) return null;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#22c55e]/20 bg-gradient-to-br from-[#0f2d1e] via-[#0a2d1c] to-[#0a1f14] p-8 mb-8">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#22c55e]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-[#f59e0b]/5 rounded-full blur-3xl translate-y-1/2" />

      <div className="relative">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#22c55e]/10 border border-[#22c55e]/20 text-[#22c55e] text-xs font-medium mb-6">
          <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] pulse-green" />
          Live on Base • Powered by YO Protocol
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
          The Smartest<br />
          <span className="text-[#22c55e]">Onchain Savings</span><br />
          Account
        </h1>

        <p className="text-[#6b9e7e] text-lg mb-8 max-w-lg leading-relaxed">
          Save in USDC or ETH. Earn optimized DeFi yield automatically —
          no bank, no middleman, no permission required.
          Withdraw anytime.
        </p>

        <div className="flex flex-wrap items-center gap-4 mb-8">
          <ConnectButton.Custom>
            {({ openConnectModal }) => (
              <button
                onClick={openConnectModal}
                className="px-8 py-4 rounded-2xl font-bold text-[#0a1f14] bg-[#22c55e] hover:bg-[#16a34a] transition-all shadow-lg shadow-green-900/30 hover:shadow-green-900/50 hover:scale-105 text-base"
              >
                Start Saving Now →
              </button>
            )}
          </ConnectButton.Custom>
          <div className="text-sm text-[#6b9e7e]">
            No signup. Just connect your wallet.
          </div>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap gap-6">
          {[
            { label: "Protocol TVL", value: tvl ? `$${formatAmount((tvl as any)?.totalTvl ?? 0n, 6, 0)}` : "Loading..." },
            { label: "Network", value: "Base L2" },
            { label: "Settlement", value: "Onchain" },
            { label: "Custody", value: "Non-custodial" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-xs text-[#6b9e7e] uppercase tracking-wide mb-1">{stat.label}</div>
              <div className="font-bold text-white">{stat.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
