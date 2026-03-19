# 🐚 CowryChain

**The smartest onchain savings account — built on Base, powered by YO Protocol.**

CowryChain lets anyone save in USDC or ETH and earn optimized DeFi yield automatically. No bank. No middleman. No permission required. Withdraw anytime.

[![Built on Base](https://img.shields.io/badge/Built%20on-Base-0052FF?style=flat&logo=coinbase)](https://base.org)
[![Powered by YO Protocol](https://img.shields.io/badge/Powered%20by-YO%20Protocol-22c55e?style=flat)](https://yo.xyz)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=nextdotjs)](https://nextjs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## ✨ Premium DeFi Features

- ⛽ **100% Gasless (EIP-5792)** — Approvals and deposits are fully sponsored via Coinbase Smart Wallet Paymasters.
- ⚡ **Auto-Zapping (0x API)** — Instantly swap any token (cbBTC, DEGEN, AERO) directly into Vault shares in one click.
- 🏅 **Gamified Achievements** — Unlock dynamic UI badges directly verified by your active on-chain Collateral balances.
- ⛽ **Live Gas Tracking** — A beautiful real-time widget monitoring the heart of the Base network congestion.
- 💵 **Dollar Stash (yoUSD)** — Deposit USDC and earn optimized stable yield natively.
- ⟠ **Ether Stash (yoETH)** — Deposit ETH and earn risk-adjusted yield.
- 📊 **Real-time Portfolio Dashboard** — Live balance, APY, and yield tracking.
- 🔒 **Non-custodial** — Your keys, your funds. Smart contracts only.
- 🌙 **Dark/Light Mode** — Full theme support via `next-themes`.
- 📱 **Responsive** — Mobile-first design.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 15](https://nextjs.org) (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + custom CSS variables |
| **Animations** | Framer Motion |
| **Web3 / Wallet** | [Wagmi v2](https://wagmi.sh) + [RainbowKit](https://www.rainbowkit.com) |
| **Yield Protocol** | [@yo-protocol/react](https://yo.xyz) SDK |
| **Chain Abstraction** | [viem](https://viem.sh) |
| **Data Fetching** | [@tanstack/react-query](https://tanstack.com/query) |
| **Icons** | [Lucide React](https://lucide.dev) |
| **Network** | Base Mainnet / Base Sepolia (testnet) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- A [WalletConnect Cloud](https://cloud.walletconnect.com) Project ID (free)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/cowrychain.git
cd cowrychain
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env.local
```

Then edit `.env.local`:

```env
# Required: Get yours free at https://cloud.walletconnect.com
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# Set to "true" to use Base Sepolia testnet, "false" for Base mainnet
NEXT_PUBLIC_IS_TESTNET=false

# Block explorer URL for transaction links
# Mainnet: https://basescan.org
# Testnet: https://sepolia.basescan.org
NEXT_PUBLIC_EXPLORER_URL=https://basescan.org
```

> [!NOTE]
> WalletConnect Project ID is **required** for the wallet connection modal to work in production. The app will still run with `demo-project-id` locally, but you'll get degraded wallet support.

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Pages & Navigation

| Route | Description |
|---|---|
| `/` | Home — Landing page (unauthenticated) or Dashboard (connected) |
| `/vaults` | Browse and filter all available YO Protocol vaults |
| `/save` | Set savings goals and execute Token Zapping |
| `/achievements` | View unlocked Gamification badges based on your verified Balance |
| `/coming-soon` | Detailed Roadmap exposing futuristic Protocol features |
| `/portfolio` | Full portfolio overview with positions and history |
| `/settings` | User settings |

---

## 🏗 Project Structure

```
cowrychain/
├── app/
│   ├── layout.tsx          # Root layout with metadata & providers
│   ├── page.tsx            # Root page (Landing or Dashboard based on connection)
│   ├── providers.tsx       # Wagmi, RainbowKit, QueryClient, YieldProvider
│   ├── globals.css         # Global styles & CSS variables
│   ├── vaults/page.tsx     # Vaults explorer page
│   ├── save/page.tsx       # Save & Goals page
│   ├── portfolio/          # Portfolio page
│   └── settings/           # Settings page
│
├── components/
│   ├── Dashboard.tsx        # Main dashboard layout
│   ├── HeroBanner.tsx       # Landing hero with live TVL
│   ├── LandingPage.tsx      # Full landing page
│   ├── Navbar.tsx           # Navigation bar
│   ├── VaultCard.tsx        # Vault display card (APY, TVL, position)
│   ├── PortfolioSummary.tsx # Portfolio stats grid
│   ├── SavingsGoals.tsx     # Goals tracker with live progress
│   ├── YieldCalculator.tsx  # Interactive yield projection
│   ├── YieldChart.tsx       # SVG compound interest chart
│   ├── YieldInsights.tsx    # Protocol stats & leaderboard
│   ├── TransactionHistory.tsx # Recent activity feed
│   ├── ThemeProvider.tsx    # next-themes wrapper
│   ├── ThemeToggle.tsx      # Dark/light toggle button
│   └── modals/
│       ├── DepositModal.tsx  # Deposit flow (USDC / WETH per vault)
│       └── RedeemModal.tsx   # Withdraw/redeem flow
│
└── lib/
    ├── constants.ts         # Chain config, vault metadata, addresses
    ├── utils.ts             # formatAmount, formatAPY, parseAmount, etc.
    ├── vaults.ts            # Vault type definitions and static list
    └── wagmi.ts             # Wagmi config with RainbowKit
```

---

## 🔐 How Vaults Work

CowryChain uses **YO Protocol vaults** — ERC-4626 compatible smart contracts deployed on Base that automatically route deposited assets to the highest-yielding DeFi strategies.

### Deposit Flow
1. User enters an amount and clicks **Save Now**
2. App requests **ERC-20 approval** for the vault to spend your tokens
3. Once approved, the deposit transaction is submitted
4. Shares (`yoUSD` or `yoETH`) are minted representing your position
5. Yield accrues every block; your share value increases over time

### Withdraw Flow
1. User enters share amount and clicks **Withdraw**
2. Redeem transaction is submitted
3. Depending on vault liquidity:
   - **Instant** — Assets returned immediately
   - **Queued** — Redemption queued, funds returned shortly after

### Vault Addresses

| Vault | Network | Asset | Type |
|---|---|---|---|
| `yoUSD` | Base Mainnet / Sepolia | USDC | Stablecoin, Conservative |
| `yoETH` | Base Mainnet / Sepolia | WETH | ETH, Moderate |

> [!IMPORTANT]
> Token addresses are automatically selected based on `NEXT_PUBLIC_IS_TESTNET`:
> - USDC Mainnet: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
> - USDC Sepolia: `0x036CbD53842c5426634e7929541eC2318f3dCF7e`
> - WETH (both): `0x4200000000000000000000000000000000000006`

---

## 🧪 Testing on Testnet

To test without real funds on Base Sepolia:

1. Set `NEXT_PUBLIC_IS_TESTNET=true` in `.env.local`
2. Set `NEXT_PUBLIC_EXPLORER_URL=https://sepolia.basescan.org`
3. Get free Sepolia ETH from the [Base Sepolia Faucet](https://www.alchemy.com/faucets/base-sepolia)
4. Get test USDC from the [Circle Faucet](https://faucet.circle.com)
5. Connect your wallet and start saving!

---

## 🏗 Build & Deployment

### Production Build

```bash
npm run build
npm run start
```

### Deployment (Vercel — Recommended)

1. Push your repo to GitHub
2. Import into [Vercel](https://vercel.com)
3. Add environment variables in the Vercel dashboard:
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
   - `NEXT_PUBLIC_IS_TESTNET`
   - `NEXT_PUBLIC_EXPLORER_URL`
4. Deploy!

### Other Platforms

The app is a standard Next.js 15 application and can be deployed to any platform that supports Node.js (Railway, Render, Fly.io, AWS, etc.).

---

## 🔧 Available Scripts

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "feat: add my feature"`
4. Push to your branch: `git push origin feature/my-feature`
5. Open a Pull Request

Please follow the existing code style and make sure `npx tsc --noEmit` passes before submitting.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgements

- [YO Protocol](https://yo.xyz) — Yield optimization infrastructure
- [Base](https://base.org) — Ethereum L2 by Coinbase
- [RainbowKit](https://www.rainbowkit.com) — Wallet connection UI
- [Wagmi](https://wagmi.sh) — React hooks for Ethereum
- [Framer Motion](https://www.framer.com/motion) — Animation library

---

<div align="center">
  <strong>🐚 CowryChain — Save onchain. Earn automatically. No middlemen.</strong>
</div>
