"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { base, mainnet, arbitrum } from "wagmi/chains";

export const wagmiConfig = getDefaultConfig({
  appName: "CowryChain",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "cowrychain-demo",
  chains: [base, mainnet, arbitrum],
  ssr: true,
});

export const SUPPORTED_CHAINS = [base, mainnet, arbitrum];
