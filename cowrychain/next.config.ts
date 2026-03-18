import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // ESLint 8 config-next conflicts with flat config; runs separately via `npm run lint`
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    // Suppress optional peer-dep warnings from MetaMask SDK + WalletConnect
    config.resolve.alias = {
      ...config.resolve.alias,
      "@react-native-async-storage/async-storage": false,
      "pino-pretty": false,
    };
    return config;
  },
};

export default nextConfig;
