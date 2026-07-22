import type { en } from "./en";

/**
 * Spanish (Rioplatense) dictionary.
 *
 * Voseo is used throughout ("empezá", "conectá", "tu wallet") because the primary
 * audience is Uruguay/Argentina, where tuteo reads as foreign or machine-translated.
 *
 * DeFi vocabulary is deliberately left in English — yield, wallet, vault, staking,
 * gasless, APY, TVL, shares — because that is how Spanish-speaking crypto users
 * actually read and speak these terms. Translating "vault" to "bóveda" would read
 * as amateurish to this audience.
 *
 * Typed as Record<keyof typeof en, string> so a missing key is a compile error.
 */
export const es: Record<keyof typeof en, string> = {
  // ── Navegación ──────────────────────────────────────────────────────────────
  "nav.dashboard": "Inicio",
  "nav.vaults": "Vaults",
  "nav.save": "Ahorrar",
  "nav.achievements": "Logros",
  "nav.roadmap": "Roadmap",
  "nav.portfolio": "Portafolio",
  "nav.back": "Volver",
  "nav.disconnectWallet": "Desconectar wallet",
  "nav.language": "Idioma",

  // ── Landing: hero ───────────────────────────────────────────────────────────
  "landing.badge": "Ahorro de nueva generación en Base",
  "landing.headline.line1": "La forma más inteligente",
  "landing.headline.line2": "de",
  "landing.headline.highlight": "ahorrar onchain.",
  "landing.subheadline":
    "Ganá yield de nivel institucional con tus USDC y ETH, sin complicaciones. Non-custodial, permissionless y construido sobre el futuro de las finanzas.",
  "landing.cta.startSaving": "Empezá a ahorrar",
  "landing.cta.connectWallet": "Conectar wallet",
  "landing.savers": "Sumate a {amount}+ ahorristas",

  // ── Landing: tarjeta hero ───────────────────────────────────────────────────
  "landing.card.yourSavings": "Tus ahorros",
  "landing.card.earningRate": "Tasa de ganancia",
  "landing.card.variableApy": "APY variable",
  "landing.card.dailyProjection": "Proyección diaria",
  "landing.card.activeSystems": "Sistemas activos",
  "landing.card.vaultsCount": "{count} vaults",
  "landing.card.autoCompounding": "Auto-compounding",
  "landing.card.everyBlock": "En cada bloque",

  // ── Landing: características ────────────────────────────────────────────────
  "landing.features.title": "Diseñado para el futuro del ahorro.",
  "landing.features.subtitle":
    "DeFi no tiene por qué ser difícil. Combinamos seguridad, yield y simplicidad en una sola plataforma.",
  "landing.features.gasless.title": "100% gasless. Siempre.",
  "landing.features.gasless.titleSelfPay": "Construido en Base. Centavos de gas.",
  "landing.features.gasless.descSelfPay":
    "Base liquida por una fracción de centavo. Conectá cualquier wallet y mantené tus costos casi en cero.",
  "landing.features.gasless.desc":
    "Firmá transacciones con Coinbase Smart Wallet. Nosotros pagamos el gas. Sin costos ocultos ni fricción.",
  "landing.features.gamified.title": "Ahorro gamificado",
  "landing.features.gamified.desc":
    "Desbloqueá badges onchain según tu balance verificado de colateral. Demostrá tus Diamond Hands.",
  "landing.features.zapping.title": "Auto-zapping",
  "landing.features.zapping.desc":
    "Convertí cbBTC, DEGEN o cualquier token en shares del vault con un solo clic, vía 0x Router.",

  // ── Landing: showcase de ingeniería ─────────────────────────────────────────
  "landing.journey.title": "Nuestro recorrido de ingeniería",
  "landing.journey.subtitle":
    "Dedicamos miles de horas a perfeccionar cada píxel y cada línea de código para ofrecerte la experiencia de ahorro más sólida en Base.",
  "landing.journey.version": "v1.0.0 Estable",
  "landing.journey.gamification.tag": "Logros",
  "landing.journey.gamification.title": "Gamificación en vivo",
  "landing.journey.gamification.desc":
    "Scanners en tiempo real con Wagmi otorgan badges criptográficos animados apenas tu colateral supera cada hito.",
  "landing.journey.gas.tag": "Paymasters",
  "landing.journey.gas.title": "Motor zero-gas",
  "landing.journey.gas.desc":
    "Las capabilities de EIP-5792 eliminan por completo la fricción de las transacciones para usuarios de Smart Wallet.",
  "landing.journey.zapping.tag": "Routing",
  "landing.journey.zapping.title": "Zapping cross-chain",
  "landing.journey.zapping.desc":
    "La integración con la API de 0x rutea automáticamente cualquier token depositado hacia shares nativas de los vaults de YO Protocol.",
  "landing.journey.telemetry.tag": "Analytics",
  "landing.journey.telemetry.title": "Telemetría de red",
  "landing.journey.telemetry.desc":
    "Un Gas Tracker siempre activo monitorea la congestión de la red Base bloque a bloque.",

  // ── Landing: CTA final ──────────────────────────────────────────────────────
  "landing.finalCta.title": "¿Listo para empezar a ganar?",
  "landing.finalCta.subtitle":
    "Conectá tu wallet y empezá tu camino de ahorro onchain en menos de 60 segundos.",

  // ── Dashboard ───────────────────────────────────────────────────────────────
  "dashboard.vaults.title": "Vaults de ahorro",
  "dashboard.vaults.subtitle": "Elegí un vault para empezar a ganar yield en Base.",
  "dashboard.liveYield": "Yield en vivo",
  "dashboard.activityHistory": "Historial de actividad",
  "dashboard.hero.onchainSavings": "Ahorro onchain",
  "dashboard.stats.protocolTvl": "TVL del protocolo",
  "dashboard.stats.network": "Red",
  "dashboard.stats.settlement": "Liquidación",
  "dashboard.stats.custody": "Custodia",
  "dashboard.stats.onchain": "Onchain",
  "dashboard.stats.nonCustodial": "Non-custodial",

  // ── Tarjeta de vault ────────────────────────────────────────────────────────
  "vault.baseAsset": "Activo base",
  "vault.tvl": "TVL del vault",
  "vault.currentBalance": "Balance actual",
  "vault.yourShares": "Tus shares",
  "vault.deposit": "Depositar",
  "vault.redeem": "Retirar",

  // ── Modal de depósito ───────────────────────────────────────────────────────
  "deposit.title": "Depositar",
  "deposit.amount": "Monto",
  "deposit.balance": "Balance",
  "deposit.max": "MÁX",
  "deposit.youReceive": "Recibís (shares)",
  "deposit.zapRoute": "Ruta del zap",
  "deposit.zapRate": "Tasa del zap",
  "deposit.slippage": "Slippage: {percent}%",
  "deposit.indicativePricing":
    "El monto mostrado es indicativo. El importe final lo define el router al ejecutar.",
  "deposit.zapUnavailable": "Depositá {asset} directamente para continuar.",
  "deposit.step.ready": "Listo",
  "deposit.step.swapping": "Cambiando {from} por {to}...",
  "deposit.step.approving": "Aprobando {asset}...",
  "deposit.step.depositing": "Guardando en el vault...",
  "deposit.step.success": "¡Guardado con éxito!",
  "deposit.step.error": "La transacción falló",
  "deposit.confirm": "Confirmar depósito",
  "deposit.viewOnExplorer": "Ver en el explorer",
  "deposit.saveTo": "Ahorrar en {vault}",
  "deposit.poweredBy": "Con la tecnología de YO Protocol en Base",
  "deposit.success.title": "¡Guardado! 🎉",
  "deposit.success.body": "Tus fondos ya están generando yield en el vault {vault}.",
  "deposit.viewOnBaseScan": "Ver en BaseScan →",
  "deposit.done": "Listo",
  "deposit.availableBalance": "Balance disponible",
  "deposit.network": "Red",
  "deposit.networkFee": "Base • Costo est. ~US$ 0,01",
  "deposit.processing": "Procesando...",
  "deposit.approved": "Aprobado ✓",
  "deposit.info.zap":
    "Tus {token} se convertirán automáticamente en {asset} y se depositarán en el vault de YO Protocol.",
  "deposit.info.standard":
    "Los fondos se depositan en el vault de YO Protocol en Base. El yield se acumula en cada bloque.",
  "deposit.cta.zap": "Zap y ahorrar {token}",
  "deposit.cta.save": "Ahorrar US$ {amount}",

  // ── Modal de retiro ─────────────────────────────────────────────────────────
  "redeem.title": "Retirar",
  "redeem.subtitle": "Retirá tus shares del vault",
  "redeem.type": "Tipo de retiro",
  "redeem.youReceive": "Recibís",
  "redeem.yourShares": "Tus shares",
  "redeem.initiated": "¡Retiro iniciado!",
  "redeem.confirm": "Confirmar retiro",
  "redeem.step.ready": "Listo",
  "redeem.step.approving": "Aprobando shares...",
  "redeem.step.redeeming": "Procesando el retiro...",
  "redeem.step.success": "¡Retiro iniciado!",
  "redeem.step.error": "La transacción falló",
  "redeem.instantDone": "Retiro instantáneo completado.",
  "redeem.queued": "Tu retiro está en cola. Los fondos llegarán en breve.",
  "redeem.withdraw": "Retirar",

  // ── Tarjeta de vault ────────────────────────────────────────────────────────
  "vault.description": "Vault de YO Protocol",
  "vault.tagline": "Yield optimizado",
  "vault.startSaving": "Empezá a ahorrar para hacer crecer tu fortuna.",
  "vault.goalCustom": "Meta: personalizada",
  "vault.variableApy": "APY variable",
  "vault.yielding": "Generando",
  "vault.connectToView": "Conectá tu wallet para ver tu posición",
  "vault.saveNow": "Ahorrar ahora",

  // ── Metas de ahorro ─────────────────────────────────────────────────────────
  "goals.title": "Metas de ahorro",
  "goals.subtitle": "Seguí tu progreso.",
  "goals.createNew": "Crear nueva meta",
  "goals.startSaving": "Empezá a ahorrar para hacer crecer tu fortuna.",
  "goals.noDeadline": "Sin fecha límite",
  "goals.name": "Nombre de la meta",
  "goals.target": "Monto objetivo",
  "goals.duration": "Duración",
  "goals.add": "Agregar meta",
  "goals.remove": "Eliminar",
  "goals.goalName": "Nombre de la meta",
  "goals.namePlaceholder": "ej. Auto nuevo, Ahorros...",
  "goals.targetAmount": "Monto objetivo (US$)",
  "goals.durationOptional": "Duración (opcional)",
  "goals.duration.1m": "1 mes",
  "goals.duration.3m": "3 meses",
  "goals.duration.6m": "6 meses",
  "goals.duration.1y": "1 año",
  "goals.createGoal": "Crear meta",
  "goals.deleteGoal": "Eliminar meta",
  "goals.reached": "{percent}% alcanzado",
  "goals.depositFunds": "+ Depositar fondos",

  // ── Compartido / estado ─────────────────────────────────────────────────────
  "common.loading": "Cargando...",
  "common.scanning": "Escaneando...",
  "common.cancel": "Cancelar",
  "common.close": "Cerrar",
  "common.confirm": "Confirmar",
  "common.connectWallet": "Conectar wallet",
  "common.connectToView": "Conectá tu wallet para ver esta página.",
  "common.tagline": "El futuro del ahorro onchain.",

  // ── Página de portafolio ────────────────────────────────────────────────────
  "portfolio.title": "Portafolio",
  "portfolio.subtitle": "Seguí tus ahorros en todos los vaults de YO",
  "portfolio.connectTitle": "Conectate para ver tu portafolio",
  "portfolio.connectBody": "Conectá tu wallet para ver tu portafolio de ahorros DeFi",
  "portfolio.activePositions": "Posiciones activas",
  "portfolio.shares": "Shares",
  "portfolio.value": "Valor",

  // ── Página de ahorro ────────────────────────────────────────────────────────
  "save.subtitle": "Definí metas, elegí vaults y mirá crecer tu dinero",
  "save.yieldCalculator": "Calculadora de yield",

  // ── Página de logros ────────────────────────────────────────────────────────
  "achievements.your": "Tus",
  "achievements.title": "Logros",
  "achievements.connectTitle": "Conectate para ver tus badges",
  "achievements.progress": "Progreso",

  // ── Página de ajustes ───────────────────────────────────────────────────────
  "settings.title": "Ajustes",

  // ── Página próximamente ─────────────────────────────────────────────────────
  "comingSoon.building": "Construyendo el",
  "comingSoon.futureOfYield": "futuro del yield",
  "comingSoon.earlyAccess": "¿Querés acceso anticipado?",

  // ── Calculadora de yield ────────────────────────────────────────────────────
  "calculator.title": "Proyección de yield",
  "calculator.subtitle": "Ganancias estimadas a lo largo del tiempo.",
  "calculator.totalEarnings": "Ganancias totales",

  // ── Historial de transacciones ──────────────────────────────────────────────
  "history.connectPrompt": "Conectá tu wallet para ver el historial de transacciones",

};
