"use client";

import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { HeroBanner } from "@/components/HeroBanner";
import { PortfolioSummary } from "@/components/PortfolioSummary";
import { VaultCard } from "@/components/VaultCard";
import { YieldInsights } from "@/components/YieldInsights";
import { TransactionHistory } from "@/components/TransactionHistory";
import { YieldCalculator } from "@/components/YieldCalculator";
import { SavingsGoals } from "@/components/SavingsGoals";
import { VAULT_IDS } from "@/lib/constants";

export function Dashboard() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Main content */}
      <main className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
        {/* Portfolio Overview */}
        <section className="mb-8 p-6 glass-card rounded-3xl">
          <PortfolioSummary />
        </section>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Vaults - left 2 cols */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Savings Vaults</h2>
                <p className="text-sm text-muted-foreground mt-1">Select a vault to start earning yield on Base.</p>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl glass border-border/50">
                <div className="w-2 h-2 rounded-full bg-primary pulse-primary" />
                <span className="text-xs font-semibold text-primary">Live Yield</span>
              </div>
            </div>

            {/* Vault cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.keys(VAULT_IDS).map((vaultId) => (
                <VaultCard key={vaultId} vaultId={vaultId} />
              ))}
            </div>

            {/* Transaction History */}
            <div className="mt-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold tracking-tight">Activity History</h2>
              </div>
              <div className="glass-card rounded-3xl overflow-hidden">
                 <TransactionHistory />
              </div>
            </div>
          </div>

          {/* Sidebar - right 1 col */}
          <div className="lg:col-span-1 space-y-8">
            <div className="glass-card rounded-3xl p-7">
               <YieldCalculator />
            </div>

            <div className="glass-card rounded-3xl p-7">
               <SavingsGoals />
            </div>
            
            <div className="glass-card rounded-3xl p-7">
              <YieldInsights />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-lg">🐚</div>
            <div>
              <span className="font-bold text-lg">CowryChain</span>
              <p className="text-xs text-muted-foreground">The future of onchain savings.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="/vaults" className="hover:text-primary transition-colors">Vaults</Link>
            <Link href="/save" className="hover:text-primary transition-colors">Save</Link>
            <Link href="/portfolio" className="hover:text-primary transition-colors">Portfolio</Link>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
             <span className="flex items-center gap-1.5">
               <div className="w-1 h-1 rounded-full bg-primary" />
               Powered by YO
             </span>
             <span className="flex items-center gap-1.5">
               <div className="w-1 h-1 rounded-full bg-primary" />
               Built on Base
             </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

