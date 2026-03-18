"use client";

import { useAccount } from "wagmi";
import { useGlobalVaultHistory } from "@yo-protocol/react";
import { formatAmount } from "@/lib/utils";
import { ArrowDownToLine, ArrowUpFromLine, Clock } from "lucide-react";

export function TransactionHistory() {
  const { address, isConnected } = useAccount();
  const { history, isLoading } = useGlobalVaultHistory({ limit: 10 });

  let txs: any[] = [];
  if (Array.isArray(history)) {
    txs = history;
  } else if (history) {
    const h = history as any;
    if (Array.isArray(h.data)) txs = h.data;
    else if (Array.isArray(h.items)) txs = h.items;
    else if (Array.isArray(h.transactions)) txs = h.transactions;
    else if (Array.isArray(h.history)) txs = h.history;
  }

  if (!isConnected) {
    return (
      <div className="rounded-2xl border border-[#1a4a2e] bg-[#0f2d1e] p-8 text-center">
        <div className="text-4xl mb-3">🔗</div>
        <p className="text-[#6b9e7e]">Connect your wallet to see transaction history</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#1a4a2e] bg-[#0f2d1e] overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-[#1a4a2e]/60">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <Clock size={16} className="text-[#22c55e]" />
          Recent Activity
        </h3>
        <span className="text-xs text-[#6b9e7e]">Last 10 txns</span>
      </div>

      {isLoading ? (
        <div className="p-5 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="shimmer h-14 rounded-xl" />
          ))}
        </div>
      ) : txs.length === 0 ? (
        <div className="p-8 text-center text-[#6b9e7e] text-sm">
          No transactions yet. Make your first deposit!
        </div>
      ) : (
        <div className="divide-y divide-[#1a4a2e]/40">
          {txs.map((tx: any, i: number) => {
            const isDeposit = tx.type === "deposit";
            return (
              <div key={tx.txHash ?? i} className="flex items-center gap-4 p-4 hover:bg-[#1a4a2e]/30 transition-colors">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isDeposit ? "bg-[#22c55e]/10 text-[#22c55e]" : "bg-amber-500/10 text-amber-400"
                  }`}>
                  {isDeposit ? <ArrowDownToLine size={16} /> : <ArrowUpFromLine size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white capitalize">{tx.type}</div>
                  <div className="text-xs text-[#6b9e7e] truncate">
                    {tx.vaultId ?? "Vault"} • {tx.txHash ? `${tx.txHash.slice(0, 8)}...` : ""}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-semibold ${isDeposit ? "text-[#22c55e]" : "text-amber-400"}`}>
                    {isDeposit ? "+" : "-"}${formatAmount(tx.assets ?? tx.shares ?? 0n, 6, 2)}
                  </div>
                  <div className="text-xs text-[#6b9e7e]">
                    {tx.timestamp ? new Date(Number(tx.timestamp) * 1000).toLocaleDateString() : "—"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
