import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CowryChain — Onchain Savings for Everyone",
  description: "The smartest DeFi savings account. Save in USDC and ETH, earn optimized yield powered by YO Protocol on Base.",
  keywords: ["DeFi", "savings", "yield", "USDC", "Base", "YO Protocol"],
  openGraph: {
    title: "CowryChain",
    description: "Onchain savings, reimagined",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
