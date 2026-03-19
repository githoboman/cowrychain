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
  amountIn: string
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
  
  // Attempt to fetch real calldata from 0x Base API
  let txTo = undefined;
  let txData = undefined;
  let txValue = undefined;
  
  try {
    const outputTokenAddress = outputAssetSymbol === "USDC" 
      ? "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" 
      : "0x4200000000000000000000000000000000000006";
      
    // Structurally correct fetch (may 403 without API key, gracefully fallback if so)
    const qs = new URLSearchParams({
      sellToken: inputToken.address,
      buyToken: outputTokenAddress,
      sellAmount: inputParsed.toString(),
    }).toString();
    
    // Using base.api.0x.org as the routing endpoint
    const res = await fetch(`https://base.api.0x.org/swap/v1/quote?${qs}`);
    if (res.ok) {
      const data = await res.json();
      txTo = data.to;
      txData = data.data;
      txValue = BigInt(data.value || 0);
    }
  } catch (error) {
    console.log("0x API fallback triggered (missing key/rate limit). Simulated calldata generated.");
    txTo = "0xdef1c0ded9bec7f1a1670819833240f027b25eff"; // 0x Exchange Proxy
    txData = "0x"; 
    txValue = BigInt(0);
  }

  return {
    inputAmount: inputParsed,
    expectedOutputAmount: outputParsed,
    slippagePercent: slippage,
    priceImpact: slippage * 0.8,
    estimatedGasUSD: 0.45,
    route: [inputToken.symbol, outputAssetSymbol],
    txTo,
    txData,
    txValue
  };
}
