// Vault definitions used across all pages
// formatAmount is re-exported from utils for convenience in sub-pages

export { formatAmount } from "./utils";

export interface Vault {
    id: string;
    name: string;
    symbol: string;
    icon: string;
    color: string;
    category: "Stablecoin" | "ETH" | "BTC";
    risk: "Conservative" | "Moderate" | "Growth";
    estimatedApy: string; // e.g. "8.64%"
    description: string;
}

export const VAULTS: Vault[] = [
    {
        id: "yoUSD",
        name: "Dollar Stash",
        symbol: "yoUSD",
        icon: "💵",
        color: "#22c55e",
        category: "Stablecoin",
        risk: "Conservative",
        estimatedApy: "8.64%",
        description: "Save in USDC and earn optimized DeFi yield automatically",
    },
    {
        id: "yoETH",
        name: "Ether Stash",
        symbol: "yoETH",
        icon: "⟠",
        color: "#818cf8",
        category: "ETH",
        risk: "Moderate",
        estimatedApy: "5.20%",
        description: "Grow your ETH with risk-adjusted yield strategies on Base",
    },
];
