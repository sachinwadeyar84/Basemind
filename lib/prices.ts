const COIN_MAP: Record<string, string> = {
  bitcoin: "bitcoin", btc: "bitcoin",
  ethereum: "ethereum", eth: "ethereum",
  solana: "solana", sol: "solana",
  base: "ethereum",
  bnb: "binancecoin", "binance coin": "binancecoin", "binance": "binancecoin",
  cardano: "cardano", ada: "cardano",
  xrp: "ripple", ripple: "ripple",
  dogecoin: "dogecoin", doge: "dogecoin",
  "shiba inu": "shiba-inu", shib: "shiba-inu", shiba: "shiba-inu",
  polygon: "matic-network", matic: "matic-network",
  avalanche: "avalanche-2", avax: "avalanche-2",
  chainlink: "chainlink", link: "chainlink",
  uniswap: "uniswap", uni: "uniswap",
  pepe: "pepe",
  floki: "floki",
  arbitrum: "arbitrum", arb: "arbitrum",
  optimism: "optimism", op: "optimism",
  tron: "tron", trx: "tron",
  litecoin: "litecoin", ltc: "litecoin",
  polkadot: "polkadot", dot: "polkadot",
  cosmos: "cosmos", atom: "cosmos",
  sui: "sui",
  aptos: "aptos", apt: "aptos",
  near: "near",
  "internet computer": "internet-computer", icp: "internet-computer",
  stellar: "stellar", xlm: "stellar",
  monero: "monero", xmr: "monero",
  toncoin: "the-open-network", ton: "the-open-network",
  injective: "injective-protocol", inj: "injective-protocol",
  sei: "sei-network",
};

export function detectCoins(text: string): string[] {
  const lower = text.toLowerCase();
  const found = new Set<string>();
  // Sort by keyword length descending to match longer phrases first
  const sorted = Object.entries(COIN_MAP).sort((a, b) => b[0].length - a[0].length);
  for (const [keyword, id] of sorted) {
    if (lower.includes(keyword)) found.add(id);
  }
  return Array.from(found).slice(0, 5); // max 5 coins per query
}

export async function fetchPrices(coinIds: string[]): Promise<string> {
  if (coinIds.length === 0) return "";
  try {
    const ids = coinIds.join(",");
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return "";
    const data = await res.json();

    const lines = Object.entries(data).map(([id, info]: [string, any]) => {
      const nameMap: Record<string, string> = {
        "bitcoin": "Bitcoin (BTC)",
        "ethereum": "Ethereum (ETH)",
        "solana": "Solana (SOL)",
        "binancecoin": "BNB",
        "ripple": "XRP",
        "cardano": "Cardano (ADA)",
        "dogecoin": "Dogecoin (DOGE)",
        "shiba-inu": "Shiba Inu (SHIB)",
        "matic-network": "Polygon (MATIC)",
        "avalanche-2": "Avalanche (AVAX)",
        "chainlink": "Chainlink (LINK)",
        "uniswap": "Uniswap (UNI)",
        "pepe": "PEPE",
        "floki": "FLOKI",
        "arbitrum": "Arbitrum (ARB)",
        "optimism": "Optimism (OP)",
        "tron": "Tron (TRX)",
        "litecoin": "Litecoin (LTC)",
        "polkadot": "Polkadot (DOT)",
        "cosmos": "Cosmos (ATOM)",
        "sui": "Sui (SUI)",
        "aptos": "Aptos (APT)",
        "near": "NEAR Protocol",
        "internet-computer": "Internet Computer (ICP)",
        "stellar": "Stellar (XLM)",
        "monero": "Monero (XMR)",
        "the-open-network": "Toncoin (TON)",
        "injective-protocol": "Injective (INJ)",
        "sei-network": "Sei (SEI)",
      };

      const name = nameMap[id] || id;
      const price = info.usd < 0.01
        ? `$${info.usd.toFixed(8)}`
        : info.usd.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 4 });
      const change = Number(info.usd_24h_change ?? 0).toFixed(2);
      const arrow = parseFloat(change) >= 0 ? "▲" : "▼";
      const mcap = info.usd_market_cap
        ? info.usd_market_cap >= 1e9
          ? `Market cap: $${(info.usd_market_cap / 1e9).toFixed(2)}B`
          : `Market cap: $${(info.usd_market_cap / 1e6).toFixed(1)}M`
        : "";
      return `${name}: ${price} (${arrow}${Math.abs(parseFloat(change))}% 24h) — ${mcap}`;
    });

    return `\n\n[LIVE PRICE DATA — fetched right now from CoinGecko]\n${lines.join("\n")}\n`;
  } catch {
    return "";
  }
}
