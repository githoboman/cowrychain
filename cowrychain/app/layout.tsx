import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// The design applies --font-outfit to every heading, but it was never loaded —
// so headings silently fell back to system sans. Load it as the display face.
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["500", "600", "700", "800"],
  display: "swap",
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Match the browser chrome to the app in each theme.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#050a08" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
