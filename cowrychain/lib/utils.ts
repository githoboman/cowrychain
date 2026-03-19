import { formatUnits, parseUnits } from "viem";

export function formatAmount(
  amount: bigint | undefined,
  decimals: number = 6,
  displayDecimals: number = 2
): string {
  if (amount === undefined || amount === null) return "0.00";
  const formatted = formatUnits(amount, decimals);
  const num = parseFloat(formatted);
  if (isNaN(num)) return "0.00";
  return num.toLocaleString("en-US", {
    minimumFractionDigits: displayDecimals,
    maximumFractionDigits: displayDecimals,
  });
}

export function formatCompactAmount(
  amount: bigint | undefined,
  decimals: number = 6
): string {
  if (amount === undefined || amount === null) return "0.0";
  const formatted = formatUnits(amount, decimals);
  const num = parseFloat(formatted);
  if (isNaN(num)) return "0.0";
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(num);
}

export function parseAmount(amount: string, decimals: number = 6): bigint {
  try {
    if (!amount || amount === "") return 0n;
    return parseUnits(amount, decimals);
  } catch {
    return 0n;
  }
}

export function formatAPY(apy: number | undefined): string {
  if (apy === undefined || apy === null || isNaN(apy)) return "—";
  return `${(apy * 100).toFixed(2)}%`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function shortenAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function cn(...classes: (string | undefined | null | boolean)[]): string {
  return classes.filter(Boolean).join(" ");
}
