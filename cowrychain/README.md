<!--
  CowryChain README — Bilingual (English / Español)
  Jump to Spanish version: search for "🇺🇾 Versión en Español"
-->

# 🐚 CowryChain

> **[English](#-english)** · **[Español](#-versión-en-español)**

> Onchain savings, reimagined. Save in USDC or ETH, earn optimized yield powered by YO Protocol on Base.

---

## 🇬🇧 English

CowryChain is designed to solve several major friction points in Decentralized Finance (DeFi) today:

1. **The Friction of Gas Fees:** New users are deterred because they must acquire and hold native tokens (ETH) just to make a deposit. CowryChain solves this via **EIP-5792 Paymasters**, allowing 100% gasless transactions sponsored by the protocol.
2. **Complexity of Yield Farming:** Earning high yield requires manually bridging assets, finding liquidity pools, and compounding rewards. CowryChain uses the **YO Protocol SDK** to auto-route funds to the best strategies and auto-compounds yield effortlessly every block.
3. **Asset Fragmentation:** Users often hold volatile tokens (cbBTC, DEGEN) and can't save them directly. CowryChain solves this with **0x API Zapping**, instantly swapping any asset into a yield-bearing position in one click.
4. **Poor User Engagement:** Traditional savings accounts are boring, lifeless dashboards. CowryChain introduces **Live Gamification**, automatically unlocking visual cryptographic badges as users grow their active collateral balance on-chain.

### ✨ Premium DeFi Features

- ⛽ **100% Gasless (EIP-5792)** — Approvals and deposits are fully sponsored via Coinbase Smart Wallet Paymasters.
- ⚡ **Auto-Zapping (0x API)** — Instantly swap any token (cbBTC, DEGEN, AERO) directly into Vault shares in one click.
- 🏅 **Gamified Achievements** — Unlock dynamic UI badges verified by your active on-chain collateral balances.
- ⛽ **Live Gas Tracking** — A real-time widget monitoring Base network congestion.
- 💵 **Dollar Stash (yoUSD)** — Deposit USDC and earn optimized stable yield natively.
- ⟠ **Ether Stash (yoETH)** — Deposit ETH and earn risk-adjusted yield.
- 📊 **Real-time Portfolio Dashboard** — Live balance, APY, and yield tracking.
- 🌍 **Bilingual (EN / ES)** — Full English and Rioplatense Spanish support with an in-app toggle.
- 🔒 **Non-custodial** — Your keys, your funds. Smart contracts only.
- 🌙 **Dark/Light Mode** — Full theme support via `next-themes`.
- 📱 **Responsive** — Mobile-first design.

### 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 15](https://nextjs.org) (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + custom CSS variables |
| **Animations** | Framer Motion |
| **Web3 / Wallet** | [Wagmi v2](https://wagmi.sh) + [RainbowKit](https://www.rainbowkit.com) |
| **Yield Protocol** | [@yo-protocol/react](https://yo.xyz) SDK |
| **Swap Routing** | [0x Swap API v2](https://0x.org) (server-side relay) |
| **Chain Abstraction** | [viem](https://viem.sh) |
| **Data Fetching** | [@tanstack/react-query](https://tanstack.com/query) |
| **Icons** | [Lucide React](https://lucide.dev) |
| **Network** | Base Mainnet / Base Sepolia (testnet) |

### 🚀 Getting Started

#### Prerequisites

- Node.js 18+ and npm
- A [WalletConnect Cloud](https://cloud.walletconnect.com) Project ID (free)

#### 1. Clone the repository

```bash
git clone https://github.com/your-username/cowrychain.git
cd cowrychain
```

#### 2. Install dependencies

```bash
npm install
```

#### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Then edit `.env.local`:

```bash
# Required: Get yours free at https://cloud.walletconnect.com
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# "true" = Base Sepolia testnet, "false" = Base mainnet
NEXT_PUBLIC_IS_TESTNET=false

# Block explorer URL for transaction links
# Mainnet: https://basescan.org  |  Testnet: https://sepolia.basescan.org
NEXT_PUBLIC_EXPLORER_URL=https://basescan.org

# Optional: gas sponsorship (EIP-5792). When set, the protocol pays user gas.
# Leave empty and users pay their own (fractional-cent) Base gas.
# Get one at https://portal.cdp.coinbase.com
NEXT_PUBLIC_PAYMASTER_URL=

# Optional (SECRET, server-side only): enables 0x token zapping.
# Held by /api/zap-quote and never sent to the browser.
# Get a free key at https://dashboard.0x.org
ZAP_0X_API_KEY=
```

> [!NOTE]
> The WalletConnect Project ID is required for the wallet modal to work in production.
> `NEXT_PUBLIC_PAYMASTER_URL` and `ZAP_0X_API_KEY` are optional — the app degrades gracefully without them (users pay their own gas; the zap UI shows "routing unavailable" and direct deposits still work).

#### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 🌐 Pages & Navigation

| Route | Description |
|---|---|
| `/` | Home — Landing page (unauthenticated) or Dashboard (connected) |
| `/vaults` | Browse and filter all available YO Protocol vaults |
| `/save` | Set savings goals and execute token zapping |
| `/achievements` | View unlocked gamification badges based on your verified balance |
| `/coming-soon` | Detailed roadmap of upcoming protocol features |
| `/portfolio` | Full portfolio overview with positions and history |
| `/settings` | User settings |

### 🔐 How Vaults Work

CowryChain uses **YO Protocol vaults** — ERC-4626-compatible smart contracts deployed on Base that automatically route deposited assets to the highest-yielding DeFi strategies.

**Deposit flow**
1. User enters an amount and clicks **Save Now**.
2. App requests ERC-20 approval for the vault to spend your tokens.
3. Once approved, the deposit transaction is submitted.
4. Shares (yoUSD or yoETH) are minted representing your position.
5. Yield accrues every block; your share value increases over time.

**Withdraw flow**
1. User enters a share amount and clicks **Withdraw**.
2. A redeem transaction is submitted.
3. Depending on vault liquidity: **Instant** (assets returned immediately) or **Queued** (returned shortly after).

**Token addresses** are selected automatically based on `NEXT_PUBLIC_IS_TESTNET`:
- USDC Mainnet: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- USDC Sepolia: `0x036CbD53842c5426634e7929541eC2318f3dCF7e`
- WETH (both): `0x4200000000000000000000000000000000000006`

### 🧪 Testing on Testnet

1. Set `NEXT_PUBLIC_IS_TESTNET=true` in `.env.local`.
2. Set `NEXT_PUBLIC_EXPLORER_URL=https://sepolia.basescan.org`.
3. Get free Sepolia ETH from the Base Sepolia Faucet.
4. Get test USDC from the Circle Faucet.
5. Connect your wallet and start saving!

### 🏗 Build & Deployment

```bash
npm run build
npm run start
```

**Vercel (recommended):** push to GitHub, import into Vercel, add the environment variables in the dashboard, and deploy. The app is a standard Next.js 15 application and runs on any Node.js host (Railway, Render, Fly.io, AWS, etc.).

### 🔧 Available Scripts

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### 📄 License

MIT — see the `LICENSE` file for details.

### 🙏 Acknowledgements

YO Protocol · Base (Ethereum L2 by Coinbase) · RainbowKit · Wagmi · 0x · Framer Motion

---
---

## 🇺🇾 Versión en Español

> Ahorro onchain, reinventado. Ahorrá en USDC o ETH y ganá yield optimizado con la tecnología de YO Protocol en Base.

CowryChain está diseñado para resolver varios de los principales puntos de fricción en las finanzas descentralizadas (DeFi) de hoy:

1. **La fricción del gas:** los usuarios nuevos se frenan porque tienen que conseguir y mantener tokens nativos (ETH) solo para hacer un depósito. CowryChain lo resuelve con **Paymasters EIP-5792**, que permiten transacciones 100% gasless patrocinadas por el protocolo.
2. **La complejidad del yield farming:** ganar buen yield exige puentear activos a mano, buscar pools de liquidez y recomponer recompensas. CowryChain usa el **SDK de YO Protocol** para rutear los fondos automáticamente a las mejores estrategias y hacer auto-compounding del yield en cada bloque.
3. **La fragmentación de activos:** muchos usuarios tienen tokens volátiles (cbBTC, DEGEN) y no pueden ahorrarlos directamente. CowryChain lo resuelve con **zapping vía la API de 0x**, convirtiendo cualquier activo en una posición que genera yield con un solo clic.
4. **El bajo engagement:** las cuentas de ahorro tradicionales son dashboards aburridos y sin vida. CowryChain suma **gamificación en vivo**, desbloqueando badges criptográficos visuales a medida que crece tu balance de colateral onchain.

### ✨ Funcionalidades DeFi premium

- ⛽ **100% gasless (EIP-5792)** — las aprobaciones y los depósitos se patrocinan por completo vía Paymasters de Coinbase Smart Wallet.
- ⚡ **Auto-zapping (API de 0x)** — convertí al instante cualquier token (cbBTC, DEGEN, AERO) en shares del vault con un solo clic.
- 🏅 **Logros gamificados** — desbloqueá badges dinámicos verificados por tu balance de colateral onchain.
- ⛽ **Gas Tracking en vivo** — un widget en tiempo real que monitorea la congestión de la red Base.
- 💵 **Dollar Stash (yoUSD)** — depositá USDC y ganá yield estable optimizado de forma nativa.
- ⟠ **Ether Stash (yoETH)** — depositá ETH y ganá yield ajustado al riesgo.
- 📊 **Dashboard de portafolio en tiempo real** — balance, APY y yield en vivo.
- 🌍 **Bilingüe (EN / ES)** — soporte completo en inglés y español rioplatense con un toggle dentro de la app.
- 🔒 **Non-custodial** — tus llaves, tus fondos. Solo smart contracts.
- 🌙 **Modo oscuro/claro** — soporte completo de temas vía `next-themes`.
- 📱 **Responsive** — diseño mobile-first.

### 🛠 Stack técnico

| Capa | Tecnología |
|---|---|
| **Framework** | [Next.js 15](https://nextjs.org) (App Router) |
| **Lenguaje** | TypeScript |
| **Estilos** | Tailwind CSS + variables CSS propias |
| **Animaciones** | Framer Motion |
| **Web3 / Wallet** | [Wagmi v2](https://wagmi.sh) + [RainbowKit](https://www.rainbowkit.com) |
| **Protocolo de yield** | SDK de [@yo-protocol/react](https://yo.xyz) |
| **Ruteo de swaps** | [0x Swap API v2](https://0x.org) (relay del lado del servidor) |
| **Abstracción de chain** | [viem](https://viem.sh) |
| **Data fetching** | [@tanstack/react-query](https://tanstack.com/query) |
| **Íconos** | [Lucide React](https://lucide.dev) |
| **Red** | Base Mainnet / Base Sepolia (testnet) |

### 🚀 Cómo empezar

#### Requisitos previos

- Node.js 18+ y npm
- Un Project ID de [WalletConnect Cloud](https://cloud.walletconnect.com) (gratis)

#### 1. Cloná el repositorio

```bash
git clone https://github.com/your-username/cowrychain.git
cd cowrychain
```

#### 2. Instalá las dependencias

```bash
npm install
```

#### 3. Configurá las variables de entorno

```bash
cp .env.example .env.local
```

Después editá `.env.local`:

```bash
# Obligatorio: conseguí el tuyo gratis en https://cloud.walletconnect.com
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=tu_project_id_aca

# "true" = testnet Base Sepolia, "false" = Base mainnet
NEXT_PUBLIC_IS_TESTNET=false

# URL del explorer para los links de transacciones
# Mainnet: https://basescan.org  |  Testnet: https://sepolia.basescan.org
NEXT_PUBLIC_EXPLORER_URL=https://basescan.org

# Opcional: patrocinio de gas (EIP-5792). Si lo configurás, el protocolo paga el gas.
# Dejalo vacío y los usuarios pagan su propio gas de Base (fracciones de centavo).
# Conseguilo en https://portal.cdp.coinbase.com
NEXT_PUBLIC_PAYMASTER_URL=

# Opcional (SECRETO, solo del lado del servidor): habilita el zapping de 0x.
# Lo maneja /api/zap-quote y nunca se envía al navegador.
# Conseguí una key gratis en https://dashboard.0x.org
ZAP_0X_API_KEY=
```

> [!NOTE]
> El Project ID de WalletConnect es obligatorio para que el modal de wallet funcione en producción.
> `NEXT_PUBLIC_PAYMASTER_URL` y `ZAP_0X_API_KEY` son opcionales — la app degrada con elegancia si no están (los usuarios pagan su propio gas; el zapping muestra "ruteo no disponible" y los depósitos directos siguen funcionando).

#### 4. Levantá el servidor de desarrollo

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000) en tu navegador.

### 🌐 Páginas y navegación

| Ruta | Descripción |
|---|---|
| `/` | Home — landing (sin conectar) o Dashboard (conectado) |
| `/vaults` | Explorá y filtrá todos los vaults de YO Protocol disponibles |
| `/save` | Definí metas de ahorro y ejecutá el zapping de tokens |
| `/achievements` | Mirá los badges de gamificación desbloqueados según tu balance verificado |
| `/coming-soon` | Roadmap detallado de las próximas funcionalidades del protocolo |
| `/portfolio` | Vista completa del portafolio con posiciones e historial |
| `/settings` | Configuración del usuario |

### 🔐 Cómo funcionan los vaults

CowryChain usa **vaults de YO Protocol** — smart contracts compatibles con ERC-4626 desplegados en Base que rutean automáticamente los activos depositados hacia las estrategias DeFi de mayor rendimiento.

**Flujo de depósito**
1. El usuario ingresa un monto y hace clic en **Ahorrar ahora**.
2. La app pide la aprobación ERC-20 para que el vault pueda gastar tus tokens.
3. Una vez aprobado, se envía la transacción de depósito.
4. Se mintean shares (yoUSD o yoETH) que representan tu posición.
5. El yield se acumula en cada bloque; el valor de tus shares crece con el tiempo.

**Flujo de retiro**
1. El usuario ingresa una cantidad de shares y hace clic en **Retirar**.
2. Se envía una transacción de redención.
3. Según la liquidez del vault: **Instantáneo** (los activos vuelven de inmediato) o **En cola** (vuelven poco después).

Las **direcciones de tokens** se seleccionan automáticamente según `NEXT_PUBLIC_IS_TESTNET`:
- USDC Mainnet: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- USDC Sepolia: `0x036CbD53842c5426634e7929541eC2318f3dCF7e`
- WETH (ambas): `0x4200000000000000000000000000000000000006`

### 🧪 Pruebas en testnet

1. Poné `NEXT_PUBLIC_IS_TESTNET=true` en `.env.local`.
2. Poné `NEXT_PUBLIC_EXPLORER_URL=https://sepolia.basescan.org`.
3. Conseguí ETH de Sepolia gratis desde el faucet de Base Sepolia.
4. Conseguí USDC de prueba desde el faucet de Circle.
5. Conectá tu wallet y empezá a ahorrar.

### 🏗 Build y despliegue

```bash
npm run build
npm run start
```

**Vercel (recomendado):** subí el repo a GitHub, importalo en Vercel, cargá las variables de entorno en el dashboard y desplegá. La app es una aplicación estándar de Next.js 15 y corre en cualquier host con Node.js (Railway, Render, Fly.io, AWS, etc.).

### 🔧 Scripts disponibles

```bash
npm run dev      # Levanta el servidor de desarrollo (http://localhost:3000)
npm run build    # Compila para producción
npm run start    # Inicia el servidor de producción
npm run lint     # Corre ESLint
```

### 📄 Licencia

MIT — ver el archivo `LICENSE` para más detalles.

### 🙏 Agradecimientos

YO Protocol · Base (L2 de Ethereum por Coinbase) · RainbowKit · Wagmi · 0x · Framer Motion
