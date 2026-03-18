import type { Address } from "viem";

export type VaultId = "yoUSD" | "yoETH" | "yoBTC" | "yoEUR" | "yoGOLD";

export interface VaultConfig {
  id: VaultId;
  name: string;
  description: string;
  symbol: string;
  icon: string;
  color: string;
  gradient: string;
  inputToken: string;
  inputTokenAddress: Address;
  chainId: number;
  estimatedApy: string;
  risk: "Conservative" | "Moderate" | "Growth";
  riskColor: string;
  category: string;
  tag?: string;
}

// Base chain USDC
export const BASE_USDC: Address = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
// Base chain WETH
export const BASE_WETH: Address = "0x4200000000000000000000000000000000000006";
// Base chain WBTC
export const BASE_WBTC: Address = "0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf";

// Ethereum Mainnet
export const ETH_USDC: Address = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
export const ETH_WETH: Address = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

export const VAULTS: VaultConfig[] = [
  {
    id: "yoUSD",
    name: "Dollar Savings",
    description: "Save in USD and earn optimized stablecoin yield. Perfect for building an emergency fund or saving for a goal.",
    symbol: "yoUSD",
    icon: "💵",
    color: "#16a34a",
    gradient: "from-green-500 to-teal-500",
    inputToken: "USDC",
    inputTokenAddress: BASE_USDC,
    chainId: 8453, // Base
    estimatedApy: "8.64%",
    risk: "Conservative",
    riskColor: "text-green-600 bg-green-50",
    category: "Stablecoin",
    tag: "Most Popular",
  },
  {
    id: "yoETH",
    name: "Ethereum Savings",
    description: "Put your ETH to work with battle-tested yield strategies across Pendle, Morpho, and more.",
    symbol: "yoETH",
    icon: "⟠",
    color: "#6366f1",
    gradient: "from-indigo-500 to-purple-500",
    inputToken: "WETH",
    inputTokenAddress: BASE_WETH,
    chainId: 8453, // Base
    estimatedApy: "5.33%",
    risk: "Moderate",
    riskColor: "text-indigo-600 bg-indigo-50",
    category: "ETH",
  },
  {
    id: "yoBTC",
    name: "Bitcoin Savings",
    description: "Earn passive yield on your Bitcoin. Let your BTC compound while you sleep.",
    symbol: "yoBTC",
    icon: "₿",
    color: "#f59e0b",
    gradient: "from-amber-500 to-orange-500",
    inputToken: "WBTC",
    inputTokenAddress: BASE_WBTC,
    chainId: 8453, // Base
    estimatedApy: "4.80%",
    risk: "Moderate",
    riskColor: "text-amber-600 bg-amber-50",
    category: "BTC",
  },
  {
    id: "yoEUR",
    name: "Euro Savings",
    description: "Earn yield in EUR-pegged stablecoins. Earn Merkl rewards on top of base yield.",
    symbol: "yoEUR",
    icon: "€",
    color: "#0ea5e9",
    gradient: "from-sky-500 to-blue-500",
    inputToken: "EURC",
    inputTokenAddress: "0x60a3E35Cc302bFA44Cb288Bc5a4F316Fdb1adb42" as Address,
    chainId: 8453, // Base
    estimatedApy: "9.00%",
    risk: "Conservative",
    riskColor: "text-sky-600 bg-sky-50",
    category: "Stablecoin",
    tag: "Merkl Rewards",
  },
];

export const formatAmount = (amount: bigint, decimals: number = 6, displayDecimals: number = 2): string => {
  const divisor = BigInt(10 ** decimals);
  const whole = amount / divisor;
  const fraction = amount % divisor;
  const fractionStr = fraction.toString().padStart(decimals, "0").slice(0, displayDecimals);
  return `${whole.toString()}.${fractionStr}`;
};

export const parseAmount = (amount: string, decimals: number = 6): bigint => {
  const [whole, fraction = ""] = amount.split(".");
  const paddedFraction = fraction.padEnd(decimals, "0").slice(0, decimals);
  return BigInt(whole || "0") * BigInt(10 ** decimals) + BigInt(paddedFraction || "0");
};
