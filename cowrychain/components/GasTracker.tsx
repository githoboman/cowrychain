"use client";

import { useGasPrice } from "wagmi";
import { Activity } from "lucide-react";
import { formatGwei } from "viem";

export function GasTracker() {
  const { data: gasPrice, isError, isLoading } = useGasPrice();

  if (isError || isLoading || !gasPrice) return null;

  // Format the Gas Price to Gwei and clamp to 2 decimals
  const gwei = parseFloat(formatGwei(gasPrice)).toFixed(2);
  
  // Base is extremely cheap, usually ~0.01 gwei. 
  // We determine "High" congestion if it randomly spikes above 0.5 Gwei contextually for Base.
  const isHigh = parseFloat(gwei) > 0.5;

  return (
    <div className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold font-mono transition-colors shadow-sm ${
      isHigh 
        ? "bg-red-500/10 text-red-400 border-red-500/20" 
        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
    }`}>
      <Activity size={14} className={isHigh ? "animate-pulse" : ""} />
      <span>Gas: {gwei} Gwei</span>
    </div>
  );
}
