import { NextRequest, NextResponse } from "next/server";

/**
 * Server-side 0x swap-quote relay.
 *
 * The 0x API key is a SECRET and must never reach the browser, so this route holds
 * it (ZAP_0X_API_KEY, no NEXT_PUBLIC_ prefix) and proxies the request. The client
 * calls /api/zap-quote; only this function ever sees the key.
 *
 * Uses the 0x v2 "allowance-holder" endpoint, which returns a ready-to-send
 * transaction (`to` + `data` + `value`) for the given taker. The old
 * base.api.0x.org/swap/v1 host referenced elsewhere is deprecated.
 */

const ZERO_X_BASE = "https://api.0x.org/swap/allowance-holder/quote";
const BASE_CHAIN_ID = "8453";

export async function GET(req: NextRequest) {
  const apiKey = process.env.ZAP_0X_API_KEY?.trim();

  if (!apiKey) {
    // Distinct, machine-readable reason so the client can show a helpful message
    // rather than a generic failure — and so this is obvious in the demo setup.
    return NextResponse.json(
      { error: "unconfigured", message: "Swap routing is not configured (missing 0x API key)." },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(req.url);
  const sellToken = searchParams.get("sellToken");
  const buyToken = searchParams.get("buyToken");
  const sellAmount = searchParams.get("sellAmount");
  const taker = searchParams.get("taker");

  if (!sellToken || !buyToken || !sellAmount || !taker) {
    return NextResponse.json(
      { error: "bad_request", message: "sellToken, buyToken, sellAmount and taker are required." },
      { status: 400 }
    );
  }

  const upstream = new URL(ZERO_X_BASE);
  upstream.searchParams.set("chainId", BASE_CHAIN_ID);
  upstream.searchParams.set("sellToken", sellToken);
  upstream.searchParams.set("buyToken", buyToken);
  upstream.searchParams.set("sellAmount", sellAmount);
  upstream.searchParams.set("taker", taker);

  try {
    const res = await fetch(upstream.toString(), {
      headers: {
        "0x-api-key": apiKey,
        "0x-version": "v2",
      },
      // Quotes are per-request; never cache a routed swap.
      cache: "no-store",
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return NextResponse.json(
        {
          error: "upstream_error",
          message: data?.reason || data?.message || `0x returned HTTP ${res.status}.`,
        },
        { status: res.status }
      );
    }

    // 0x v2 nests the executable tx under `transaction`.
    const tx = data?.transaction;
    if (!tx?.to || !tx?.data || tx.data === "0x") {
      return NextResponse.json(
        { error: "no_route", message: "No executable swap route was returned for this pair." },
        { status: 422 }
      );
    }

    return NextResponse.json({
      to: tx.to as `0x${string}`,
      data: tx.data as `0x${string}`,
      value: tx.value ?? "0",
      buyAmount: data.buyAmount ?? null,
      minBuyAmount: data.minBuyAmount ?? null,
    });
  } catch {
    return NextResponse.json(
      { error: "network_error", message: "Could not reach the swap router." },
      { status: 502 }
    );
  }
}
