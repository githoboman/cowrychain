/**
 * English source dictionary.
 *
 * This file is the single source of truth for translation keys: `TranslationKey`
 * is derived from it, so every key added here must also be added to `es.ts` or
 * the Spanish dictionary fails to typecheck.
 *
 * Convention: DeFi vocabulary that Spanish-speaking crypto users read in English
 * (yield, staking, gasless, wallet, vault, APY) stays untranslated in `es.ts`.
 */
export const en = {
  // ── Navigation ──────────────────────────────────────────────────────────────
  "nav.dashboard": "Dashboard",
  "nav.vaults": "Vaults",
  "nav.save": "Save",
  "nav.achievements": "Achievements",
  "nav.roadmap": "Roadmap",
  "nav.portfolio": "Portfolio",
  "nav.back": "Back",
  "nav.disconnectWallet": "Disconnect Wallet",
  "nav.language": "Language",
  "nav.language.hintTitle": "Change language",
  "nav.language.hintBody": "Prefer English? Tap here to switch anytime.",
  "nav.language.hintDismiss": "Got it",

  // ── Landing: hero ───────────────────────────────────────────────────────────
  "landing.badge": "Next-Gen Savings on Base",
  "landing.headline.line1": "The smartest way",
  "landing.headline.line2": "to",
  "landing.headline.highlight": "save onchain.",
  "landing.subheadline":
    "Earn institutional-grade yield on your USDC and ETH without the complexity. Non-custodial, permissionless, and built on the future of finance.",
  "landing.cta.startSaving": "Start Saving Now",
  "landing.cta.connectWallet": "Connect Wallet",
  "landing.savers": "Join {amount}+ savers",

  // ── Landing: hero card ──────────────────────────────────────────────────────
  "landing.card.yourSavings": "Your Savings",
  "landing.card.earningRate": "Earning Rate",
  "landing.card.variableApy": "Variable APY",
  "landing.card.dailyProjection": "Daily Projection",
  "landing.card.activeSystems": "Active Systems",
  "landing.card.vaultsCount": "{count} Vaults",
  "landing.card.autoCompounding": "Auto-Compounding",
  "landing.card.everyBlock": "Every block",

  // ── Landing: features ───────────────────────────────────────────────────────
  "landing.features.title": "Built for the future of savings.",
  "landing.features.subtitle":
    "DeFi doesn't have to be difficult. We've combined security, yield, and simplicity into one powerful platform.",
  "landing.features.gasless.title": "100% Gasless. Always.",
  "landing.features.gasless.titleSelfPay": "Built on Base. Pennies in gas.",
  "landing.features.gasless.descSelfPay":
    "Base settles for a fraction of a cent. Connect any wallet and keep your costs near zero.",
  "landing.features.gasless.desc":
    "Sign transactions with Coinbase Smart Wallet. We pay the gas. No hidden fees, no friction.",
  "landing.features.gamified.title": "Gamified Savings",
  "landing.features.gamified.desc":
    "Unlock premium on-chain badges based on your verified Collateral balance. Prove your Diamond Hands.",
  "landing.features.zapping.title": "Auto-Zapping",
  "landing.features.zapping.desc":
    "Swap cbBTC, DEGEN, or any Token seamlessly into Vault shares in one unified click via 0x Router.",

  // ── Landing: engineering showcase ───────────────────────────────────────────
  "landing.journey.title": "Our Engineering Journey",
  "landing.journey.subtitle":
    "We've spent thousands of hours perfecting every pixel and line of code to bring you the most robust savings experience on Base.",
  "landing.journey.version": "v1.0.0 Stable",
  "landing.journey.gamification.tag": "Achievements",
  "landing.journey.gamification.title": "Live Gamification",
  "landing.journey.gamification.desc":
    "Real-time Wagmi scanners award animated cryptographic badges the moment your Collateral crosses milestones.",
  "landing.journey.gas.tag": "Paymasters",
  "landing.journey.gas.title": "Zero-Gas Engine",
  "landing.journey.gas.desc":
    "Integrated EIP-5792 payload capabilities completely eliminate transaction friction for Smart Wallet users.",
  "landing.journey.zapping.tag": "Routing",
  "landing.journey.zapping.title": "Cross-Chain Zapping",
  "landing.journey.zapping.desc":
    "Live 0x API integration automatically routes any token deposited into native YO Protocol vault shares.",
  "landing.journey.telemetry.tag": "Analytics",
  "landing.journey.telemetry.title": "Network Telemetry",
  "landing.journey.telemetry.desc":
    "A globally active Gas Tracker monitors the Base network congestion heartbeat dynamically block-by-block.",

  // ── Landing: final CTA ──────────────────────────────────────────────────────
  "landing.finalCta.title": "Ready to start earning?",
  "landing.finalCta.subtitle":
    "Connect your wallet and start your onchain savings journey in less than 60 seconds.",

  // ── Dashboard ───────────────────────────────────────────────────────────────
  "dashboard.vaults.title": "Savings Vaults",
  "dashboard.vaults.subtitle": "Select a vault to start earning yield on Base.",
  "dashboard.liveYield": "Live Yield",
  "dashboard.activityHistory": "Activity History",
  "dashboard.hero.onchainSavings": "Onchain Savings",
  "dashboard.stats.protocolTvl": "Protocol TVL",
  "dashboard.stats.network": "Network",
  "dashboard.stats.settlement": "Settlement",
  "dashboard.stats.custody": "Custody",
  "dashboard.stats.onchain": "Onchain",
  "dashboard.stats.nonCustodial": "Non-custodial",

  // ── Vault card ──────────────────────────────────────────────────────────────
  "vault.baseAsset": "Base Asset",
  "vault.tvl": "Vault TVL",
  "vault.currentBalance": "Current Balance",
  "vault.yourShares": "Your Shares",
  "vault.deposit": "Deposit",
  "vault.redeem": "Redeem",

  // ── Deposit modal ───────────────────────────────────────────────────────────
  "deposit.title": "Deposit",
  "deposit.amount": "Amount",
  "deposit.balance": "Balance",
  "deposit.max": "MAX",
  "deposit.youReceive": "You receive (shares)",
  "deposit.zapRoute": "Zap Route",
  "deposit.zapRate": "Zap Rate",
  "deposit.slippage": "Slippage: {percent}%",
  "deposit.indicativePricing":
    "Output shown is indicative. Final amount is set by the router at execution.",
  "deposit.zapUnavailable": "Deposit {asset} directly to continue.",
  "deposit.step.ready": "Ready",
  "deposit.step.swapping": "Swapping {from} to {to}...",
  "deposit.step.approving": "Approving {asset}...",
  "deposit.step.depositing": "Saving to vault...",
  "deposit.step.success": "Saved successfully!",
  "deposit.step.error": "Transaction failed",
  "deposit.confirm": "Confirm Deposit",
  "deposit.viewOnExplorer": "View on explorer",
  "deposit.saveTo": "Save to {vault}",
  "deposit.poweredBy": "Powered by YO Protocol on Base",
  "deposit.success.title": "Saved! 🎉",
  "deposit.success.body": "Your funds are now earning yield in the {vault} vault.",
  "deposit.viewOnBaseScan": "View on BaseScan →",
  "deposit.done": "Done",
  "deposit.availableBalance": "Available balance",
  "deposit.network": "Network",
  "deposit.networkFee": "Base • Est. ~$0.01 fee",
  "deposit.processing": "Processing...",
  "deposit.approved": "Approved ✓",
  "deposit.info.zap":
    "Your {token} will be automatically zapped into {asset} and deposited into the YO Protocol vault.",
  "deposit.info.standard":
    "Funds are deposited into the YO Protocol vault on Base. Yield accrues every block.",
  "deposit.cta.zap": "Zap & Save {token}",
  "deposit.cta.save": "Save ${amount}",

  // ── Redeem modal ────────────────────────────────────────────────────────────
  "redeem.title": "Redeem",
  "redeem.subtitle": "Redeem your vault shares",
  "redeem.type": "Redemption type",
  "redeem.youReceive": "You receive",
  "redeem.yourShares": "Your shares",
  "redeem.initiated": "Withdrawal Initiated!",
  "redeem.confirm": "Confirm Redemption",
  "redeem.step.ready": "Ready",
  "redeem.step.approving": "Approving shares...",
  "redeem.step.redeeming": "Processing withdrawal...",
  "redeem.step.success": "Withdrawal initiated!",
  "redeem.step.error": "Transaction failed",
  "redeem.instantDone": "Instant redemption completed.",
  "redeem.queued": "Your redemption is queued. Funds will arrive shortly.",
  "redeem.withdraw": "Withdraw",

  // ── Vault card ──────────────────────────────────────────────────────────────
  "vault.description": "YO Protocol Vault",
  "vault.tagline": "Optimized Yield",
  "vault.startSaving": "Start saving to grow your fortune.",
  "vault.goalCustom": "Goal: Custom",
  "vault.variableApy": "Variable APY",
  "vault.yielding": "Yielding",
  "vault.connectToView": "Connect wallet to view position",
  "vault.saveNow": "Save Now",

  // ── Savings goals ───────────────────────────────────────────────────────────
  "goals.title": "Savings Goals",
  "goals.subtitle": "Track your progress.",
  "goals.createNew": "Create New Goal",
  "goals.startSaving": "Start saving to grow your fortune.",
  "goals.noDeadline": "No deadline",
  "goals.name": "Goal name",
  "goals.target": "Target amount",
  "goals.duration": "Duration",
  "goals.add": "Add Goal",
  "goals.remove": "Remove",
  "goals.goalName": "Goal Name",
  "goals.namePlaceholder": "e.g. New Car, Savings...",
  "goals.targetAmount": "Target Amount ($)",
  "goals.durationOptional": "Duration (Optional)",
  "goals.duration.1m": "1 Month",
  "goals.duration.3m": "3 Months",
  "goals.duration.6m": "6 Months",
  "goals.duration.1y": "1 Year",
  "goals.createGoal": "Create Goal",
  "goals.deleteGoal": "Delete Goal",
  "goals.reached": "{percent}% reached",
  "goals.depositFunds": "+ Deposit Funds",

  // ── Shared / status ─────────────────────────────────────────────────────────
  "common.loading": "Loading...",
  "common.scanning": "Scanning...",
  "common.cancel": "Cancel",
  "common.close": "Close",
  "common.confirm": "Confirm",
  "common.connectWallet": "Connect Wallet",
  "common.connectToView": "Connect your wallet to view this page.",
  "common.tagline": "The future of onchain savings.",

  // ── Portfolio page ──────────────────────────────────────────────────────────
  "portfolio.title": "Portfolio",
  "portfolio.subtitle": "Track your savings across all YO vaults",
  "portfolio.connectTitle": "Connect to View Portfolio",
  "portfolio.connectBody": "Connect your wallet to see your DeFi savings portfolio",
  "portfolio.activePositions": "Active Positions",
  "portfolio.shares": "Shares",
  "portfolio.value": "Value",

  // ── Save page ───────────────────────────────────────────────────────────────
  "save.subtitle": "Set goals, choose vaults, and watch your money grow",
  "save.yieldCalculator": "Yield Calculator",

  // ── Achievements page ───────────────────────────────────────────────────────
  "achievements.your": "Your",
  "achievements.title": "Achievements",
  "achievements.connectTitle": "Connect to view Badges",
  "achievements.progress": "Progress",

  // ── Settings page ───────────────────────────────────────────────────────────
  "settings.title": "Settings",

  // ── Coming soon page ────────────────────────────────────────────────────────
  "comingSoon.building": "Building the",
  "comingSoon.futureOfYield": "Future of Yield",
  "comingSoon.earlyAccess": "Want early access?",

  // ── Yield calculator ────────────────────────────────────────────────────────
  "calculator.title": "Yield Projection",
  "calculator.subtitle": "Estimated earnings over time.",
  "calculator.totalEarnings": "Total Earnings",

  // ── Transaction history ─────────────────────────────────────────────────────
  "history.connectPrompt": "Connect your wallet to see transaction history",

} as const;
