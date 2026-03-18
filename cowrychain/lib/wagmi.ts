import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { base, mainnet, arbitrum, baseSepolia } from "wagmi/chains";

const isTestnet = process.env.NEXT_PUBLIC_IS_TESTNET === "true";

export const wagmiConfig = getDefaultConfig({
  appName: "CowryChain",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "demo-project-id",
  chains: isTestnet ? [baseSepolia, base] : [base, mainnet, arbitrum],
  ssr: true,
});
