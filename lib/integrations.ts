// ── Full Token Analysis — DEX Screener + GoPlus Security + Score ───────────
export async function fetchFullTokenAnalysis(address: string): Promise<string> {
  try {
    const dexUrl = `https://api.dexscreener.com/latest/dex/tokens/${address}`;
    const dexRes = await fetch(dexUrl, { cache: "no-store" });
    const dexData = dexRes.ok ? await dexRes.json() : { pairs: [] };
    const pairs: any[] = (dexData.pairs || [])
      .filter((p: any) => p.chainId === "solana")
      .sort((a: any, b: any) => (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0))
      .slice(0, 1);
    const top = pairs[0];

    // GoPlus Solana security check
    const gpUrl = `https://api.gopluslabs.io/api/v1/token_security/solana?contract_addresses=${address}`;
    const gpRes = await fetch(gpUrl, { cache: "no-store" });
    const gpData = gpRes.ok ? await gpRes.json() : {};
    const sec = gpData.result?.[address] ?? gpData.result?.[address.toLowerCase()];

    // ── DEX section ────────────────────────────────────────────────────────
    let dexSection = "";
    if (top) {
      const change24h = top.priceChange?.h24 ?? 0;
      const arrow = Number(change24h) >= 0 ? "▲" : "▼";
      const mcap = top.marketCap ? `$${Number(top.marketCap).toLocaleString()}` : "N/A";
      const liq  = top.liquidity?.usd ? `$${Number(top.liquidity.usd).toLocaleString()}` : "N/A";
      const vol  = top.volume?.h24 ? `$${Number(top.volume.h24).toLocaleString()}` : "N/A";
      const age  = top.pairCreatedAt ? new Date(top.pairCreatedAt).toLocaleDateString() : "N/A";
      const twitter = top.info?.socials?.find((s: any) => s.type === "twitter")?.url ?? "";
      const website = top.info?.websites?.[0]?.url ?? "";
      const dexLink = `https://dexscreener.com/solana/${top.baseToken.address}`;

      dexSection =
        `Token: ${top.baseToken.name} (${top.baseToken.symbol.toUpperCase()}) on Solana\n` +
        `Price: $${top.priceUsd} | 24h: ${arrow}${Math.abs(Number(change24h)).toFixed(2)}%\n` +
        `Market Cap: ${mcap} | Liquidity: ${liq} | Volume 24h: ${vol}\n` +
        `Pair created: ${age} | DEX: ${top.dexId}\n` +
        (twitter ? `Twitter/X: ${twitter}\n` : "") +
        (website ? `Website: ${website}\n` : "") +
        `DEX Screener: ${dexLink}\n`;
    }

    // ── Security section — Solana-specific fields ──────────────────────────
    let secSection = "";
    if (sec) {
      const mintAuth   = !!sec.mint_authority;
      const freezeAuth = !!sec.freeze_authority;
      const holders    = parseInt(sec.holder_count || "0");
      const liqLocked  = (sec.lp_holders || []).some((lp: any) => lp.is_locked === 1);
      const topHolder  = parseFloat(sec.top10_holder_rate || "0") * 100;

      let score = 50;
      if (!mintAuth)   score += 20; else score -= 20;
      if (!freezeAuth) score += 15; else score -= 15;
      if (holders > 1000)      score += 15;
      else if (holders > 500)  score += 10;
      else if (holders > 100)  score += 5;
      if (liqLocked)   score += 15;
      if (topHolder > 0) {
        if (topHolder < 20) score += 5;
        else if (topHolder > 50) score -= 15;
      }
      score = Math.max(0, Math.min(100, score));

      const label = score >= 80 ? "Low Risk ✅" : score >= 60 ? "Moderate ⚠️" : score >= 40 ? "Caution 🔶" : "High Risk 🚨";

      secSection =
        `\nSecurity Analysis (GoPlus — Solana):\n` +
        `${!mintAuth ? "✅" : "🚨"} Mint authority: ${mintAuth ? "ACTIVE — supply can increase" : "Disabled (safe)"}\n` +
        `${!freezeAuth ? "✅" : "⚠️"} Freeze authority: ${freezeAuth ? "ACTIVE — accounts can be frozen" : "Disabled (safe)"}\n` +
        `${holders > 100 ? "✅" : "⚠️"} Holders: ${holders.toLocaleString()}\n` +
        `${liqLocked ? "✅" : "⚠️"} Liquidity locked: ${liqLocked ? "Yes" : "No/Unknown"}\n` +
        (topHolder > 0 ? `${topHolder < 30 ? "✅" : "⚠️"} Top 10 holder concentration: ${topHolder.toFixed(1)}%\n` : "") +
        `\nBasedMind Score: ${score}/100 — ${label}`;
    }

    if (!dexSection && !secSection) return "";
    return `\n\n[FULL TOKEN ANALYSIS]\n${dexSection}${secSection}\n`;
  } catch {
    return "";
  }
}

// ── New Gem Finder — GeckoTerminal Solana new pools (last 24h) ─────────────
export async function fetchNewGems(): Promise<string> {
  try {
    const res = await fetch(
      "https://api.geckoterminal.com/api/v2/networks/solana/new_pools?page=1",
      { headers: { Accept: "application/json;version=20230302" }, cache: "no-store" }
    );
    if (!res.ok) return "";
    const data = await res.json();

    const now = Date.now();
    const cutoff = now - 24 * 60 * 60 * 1000;

    const pools = (data.data || [])
      .filter((p: any) => new Date(p.attributes?.pool_created_at ?? 0).getTime() > cutoff)
      .filter((p: any) => {
        const liq = parseFloat(p.attributes?.reserve_in_usd ?? "0");
        const vol = parseFloat(p.attributes?.volume_usd?.h24 ?? "0");
        return liq > 5000 && vol > 1000;
      })
      .slice(0, 8);

    if (!pools.length) return "\n\n[NEW GEM FINDER]\nNo significant new tokens found on Solana in the last 24h.\n";

    const lines = pools.map((p: any, i: number) => {
      const a = p.attributes;
      const liq  = parseFloat(a.reserve_in_usd ?? "0");
      const vol  = parseFloat(a.volume_usd?.h24 ?? "0");
      const ch   = parseFloat(a.price_change_percentage?.h24 ?? "0");
      const arrow = ch >= 0 ? "▲" : "▼";
      const hrs  = Math.round((now - new Date(a.pool_created_at).getTime()) / 36e5);
      const baseTokenRel = p.relationships?.base_token?.data?.id ?? "";
      const tokenAddr = baseTokenRel.includes("_") ? baseTokenRel.split("_").slice(1).join("_") : "";
      const dexLink = tokenAddr ? `https://dexscreener.com/solana/${tokenAddr}` : "";
      return (
        `  ${i + 1}. ${a.name} ${arrow}${Math.abs(ch).toFixed(1)}%\n` +
        `     Liq: $${liq.toLocaleString(undefined, { maximumFractionDigits: 0 })} | ` +
        `Vol 24h: $${vol.toLocaleString(undefined, { maximumFractionDigits: 0 })} | ` +
        `${hrs}h old` +
        (tokenAddr ? ` | CA: \`${tokenAddr}\`` : "") +
        (dexLink ? `\n     🔗 ${dexLink}` : "")
      );
    });

    return `\n\n[NEW GEM FINDER — Solana, last 24h]\nFiltered: Liq > $5K, Vol > $1K\n${lines.join("\n")}\n`;
  } catch {
    return "";
  }
}

// ── DEX Screener — any Solana token by name or contract address ────────────
export async function fetchDexScreener(query: string): Promise<string> {
  try {
    const cleanQuery = query.replace(/https?:\/\/\S+/gi, "");
    const solAddr = cleanQuery.match(/[1-9A-HJ-NP-Za-km-z]{43,44}/)?.[0];
    const url = solAddr
      ? `https://api.dexscreener.com/latest/dex/tokens/${solAddr}`
      : `https://api.dexscreener.com/latest/dex/search/?q=${encodeURIComponent(query)}`;

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return "";
    const data = await res.json();
    const pairs: any[] = (data.pairs || [])
      .filter((p: any) => p.chainId === "solana")
      .slice(0, 3);
    if (!pairs.length) return "";

    const lines = pairs.map((p: any) => {
      const change24h = p.priceChange?.h24;
      const arrow = Number(change24h) >= 0 ? "▲" : "▼";
      const mcap = p.marketCap ? `$${Number(p.marketCap).toLocaleString()}` : "N/A";
      const liq = p.liquidity?.usd ? `$${Number(p.liquidity.usd).toLocaleString()}` : "N/A";
      const vol = p.volume?.h24 ? `$${Number(p.volume.h24).toLocaleString()}` : "N/A";
      const age = p.pairCreatedAt ? new Date(p.pairCreatedAt).toLocaleDateString() : "N/A";
      return (
        `${p.baseToken.name} (${p.baseToken.symbol.toUpperCase()}) on ${p.dexId} [Solana]\n` +
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

// ── DeFiLlama — TVL, chain rankings, Solana stats ─────────────────────────
export async function fetchDefiLlama(): Promise<string> {
  try {
    const res = await fetch("https://api.llama.fi/v2/chains", { cache: "no-store" });
    if (!res.ok) return "";
    const chains: any[] = await res.json();

    const sorted = chains.sort((a, b) => b.tvl - a.tvl);
    const top5 = sorted.slice(0, 5).map((c, i) =>
      `  ${i + 1}. ${c.name}: $${(c.tvl / 1e9).toFixed(2)}B`
    );
    const solana = chains.find((c) => c.name === "Solana");
    const solanaTvl = solana ? `$${(solana.tvl / 1e9).toFixed(2)}B` : "N/A";
    const solanaRank = solana ? sorted.findIndex((c) => c.name === "Solana") + 1 : "N/A";

    return (
      `\n\n[DEFILLLAMA LIVE DATA]\n` +
      `Solana TVL: ${solanaTvl} (ranked #${solanaRank} across all chains)\n` +
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

// ── Solana Transaction Fees ────────────────────────────────────────────────
export async function fetchGasPrice(): Promise<string> {
  return (
    `\n\n[SOLANA TRANSACTION FEES]\n` +
    `🪙 Base fee: 5,000 lamports (0.000005 SOL ≈ <$0.001)\n` +
    `⚡ Priority fee: 0–0.001 SOL during network congestion\n` +
    `🚀 Finality: ~400ms average block time\n` +
    `📊 Typical swap (Jupiter/Raydium): <$0.01 total\n` +
    `🔗 Live network status: https://status.solana.com\n`
  );
}

// ── Trending Tokens — GeckoTerminal Solana (24h + DEX Screener links) ──────
export async function fetchTrending(): Promise<string> {
  try {
    const res = await fetch(
      "https://api.geckoterminal.com/api/v2/networks/solana/trending_pools?page=1",
      { headers: { Accept: "application/json;version=20230302" }, cache: "no-store" }
    );
    if (!res.ok) throw new Error("gecko failed");
    const data = await res.json();

    const pools = (data.data || []).slice(0, 10);
    if (!pools.length) throw new Error("empty");

    const lines = pools.map((p: any, i: number) => {
      const a = p.attributes;
      const baseTokenRel = p.relationships?.base_token?.data?.id ?? "";
      const tokenAddr = baseTokenRel.includes("_") ? baseTokenRel.split("_").slice(1).join("_") : (a.address ?? "");
      const dexLink = tokenAddr ? `https://dexscreener.com/solana/${tokenAddr}` : "";

      const price = a.base_token_price_usd
        ? `$${parseFloat(a.base_token_price_usd).toLocaleString(undefined, { maximumSignificantDigits: 4 })}`
        : "N/A";
      const ch24  = parseFloat(a.price_change_percentage?.h24 ?? "0");
      const arrow = ch24 >= 0 ? "▲" : "▼";
      const vol   = parseFloat(a.volume_usd?.h24 ?? "0");
      const liq   = parseFloat(a.reserve_in_usd ?? "0");
      const txns  = (a.transactions?.h24?.buys ?? 0) + (a.transactions?.h24?.sells ?? 0);

      return (
        `${i + 1}. **${a.name}** [SOLANA]\n` +
        `   Price: ${price} | 24h: ${arrow}${Math.abs(ch24).toFixed(1)}%\n` +
        `   Vol 24h: $${vol.toLocaleString(undefined, { maximumFractionDigits: 0 })} | ` +
        `Liq: $${liq.toLocaleString(undefined, { maximumFractionDigits: 0 })} | ` +
        `Txns: ${txns.toLocaleString()}\n` +
        (dexLink ? `   🔗 ${dexLink}\n` : "")
      );
    });

    return `\n\n[TRENDING POOLS ON SOLANA — Last 24h]\n${lines.join("\n")}\n`;
  } catch {
    // CoinGecko fallback
    try {
      const res = await fetch("https://api.coingecko.com/api/v3/search/trending", { cache: "no-store" });
      if (!res.ok) return "";
      const data = await res.json();
      const coins = (data.coins || []).slice(0, 7).map((c: any, i: number) => {
        const item = c.item;
        const ch = item.data?.price_change_percentage_24h?.usd;
        const arrow = (ch ?? 0) >= 0 ? "▲" : "▼";
        const price = item.data?.price
          ? `$${Number(item.data.price).toLocaleString(undefined, { maximumFractionDigits: 6 })}`
          : "N/A";
        const dexLink = `https://dexscreener.com/search?q=${encodeURIComponent(item.symbol)}`;
        return (
          `${i + 1}. **${item.name}** (${item.symbol.toUpperCase()})\n` +
          `   Price: ${price} | 24h: ${arrow}${Math.abs(ch ?? 0).toFixed(1)}%\n` +
          `   🔗 ${dexLink}\n`
        );
      });
      return `\n\n[TRENDING ON COINGECKO — Last 24h]\n${coins.join("\n")}\n`;
    } catch {
      return "";
    }
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
