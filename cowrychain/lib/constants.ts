import { base, baseSepolia } from "wagmi/chains";

export const isTestnet = process.env.NEXT_PUBLIC_IS_TESTNET === "true";

export const VAULT_IDS = {
  yoUSD: "yoUSD",
  yoETH: "yoETH",
} as const;

export type VaultId = keyof typeof VAULT_IDS;

const USDC_MAINNET = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as `0x${string}`;
const USDC_SEPOLIA = "0x036CbD53842c5426634e7929541eC2318f3dCF7e" as `0x${string}`; // USDC on Base Sepolia

export const USDC_ADDRESS_BASE = isTestnet ? USDC_SEPOLIA : USDC_MAINNET;
export const WETH_ADDRESS_BASE = "0x4200000000000000000000000000000000000006" as `0x${string}`;

export const DEFAULT_CHAIN = isTestnet ? baseSepolia : base;
export const YO_PARTNER_ID = 9999;
export const YO_CHAIN_ID = DEFAULT_CHAIN.id;

export const USDC_DECIMALS = 6;
export const SHARE_DECIMALS = 6;

export const VAULT_META: Record<string, {
  name: string;
  description: string;
  asset: string;
  assetSymbol: string;
  icon: string;
  color: string;
  tagline: string;
}> = {
  yoUSD: {
    name: "Dollar Stash",
    description: "Save in USDC and earn optimized DeFi yield automatically",
    asset: "USDC",
    assetSymbol: "USDC",
    icon: "💵",
    color: "#22c55e",
    tagline: "Best for stable savings",
  },
  yoETH: {
    name: "Ether Stash",
    description: "Grow your ETH with risk-adjusted yield strategies on Base",
    asset: "ETH",
    assetSymbol: "ETH",
    icon: "⟠",
    color: "#818cf8",
    tagline: "Best for ETH holders",
  },
};
