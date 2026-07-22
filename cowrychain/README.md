# 🐚 CowryChain

**The smartest onchain savings account — built on Base + Initia, powered by YO Protocol.**

CowryChain lets anyone save in USDC or ETH and earn optimized DeFi yield automatically. No bank. No middleman. No permission required. Withdraw anytime. Now powered by the **Initia Interwoven Stack** for cross-chain bridging, social logins, and `.init` usernames.

[![Built on Base](https://img.shields.io/badge/Built%20on-Base-0052FF?style=flat&logo=coinbase)](https://base.org)
[![Powered by Initia](https://img.shields.io/badge/Powered%20by-Initia-7C3AED?style=flat)](https://initia.xyz)
[![InterwovenKit](https://img.shields.io/badge/InterwovenKit-React-a855f7?style=flat)](https://docs.initia.xyz/interwovenkit)
[![Powered by YO Protocol](https://img.shields.io/badge/Powered%20by-YO%20Protocol-22c55e?style=flat)](https://yo.xyz)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=nextdotjs)](https://nextjs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 💡 Why CowryChain?

CowryChain is designed to solve several major friction points in Decentralized Finance (DeFi) today:

1. **The Friction of Gas Fees:** New users are deterred because they must acquire and hold native tokens (ETH) just to make a deposit. CowryChain solves this via **EIP-5792 Paymasters**, allowing 100% gasless transactions sponsored by the protocol.
2. **Complexity of Yield Farming:** Earning high yield requires manually bridging assets, finding liquidity pools, and compounding rewards. CowryChain uses the **YO Protocol SDK** to auto-route funds to the best strategies and auto-compounds yield effortlessly every block.
3. **Asset Fragmentation:** Users often hold volatile tokens (cbBTC, DEGEN) and can't save them directly. CowryChain solves this with **0x API Cross-Chain Zapping**, instantly swapping any asset into a yield-bearing stablecoin position in one click.
4. **Poor User Engagement:** Traditional savings accounts are boring lifeless dashboards. CowryChain introduces **Live Gamification**, automatically unlocking visual cryptographic badges as users grow their active collateral balance on-chain.

---

## ✨ Premium DeFi Features

- 🔮 **Initia Interwoven Stack** — Full integration with Initia's next-gen appchain tooling including native social logins and session keys.
- 🌉 **Interwoven Bridge** — Instantly bridge INIT, USDC, and ETH between your Initia appchain and Base natively.
- 👤 **Initia Usernames (.init)** — Human-readable on-chain identity resolution powered by the Initia username registry.
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

| Layer                      | Technology                                                              |
| -------------------------- | ----------------------------------------------------------------------- |
| **Framework**              | [Next.js 15](https://nextjs.org) (App Router)                           |
| **Language**               | TypeScript                                                              |
| **Styling**                | Tailwind CSS + custom CSS variables                                     |
| **Animations**             | Framer Motion                                                           |
| **Web3 / Wallet (EVM)**    | [Wagmi v2](https://wagmi.sh) + [RainbowKit](https://www.rainbowkit.com) |
| **Web3 / Wallet (Initia)** | [@initia/interwovenkit-react](https://docs.initia.xyz/interwovenkit)    |
| **Yield Protocol**         | [@yo-protocol/react](https://yo.xyz) SDK                                |
| **Chain Abstraction**      | [viem](https://viem.sh)                                                 |
| **Data Fetching**          | [@tanstack/react-query](https://tanstack.com/query)                     |
| **Icons**                  | [Lucide React](https://lucide.dev)                                      |
| **Network (EVM)**          | Base Mainnet / Base Sepolia                                             |
| **Network (Initia)**       | `initiation-2` testnet / Initia Mainnet                                 |

---

## 🔮 Initia Integration: Cross-Chain Savings, Zero Friction

CowryChain is an automated DeFi savings account on Base that leverages the **Initia Interwoven Stack** for the INITIATE Hackathon (Season 1). We completely bridge the gap between Cosmos liquidity and EVM yield.

We integrated Initia to solve the three biggest pain points in DeFi savings:

1. **Liquidity Fragmentation:** By integrating the native **Interwoven Bridge** (`InitiaBridge` component), Cosmos users can seamlessly deposit or manual-send `INIT`, `USDC`, and `ETH` straight into Base yield vaults without ever leaving our app via `requestTxBlock` with `MsgSend`.
2. **Clunky Onboarding:** We use **InterwovenKit** (`InitiaWalletButton`) to offer social logins and native wallet connections. It instantly resolves on-chain **`.init` usernames** (`InitiaUsername`) to give users a recognizable human identity.
3. **Transaction Fatigue:** Thanks to Initia's **Auto-Sign (Session Keys)**, users can approve, deposit, and compound their savings with a single click—no more endless wallet pop-ups.

*CowryChain delivers Base's optimized yield with Initia's unmatched cross-chain user experience.*

### Chain Deployment

- **Chain ID:** `initiation-2` (testnet) — set via `NEXT_PUBLIC_INITIA_CHAIN_ID`
- **Submission file:** `.initia/submission.json`

### Provider Setup

`InterwovenKitProvider` wraps the entire app in `app/providers.tsx`:

```tsx
<InterwovenKitProvider defaultChainId={INITIA_CHAIN_ID}>
  {children}
</InterwovenKitProvider>
```

Styles are injected via `injectStyles(interwovenKitStyles)` in a `useEffect` as required.

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

| Route           | Description                                                      |
| --------------- | ---------------------------------------------------------------- |
| `/`             | Home — Landing page (unauthenticated) or Dashboard (connected)   |
| `/vaults`       | Browse and filter all available YO Protocol vaults               |
| `/save`         | Set savings goals and execute Token Zapping                      |
| `/achievements` | View unlocked Gamification badges based on your verified Balance |
| `/coming-soon`  | Detailed Roadmap exposing futuristic Protocol features           |
| `/portfolio`    | Full portfolio overview with positions and history               |
| `/settings`     | User settings                                                    |

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

| Vault   | Network                | Asset | Type                     |
| ------- | ---------------------- | ----- | ------------------------ |
| `yoUSD` | Base Mainnet / Sepolia | USDC  | Stablecoin, Conservative |
| `yoETH` | Base Mainnet / Sepolia | WETH  | ETH, Moderate            |

> [!IMPORTANT]
> Token addresses are automatically selected based on `NEXT_PUBLIC_IS_TESTNET`:
>
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
