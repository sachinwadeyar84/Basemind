// ── DEX Screener — any token by name or contract address ──────────────────
export async function fetchDexScreener(query: string): Promise<string> {
  try {
    const isAddress = /0x[a-fA-F0-9]{40}/i.test(query);
    const addressMatch = query.match(/0x[a-fA-F0-9]{40}/i);
    const url = isAddress && addressMatch
      ? `https://api.dexscreener.com/latest/dex/tokens/${addressMatch[0]}`
      : `https://api.dexscreener.com/latest/dex/search/?q=${encodeURIComponent(query)}`;

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return "";
    const data = await res.json();
    const pairs: any[] = (data.pairs || []).slice(0, 3);
    if (!pairs.length) return "";

    const lines = pairs.map((p: any) => {
      const change24h = p.priceChange?.h24;
      const arrow = Number(change24h) >= 0 ? "▲" : "▼";
      const mcap = p.marketCap ? `$${Number(p.marketCap).toLocaleString()}` : "N/A";
      const liq = p.liquidity?.usd ? `$${Number(p.liquidity.usd).toLocaleString()}` : "N/A";
      const vol = p.volume?.h24 ? `$${Number(p.volume.h24).toLocaleString()}` : "N/A";
      const age = p.pairCreatedAt ? new Date(p.pairCreatedAt).toLocaleDateString() : "N/A";
      return (
        `${p.baseToken.name} (${p.baseToken.symbol.toUpperCase()}) on ${p.dexId} [${p.chainId}]\n` +
        `  Price: $${p.priceUsd} | 24h: ${arrow}${Math.abs(Number(change24h)).toFixed(2)}%\n` +
        `  Volume 24h: ${vol} | Liquidity: ${liq} | Market cap: ${mcap}\n` +
        `  Pair created: ${age} | Contract: ${p.baseToken.address}`
      );
    });

    return `\n\n[DEX SCREENER LIVE DATA]\n${lines.join("\n\n")}\n`;
  } catch {
    return "";
  }
}

// ── DeFiLlama — TVL, chain rankings, Base stats ────────────────────────────
export async function fetchDefiLlama(): Promise<string> {
  try {
    const res = await fetch("https://api.llama.fi/v2/chains", { cache: "no-store" });
    if (!res.ok) return "";
    const chains: any[] = await res.json();

    const sorted = chains.sort((a, b) => b.tvl - a.tvl);
    const top5 = sorted.slice(0, 5).map((c, i) =>
      `  ${i + 1}. ${c.name}: $${(c.tvl / 1e9).toFixed(2)}B`
    );
    const base = chains.find((c) => c.name === "Base");
    const baseTvl = base ? `$${(base.tvl / 1e9).toFixed(2)}B` : "N/A";
    const baseRank = base ? sorted.findIndex((c) => c.name === "Base") + 1 : "N/A";

    return (
      `\n\n[DEFILLLAMA LIVE DATA]\n` +
      `Base TVL: ${baseTvl} (ranked #${baseRank} across all chains)\n` +
      `Top 5 chains by TVL:\n${top5.join("\n")}\n`
    );
  } catch {
    return "";
  }
}

// ── Fear & Greed Index ─────────────────────────────────────────────────────
export async function fetchFearGreed(): Promise<string> {
  try {
    const res = await fetch("https://api.alternative.me/fng/?limit=3", { cache: "no-store" });
    if (!res.ok) return "";
    const data = await res.json();
    const [today, yesterday, twoDaysAgo] = data.data || [];
    if (!today) return "";

    const score = Number(today.value);
    const emoji =
      score <= 25 ? "😱 Extreme Fear" :
      score <= 45 ? "😟 Fear" :
      score <= 55 ? "😐 Neutral" :
      score <= 75 ? "😊 Greed" : "🤑 Extreme Greed";

    return (
      `\n\n[CRYPTO FEAR & GREED INDEX — Live]\n` +
      `Today: ${today.value}/100 — ${emoji}\n` +
      `Yesterday: ${yesterday?.value}/100 — ${yesterday?.value_classification}\n` +
      `2 days ago: ${twoDaysAgo?.value}/100 — ${twoDaysAgo?.value_classification}\n` +
      `(0 = Max Fear = buy signal for contrarians | 100 = Max Greed = caution)\n`
    );
  } catch {
    return "";
  }
}

// ── Gas Tracker ────────────────────────────────────────────────────────────
export async function fetchGasPrice(): Promise<string> {
  try {
    // Use ETH gas station v2 (no key)
    const res = await fetch("https://ethgas.watch/api/gas", { cache: "no-store" });
    if (!res.ok) throw new Error("gas api failed");
    const data = await res.json();
    return (
      `\n\n[LIVE ETH GAS PRICES]\n` +
      `🐢 Slow: ${data.slow?.gwei} gwei (~$${data.slow?.usd})\n` +
      `🚶 Normal: ${data.normal?.gwei} gwei (~$${data.normal?.usd})\n` +
      `🚀 Fast: ${data.fast?.gwei} gwei (~$${data.fast?.usd})\n` +
      `⚡ Base L2: ~$0.001 per transaction (99% cheaper than mainnet)\n`
    );
  } catch {
    try {
      // fallback: blocknative
      const res2 = await fetch("https://api.blocknative.com/gasprices/blockprices", { cache: "no-store" });
      if (!res2.ok) return "";
      const d = await res2.json();
      const est = d.blockPrices?.[0]?.estimatedPrices;
      if (!est) return "";
      return (
        `\n\n[LIVE ETH GAS PRICES]\n` +
        `Slow: ${est[3]?.price} gwei | Normal: ${est[2]?.price} gwei | Fast: ${est[0]?.price} gwei\n` +
        `Base L2: ~$0.001 per tx\n`
      );
    } catch {
      return "";
    }
  }
}

// ── Trending Tokens (CoinGecko) ────────────────────────────────────────────
export async function fetchTrending(): Promise<string> {
  try {
    const res = await fetch("https://api.coingecko.com/api/v3/search/trending", { cache: "no-store" });
    if (!res.ok) return "";
    const data = await res.json();

    const coins = (data.coins || []).slice(0, 7).map((c: any, i: number) => {
      const item = c.item;
      const change = item.data?.price_change_percentage_24h?.usd;
      const arrow = change >= 0 ? "▲" : "▼";
      const changeStr = change != null ? ` ${arrow}${Math.abs(change).toFixed(1)}%` : "";
      const price = item.data?.price ? ` — $${Number(item.data.price).toLocaleString(undefined, { maximumFractionDigits: 6 })}` : "";
      return `  ${i + 1}. ${item.name} (${item.symbol.toUpperCase()})${price}${changeStr}`;
    });

    const nfts = (data.nfts || []).slice(0, 3).map((n: any) =>
      `  • ${n.name} — floor: ${n.data?.floor_price || "N/A"} ${n.data?.floor_price_in_usd ? `($${Number(n.data.floor_price_in_usd).toFixed(0)})` : ""}`
    );

    return (
      `\n\n[TRENDING ON COINGECKO RIGHT NOW]\nTop coins:\n${coins.join("\n")}` +
      (nfts.length ? `\nTrending NFTs:\n${nfts.join("\n")}` : "") + "\n"
    );
  } catch {
    return "";
  }
}

// ── Crypto News (CryptoCompare — no key) ──────────────────────────────────
export async function fetchCryptoNews(keyword?: string): Promise<string> {
  try {
    const url = keyword
      ? `https://min-api.cryptocompare.com/data/v2/news/?lang=EN&categories=${encodeURIComponent(keyword)}&sortOrder=popular`
      : "https://min-api.cryptocompare.com/data/v2/news/?lang=EN&sortOrder=popular";

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return "";
    const data = await res.json();

    const articles = (data.Data || []).slice(0, 6).map((a: any) => {
      const source = a.source_info?.name || a.source || "Unknown";
      const ago = Math.round((Date.now() / 1000 - a.published_on) / 3600);
      const timeStr = ago < 1 ? "just now" : ago === 1 ? "1h ago" : `${ago}h ago`;
      return `  • [${source} · ${timeStr}] ${a.title}`;
    });

    return `\n\n[LATEST CRYPTO NEWS]\n${articles.join("\n")}\n`;
  } catch {
    return "";
  }
}
