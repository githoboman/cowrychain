"use client";

import { Navbar } from "@/components/Navbar";
import { useAccount, useDisconnect } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { LogOut, ExternalLink, Shield } from "lucide-react";

export default function SettingsPage() {
  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen max-w-2xl mx-auto px-4 sm:px-6 pb-16">
        <div className="mb-8 mt-8">
          <h1 className="text-3xl font-black text-white mb-2">Settings</h1>
          <p className="text-[#6b9e7e]">Manage your account and preferences</p>
        </div>

        <div className="space-y-4">
          {/* Wallet */}
          <div className="rounded-2xl border border-[#1a4a2e] bg-[#0f2d1e] p-6">
            <h2 className="text-base font-bold text-white mb-4">Wallet</h2>
            {isConnected ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-[#0a1f14] border border-[#1a4a2e] rounded-xl">
                  <div>
                    <div className="text-xs text-[#6b9e7e] mb-0.5">Connected address</div>
                    <div className="text-sm font-mono text-white break-all">{address}</div>
                  </div>
                  <a
                    href={`https://basescan.org/address/${address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-[#6b9e7e] hover:text-[#22c55e] shrink-0 ml-3 transition-colors"
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#0a1f14] border border-[#1a4a2e] rounded-xl">
                  <div>
                    <div className="text-xs text-[#6b9e7e] mb-0.5">Network</div>
                    <div className="text-sm text-white">{chain?.name || "Unknown"}</div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-[#22c55e] pulse-green" />
                </div>
                <button
                  onClick={() => disconnect()}
                  className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 px-3 py-2 rounded-xl hover:bg-red-500/5 transition-colors"
                >
                  <LogOut size={14} />
                  Disconnect wallet
                </button>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-[#6b9e7e] text-sm mb-4">No wallet connected</p>
                <ConnectButton />
              </div>
            )}
          </div>

          {/* About */}
          <div className="rounded-2xl border border-[#1a4a2e] bg-[#0f2d1e] p-6">
            <h2 className="text-base font-bold text-white mb-4">About CowryChain</h2>
            <div className="space-y-3 text-sm text-[#6b9e7e]">
              <p>
                CowryChain is a DeFi savings app inspired by CowryWise, built on YO Protocol — an
                institutional-grade, onchain yield optimizer.
              </p>
              <p>
                All funds are held in non-custodial YO vaults. CowryChain has no access to your funds.
              </p>
            </div>
            <div className="flex gap-3 mt-4">
              <a
                href="https://yo.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-[#22c55e] hover:text-[#16a34a] transition-colors"
              >
                YO Protocol <ExternalLink size={12} />
              </a>
              <a
                href="https://docs.yo.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-[#22c55e] hover:text-[#16a34a] transition-colors"
              >
                Documentation <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* Risk */}
          <div className="rounded-2xl border border-amber-500/15 bg-[#0f2d1e] p-6">
            <div className="flex items-center gap-2 mb-3">
              <Shield size={16} className="text-amber-400" />
              <h2 className="text-base font-bold text-white">Risk Disclosure</h2>
            </div>
            <div className="text-sm text-[#6b9e7e] space-y-2">
              <p>
                DeFi carries smart contract risk, strategy risk, and market risk. Yields are variable
                and historical performance does not guarantee future results.
              </p>
              <p>
                YO Protocol vaults are audited and use a risk-adjusted yield engine, but no DeFi
                investment is risk-free.
              </p>
              <p>Only invest funds you can afford to lose.</p>
            </div>
          </div>

          {/* Version */}
          <div className="text-center text-xs text-[#6b9e7e]/50 py-4">
            CowryChain v1.0.0 · Built on @yo-protocol/react v1.0.4 · Base Network
          </div>
        </div>
      </main>
    </>
  );
}
