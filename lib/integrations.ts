const GOPLUS_CHAIN: Record<string, string> = {
  ethereum: "1", eth: "1",
  bsc: "56", "binance-smart-chain": "56",
  base: "8453",
  polygon: "137",
  arbitrum: "42161",
  optimism: "10",
  avalanche: "43114",
  fantom: "250",
  solana: "solana",
};

// ── Full Token Analysis — DEX Screener + GoPlus Security + Score ───────────
export async function fetchFullTokenAnalysis(address: string): Promise<string> {
  try {
    // Fetch DEX Screener and GoPlus simultaneously where possible
    const dexUrl = `https://api.dexscreener.com/latest/dex/tokens/${address}`;
    const dexRes = await fetch(dexUrl, { cache: "no-store" });
    const dexData = dexRes.ok ? await dexRes.json() : { pairs: [] };
    const pairs: any[] = (dexData.pairs || []).sort((a: any, b: any) =>
      (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0)
    ).slice(0, 1);
    const top = pairs[0];

    const chainId = top ? (GOPLUS_CHAIN[top.chainId] ?? "8453") : "8453";
    const gpUrl = `https://api.gopluslabs.io/api/v1/token_security/${chainId}?contract_addresses=${address.toLowerCase()}`;
    const gpRes = await fetch(gpUrl, { cache: "no-store" });
    const gpData = gpRes.ok ? await gpRes.json() : {};
    const sec = gpData.result?.[address.toLowerCase()];

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

      dexSection =
        `Token: ${top.baseToken.name} (${top.baseToken.symbol.toUpperCase()}) on ${top.chainId}\n` +
        `Price: $${top.priceUsd} | 24h: ${arrow}${Math.abs(Number(change24h)).toFixed(2)}%\n` +
        `Market Cap: ${mcap} | Liquidity: ${liq} | Volume 24h: ${vol}\n` +
        `Pair created: ${age} | DEX: ${top.dexId}\n` +
        (twitter ? `Twitter/X: ${twitter}\n` : "") +
        (website ? `Website: ${website}\n` : "");
    }

    // ── Security section + Score ───────────────────────────────────────────
    let secSection = "";
    if (sec) {
      const honeypot   = sec.is_honeypot === "1";
      const buyTax     = parseFloat(sec.buy_tax  || "0") * 100;
      const sellTax    = parseFloat(sec.sell_tax || "0") * 100;
      const mintable   = sec.is_mintable === "1";
      const holders    = parseInt(sec.holder_count || "0");
      const openSource = sec.is_open_source === "1";
      const canTakeBack = sec.can_take_back_ownership === "1";
      const ownerChange = sec.owner_change_balance === "1";
      const blacklist  = sec.is_blacklisted === "1" || sec.transfer_pausable === "1";
      const cooldown   = sec.trading_cooldown === "1";
      const liqLocked  = (sec.lp_holders || []).some((lp: any) => lp.is_locked === 1);

      let score = 50;
      if (honeypot) {
        score = 0;
      } else {
        if (buyTax < 5 && sellTax < 5)       score += 15;
        else if (buyTax >= 20 || sellTax >= 20) score -= 20;
        if (holders > 500)  score += 15;
        else if (holders > 100) score += 10;
        else if (holders > 50)  score += 5;
        if (openSource)    score += 10;
        if (!mintable)     score += 10; else score -= 10;
        if (liqLocked)     score += 15;
        if (canTakeBack)   score -= 15;
        if (ownerChange)   score -= 10;
        if (blacklist)     score -= 10;
        if (cooldown)      score -= 5;
        score = Math.max(0, Math.min(100, score));
      }

      const label = score >= 80 ? "Low Risk ✅" : score >= 60 ? "Moderate ⚠️" : score >= 40 ? "Caution 🔶" : "High Risk 🚨";

      secSection =
        `\nSecurity Analysis (GoPlus):\n` +
        `${honeypot ? "🚨 HONEYPOT DETECTED — DO NOT BUY" : "✅ Not a honeypot"}\n` +
        `${buyTax < 10 ? "✅" : "⚠️"} Buy tax: ${buyTax.toFixed(1)}% | Sell tax: ${sellTax.toFixed(1)}%\n` +
        `${!mintable ? "✅" : "⚠️"} Mintable: ${mintable ? "Yes (owner can print tokens)" : "No"}\n` +
        `${holders > 100 ? "✅" : "⚠️"} Holders: ${holders.toLocaleString()}\n` +
        `${openSource ? "✅" : "⚠️"} Open source: ${openSource ? "Yes" : "No"}\n` +
        `${liqLocked ? "✅" : "⚠️"} Liquidity locked: ${liqLocked ? "Yes" : "No"}\n` +
        (canTakeBack ? "🚨 Owner can reclaim ownership\n" : "") +
        (ownerChange ? "⚠️ Owner can modify holder balances\n" : "") +
        (blacklist   ? "⚠️ Blacklist/pause function exists\n" : "") +
        `\nBasedMind Score: ${score}/100 — ${label}`;
    }

    if (!dexSection && !secSection) return "";
    return `\n\n[FULL TOKEN ANALYSIS]\n${dexSection}${secSection}\n`;
  } catch {
    return "";
  }
}

// ── New Gem Finder — GeckoTerminal new pools (last 24h) ────────────────────
export async function fetchNewGems(): Promise<string> {
  try {
    const res = await fetch(
      "https://api.geckoterminal.com/api/v2/networks/base/new_pools?page=1",
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

    if (!pools.length) return "\n\n[NEW GEM FINDER]\nNo significant new tokens found on Base in the last 24h.\n";

    const lines = pools.map((p: any, i: number) => {
      const a = p.attributes;
      const liq  = parseFloat(a.reserve_in_usd ?? "0");
      const vol  = parseFloat(a.volume_usd?.h24 ?? "0");
      const ch   = parseFloat(a.price_change_percentage?.h24 ?? "0");
      const arrow = ch >= 0 ? "▲" : "▼";
      const hrs  = Math.round((now - new Date(a.pool_created_at).getTime()) / 36e5);
      const addr = p.relationships?.base_token?.data?.id?.split("_")[1] ?? "";
      return (
        `  ${i + 1}. ${a.name} ${arrow}${Math.abs(ch).toFixed(1)}%\n` +
        `     Liq: $${liq.toLocaleString(undefined, { maximumFractionDigits: 0 })} | ` +
        `Vol 24h: $${vol.toLocaleString(undefined, { maximumFractionDigits: 0 })} | ` +
        `${hrs}h old${addr ? ` | CA: ${addr}` : ""}`
      );
    });

    return `\n\n[NEW GEM FINDER — Base, last 24h]\nFiltered: Liq > $5K, Vol > $1K\n${lines.join("\n")}\n`;
  } catch {
    return "";
  }
}

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

// ── Trending Tokens — GeckoTerminal (24h data + DEX Screener links) ────────
const GT_TO_DEX: Record<string, string> = {
  eth: "ethereum", bsc: "bsc", base: "base",
  polygon_pos: "polygon", arbitrum: "arbitrum",
  optimism: "optimism", avax: "avalanche",
  solana: "solana", fantom: "fantom",
};

export async function fetchTrending(): Promise<string> {
  try {
    const res = await fetch(
      "https://api.geckoterminal.com/api/v2/networks/trending_pools?page=1",
      { headers: { Accept: "application/json;version=20230302" }, cache: "no-store" }
    );
    if (!res.ok) throw new Error("gecko failed");
    const data = await res.json();

    const pools = (data.data || []).slice(0, 10);
    if (!pools.length) throw new Error("empty");

    const lines = pools.map((p: any, i: number) => {
      const a        = p.attributes;
      const network  = p.relationships?.network?.data?.id ?? "";
      const dexChain = GT_TO_DEX[network] ?? network;
      const poolAddr = a.address ?? "";
      const dexLink  = poolAddr ? `https://dexscreener.com/${dexChain}/${poolAddr}` : "";

      const price    = a.base_token_price_usd
        ? `$${parseFloat(a.base_token_price_usd).toLocaleString(undefined, { maximumSignificantDigits: 4 })}`
        : "N/A";
      const ch24  = parseFloat(a.price_change_percentage?.h24 ?? "0");
      const arrow = ch24 >= 0 ? "▲" : "▼";
      const vol   = parseFloat(a.volume_usd?.h24 ?? "0");
      const liq   = parseFloat(a.reserve_in_usd ?? "0");
      const txns  = (a.transactions?.h24?.buys ?? 0) + (a.transactions?.h24?.sells ?? 0);
      const chain = network.toUpperCase();

      return (
        `${i + 1}. **${a.name}** [${chain}]\n` +
        `   Price: ${price} | 24h: ${arrow}${Math.abs(ch24).toFixed(1)}%\n` +
        `   Vol 24h: $${vol.toLocaleString(undefined, { maximumFractionDigits: 0 })} | ` +
        `Liq: $${liq.toLocaleString(undefined, { maximumFractionDigits: 0 })} | ` +
        `Txns: ${txns.toLocaleString()}\n` +
        (dexLink ? `   🔗 ${dexLink}\n` : "")
      );
    });

    return `\n\n[TRENDING POOLS — Last 24h]\n${lines.join("\n")}\n`;
  } catch {
    // CoinGecko fallback (no DEX links available)
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
