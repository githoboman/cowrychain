import { formatUnits, parseUnits } from "viem";

export interface TokenOption {
  symbol: string;
  name: string;
  address: `0x${string}`;
  decimals: number;
  icon: string;
}

// Common generic tokens that users might want to zap with on Base
export const ZAP_SUPPORTED_TOKENS: TokenOption[] = [
  {
    symbol: "USDC",
    name: "USD Coin",
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    decimals: 6,
    icon: "💵",
  },
  {
    symbol: "WETH",
    name: "Wrapped Ether",
    address: "0x4200000000000000000000000000000000000006",
    decimals: 18,
    icon: "⟠",
  },
  {
    symbol: "cbBTC",
    name: "Coinbase Wrapped BTC",
    address: "0xcbB7C0000aB88B473b1f5aFd9ef80c728037d111",
    decimals: 8,
    icon: "₿",
  },
  {
    symbol: "DEGEN",
    name: "Degen",
    address: "0x4ed4e862860bef6f7fa5175cf1daaf2e6da19fcb",
    decimals: 18,
    icon: "🎩",
  },
  {
    symbol: "AERO",
    name: "Aerodrome",
    address: "0x940181a94A35A4569E4529A3CDfB74e38FD98631",
    decimals: 18,
    icon: "✈️",
  }
];

// Simulated price feeds relative to USD for mock zapping UI
const MOCK_PRICES: Record<string, number> = {
  "USDC": 1.0,
  "yousdc": 1.05,
  "WETH": 3500.0,
  "yoeth": 3650.0,
  "cbBTC": 65000.0,
  "DEGEN": 0.012,
  "AERO": 1.15,
};

export interface ZapQuote {
  inputAmount: bigint;
  expectedOutputAmount: bigint;
  slippagePercent: number;
  priceImpact: number;
  estimatedGasUSD: number;
  route: string[];

  /** True only when the router returned real, broadcastable calldata. */
  isExecutable: boolean;
  /** True when the output figures come from MOCK_PRICES rather than a routed quote. */
  isIndicativePricing: boolean;
  /** Human-readable reason the quote is not executable, if any. */
  quoteError?: string;

  // Real transaction parameters for sending
  txTo?: `0x${string}`;
  txData?: `0x${string}`;
  txValue?: bigint;
}

/**
 * Simulates fetching a 1inch or 0x swap quote to route any asset into the vault asset
 */
export async function fetchZapQuote(
  inputToken: TokenOption,
  outputAssetSymbol: string, // "USDC" or "WETH"
  amountIn: string,
  taker?: `0x${string}` // connected wallet; required to get executable calldata
): Promise<ZapQuote | null> {
  if (!amountIn || Number(amountIn) <= 0) return null;

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600));

  const amountInNum = Number(amountIn);
  const priceIn = MOCK_PRICES[inputToken.symbol] || 1;
  const priceOut = MOCK_PRICES[outputAssetSymbol] || 1;
  
  // Calculate raw value
  const valueUSD = amountInNum * priceIn;
  let amountOutNum = valueUSD / priceOut;

  // Apply a fake dynamic slippage/fee based on token tier
  let slippage = 0.5;
  if (inputToken.symbol !== "USDC" && inputToken.symbol !== "WETH") {
    slippage = 1.2; // higher slippage for altcoins
    amountOutNum = amountOutNum * (1 - (slippage / 100));
  }

  // Parse based on output decimals (6 for USDC, 18 for WETH)
  const outDecimals = outputAssetSymbol === "USDC" ? 6 : 18;
  const outputParsed = parseUnits(amountOutNum.toFixed(outDecimals), outDecimals);
  const inputParsed = parseUnits(amountIn, inputToken.decimals);
  
  // Fetch real, executable calldata from our server-side 0x relay (/api/zap-quote),
  // which holds the secret API key. The figures above are indicative (MOCK_PRICES);
  // a zap may only be broadcast when the relay returns real calldata, so txTo/txData
  // stay undefined on every failure path. Never synthesise calldata: empty calldata
  // to a real router is a no-op that would be followed by a deposit of tokens the
  // user never received.
  let txTo: `0x${string}` | undefined = undefined;
  let txData: `0x${string}` | undefined = undefined;
  let txValue: bigint | undefined = undefined;
  let quoteError: string | undefined = undefined;
  // When 0x returns a real routed output, prefer it over the mock estimate.
  let routedOutput: bigint | undefined = undefined;

  if (!taker) {
    // No wallet connected yet — show the indicative preview but do not offer to send.
    quoteError = "Connect your wallet to get an executable swap quote.";
  } else {
    try {
      const outputTokenAddress = outputAssetSymbol === "USDC"
        ? "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
        : "0x4200000000000000000000000000000000000006";

      const qs = new URLSearchParams({
        sellToken: inputToken.address,
        buyToken: outputTokenAddress,
        sellAmount: inputParsed.toString(),
        taker,
      }).toString();

      const res = await fetch(`/api/zap-quote?${qs}`, { cache: "no-store" });
      const data = await res.json().catch(() => null);

      if (res.ok && data?.to && data?.data && data.data !== "0x") {
        txTo = data.to;
        txData = data.data;
        txValue = BigInt(data.value || 0);
        // Use the router's guaranteed-minimum output if present.
        if (data.minBuyAmount) routedOutput = BigInt(data.minBuyAmount);
      } else {
        quoteError = data?.message || `Swap routing failed (HTTP ${res.status}).`;
      }
    } catch {
      quoteError = "Could not reach the swap router.";
    }
  }

  const expectedOutputAmount = routedOutput ?? outputParsed;

  return {
    inputAmount: inputParsed,
    expectedOutputAmount,
    slippagePercent: slippage,
    priceImpact: slippage * 0.8,
    estimatedGasUSD: 0.45,
    route: [inputToken.symbol, outputAssetSymbol],
    isExecutable: Boolean(txTo && txData),
    // Pricing is only indicative when we could NOT get a routed output.
    isIndicativePricing: routedOutput === undefined,
    quoteError,
    txTo,
    txData,
    txValue
  };
}
