import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  try {
    const res = await fetch(
      "https://api.geckoterminal.com/api/v2/networks/solana/trending_pools?page=1",
      { headers: { Accept: "application/json" } }
    );
    if (!res.ok) throw new Error("upstream error");

    const data = await res.json();
    const pools: any[] = data.data ?? [];

    const tokens = pools
      .map((pool) => {
        const a = pool.attributes ?? {};
        const name = (a.name ?? "").split(" / ")[0].trim();
        const price = parseFloat(a.base_token_price_usd ?? "0");
        const volume24h = parseFloat(a.volume_usd?.h24 ?? "0");
        const priceChange24h = parseFloat(a.price_change_percentage?.h24 ?? "0");
        return { name, price, volume24h, priceChange24h };
      })
      .filter((t) => t.price > 0 && t.name.length > 0)
      .slice(0, 3);

    return NextResponse.json({ tokens });
  } catch {
    return NextResponse.json({ tokens: [] }, { status: 500 });
  }
}
