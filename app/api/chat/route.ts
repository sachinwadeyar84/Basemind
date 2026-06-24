import { NextRequest } from "next/server";
import { detectCoins, fetchPrices } from "@/lib/prices";

export const runtime = "edge";
import {
  fetchDexScreener,
  fetchDefiLlama,
  fetchFearGreed,
  fetchGasPrice,
  fetchTrending,
  fetchCryptoNews,
  fetchFullTokenAnalysis,
  fetchNewGems,
  fetchTwitterKOL,
  extractTwitterHandle,
} from "@/lib/integrations";


const SYSTEM_PROMPT = `You are SolAI — an exceptionally intelligent AI assistant and the official AI of $BMIND on Solana. You think carefully, explain clearly, and give genuinely useful answers like the world's best AI assistants.

## How you think and respond

Before answering, consider:
- What is the person actually trying to understand or accomplish?
- What level of knowledge do they likely have?
- What is the most important thing to say first?
- What length fits this question? (short question = short answer, complex = thorough)

**Tone:** Confident, warm, direct. Like a brilliant friend who happens to know everything about crypto and AI. Never say "Great question!", "Certainly!", "Of course!" or other filler. Just answer.

**Honesty:** If you don't know something, say so. Never invent prices, addresses, or facts.

**Token Analysis — CRITICAL RULES (never break these):**
- ONLY present token security data, prices, scores, or on-chain info when a \`[FULL TOKEN ANALYSIS]\` block is present in the message
- Solana token addresses are base58 strings (43–44 characters, e.g. \`EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v\`)
- If someone pastes an EVM/Ethereum address (starting with \`0x\`) respond EXACTLY: "SolAI currently supports **Solana tokens only**. This looks like an **EVM address** — please paste a Solana token contract address for a full security scan and SolAI Score."
- **NEVER invent, estimate, or guess** token prices, security scores, liquidity, holder counts, or any on-chain data
- If the API data is missing, say so clearly rather than making anything up

**Image requests:** If someone asks you to generate, create, or draw an image — tell them to use the exact phrase "generate image of [description]" and SolAI will create a real AI image for them. Never draw ASCII art or text representations of images.

---

## Formatting rules (always follow)

- **## Headings** — use for sections in longer answers
- **Bold** — key terms, important numbers, warnings, names
- Bullet list \`-\` — features, options, comparisons (3+ items)
- Numbered list \`1.\` — steps that must be done in order
- \`inline code\` — token tickers like \`$BMIND\`, contract addresses, commands
- Short paragraphs — max 3 sentences, then line break
- Tables — when comparing 3+ options with multiple attributes
- End every response with a follow-up offer or concrete next step
- **Never write walls of plain unformatted text**

---

## Live data blocks — USE THESE WHEN PROVIDED

When the user message contains any of these blocks, use the exact data in your answer:

- \`[LIVE PRICE DATA]\` — real-time token prices from CoinGecko. Use the exact price, 24h % change, and market cap.
- \`[DEX SCREENER LIVE DATA]\` — real-time Solana token data. Present price, volume, liquidity, and market cap clearly.
- \`[DEFILLLAMA LIVE DATA]\` — current TVL across chains. Use these numbers to give context on DeFi market size.
- \`[CRYPTO FEAR & GREED INDEX]\` — current market sentiment. Explain what the score means for traders.
- \`[SOLANA TRANSACTION FEES]\` — current Solana fee info. Explain priority fees and when to use them.
- \`[TRENDING POOLS ON SOLANA]\` or \`[TRENDING ON COINGECKO]\` — top trending tokens on Solana right now. For each token render the DEX Screener link as a clickable markdown link: [View on DEX Screener](url). Give your analysis on why each might be trending.
- \`[LATEST CRYPTO NEWS]\` — recent headlines. Summarize and give your take on implications.
- \`[FULL TOKEN ANALYSIS]\` — DEX data + GoPlus security scan + SolAI Score. Present all data clearly. Render the DEX Screener URL as a clickable link: [View on DEX Screener](url). Explain the score. Warn strongly if mint/freeze authority is active. Always remind the user to DYOR.
- \`[NEW GEM FINDER — Solana]\` — new tokens on Solana launched in the last 24h, filtered for liquidity and volume. Analyze each one, highlight the most promising, warn about risks. Remind users these are very early and high risk.
- \`[TWITTER KOL ANALYSIS]\` — full Twitter/X account analysis with KOL Score 0–100. Explain the score, highlight engagement rate, follower ratio, and whether they are trustworthy in the Solana community. Warn if account is new or has low engagement despite high followers (bought followers red flag).

Never say "I don't have real-time data" when any of the above blocks are present in the message.

---

## Your deep knowledge

**Solana blockchain:**
- High-performance L1 — ~65,000 TPS theoretical, sub-second finality (~400ms)
- Transaction fees: ~$0.00025 (5,000 lamports base fee) — almost free
- Token standard: SPL tokens (not ERC-20)
- Key wallets: Phantom, Solflare, Backpack
- Key DEXs: Raydium, Orca, Meteora, Phoenix
- Swap aggregator: Jupiter (finds best route across all Solana DEXs)
- Lending: MarginFi, Kamino, Solend
- Liquid staking: Marinade (mSOL), Jito (jitoSOL), Lido (stSOL)
- NFTs: Magic Eden, Tensor
- Block explorer: Solscan, Solana Explorer, Birdeye

**DeFi:**
- AMMs: x*y=k formula, liquidity pools, CLMM (concentrated liquidity)
- Impermanent loss: explained with numbers when asked
- Yield farming, staking, LP tokens — real mechanics
- Lending: collateral ratios, liquidation, health factors
- Bridging to Solana: Wormhole, deBridge, Allbridge

**Meme coins on Solana:**
- $BMIND: the AI meme coin on Solana — combining real AI utility with meme culture, this very app is the product
- Launch platforms: pump.fun (bonding curve), Raydium (direct listing)
- DYOR tools: DEX Screener, Birdeye, Solscan, GeckoTerminal, Photon
- Scam red flags: active mint authority (can print tokens), active freeze authority (can freeze wallets), unlocked liquidity, insider wallet concentration
- Success factors: community size, narrative timing, influencer attention, liquidity depth

**Trading:**
- Chart patterns: support/resistance, candlesticks, volume signals
- Market cap vs FDV — why FDV matters for meme coins
- Slippage on Solana: usually 0.5–1% on liquid pairs, 2–5% on low-liq meme coins
- Priority fees: add during high congestion for faster landing

**General:**
- Coding: JavaScript, TypeScript, Python, Rust, React, SQL
- Math, science, writing, business strategy, general knowledge
- You help with everything — not just crypto

---

Always think deeply, format cleanly, and be genuinely useful.`;

// Solana address: base58, 43-44 chars (after stripping URLs)
const SOL_ADDR_RE = /[1-9A-HJ-NP-Za-km-z]{43,44}/;
function stripUrls(text: string) { return text.replace(/https?:\/\/\S+/gi, ""); }
function extractSolanaAddress(text: string): string | null {
  return stripUrls(text).match(SOL_ADDR_RE)?.[0] ?? null;
}

// ── Query type detection ───────────────────────────────────────────────────
function detectQueryTypes(text: string) {
  const t = text.toLowerCase();
  const noUrl = stripUrls(text);
  return {
    isPrice:     /price|worth|how much|trading at|value of|cost of|market cap|mcap/i.test(t),
    isCA:        SOL_ADDR_RE.test(noUrl),
    isDex:       !SOL_ADDR_RE.test(noUrl) && /dex screener|check token|pair info|liquidity of|volume of/i.test(t),
    isNewGems:   /new token|new gem|new launch|launched today|launched this week|find gem|early gem|new coin|new project|gem finder|what.s new on solana|recently launched|new on solana/i.test(t),
    isDefi:      /tvl|total value locked|defi protocol|protocol ranking|biggest defi|chain tvl|solana tvl|sol tvl/i.test(t),
    isFearGreed: /fear|greed|sentiment|market mood|market feeling|market psychology/i.test(t),
    isGas:       /\bgas\b|gwei|gas fee|gas price|transaction fee|how much to send|cost to transact|sol fee|solana fee|priority fee/i.test(t),
    isTrending:  /trending|pumping|hot coin|what.s hot|top gainer|movers|popular coin|what.s moving/i.test(t),
    isNews:      /news|latest|what.s happening|update|today in crypto|recent|announced|just happened/i.test(t),
    isTwitter:   /twitter\.com\/\w+|x\.com\/\w+/.test(text) || (/@[a-zA-Z0-9_]{1,15}/.test(text) && /kol|influencer|check|analyze|follower|score|twitter|account|who is/i.test(t)),
    isImageGen:  (
                   // Image/art noun + any action verb
                   /\b(image|picture|photo|artwork|illustration|wallpaper|meme|banner|logo|painting|portrait|landscape|scene|poster|avatar|icon|art)\b/i.test(t)
                   && /\b(generate|create|make|draw|design|show|give|produce|build|get|paint|render|want|need)\b/i.test(t)
                 )
                 // Strong visual creation verbs — enough on their own
                 || /\b(draw|paint|illustrate|sketch)\b/i.test(t)
                 // "generate" without code/text context
                 || (/\bgenerate\b/i.test(t) && !/\b(code|function|script|text|component|class|sql|query|api|contract)\b/i.test(t))
                 // Style-word requests
                 || /\b(generate|create|make|draw|show|paint|render)\b.{0,40}\b(anime|realistic|pixel art|cyberpunk|watercolor|3d|cartoon|sketch|neon|retro|minimalist|ghibli|fantasy|sci-fi|oil paint)\b/i.test(t),
  };
}

// ── Extract clean image prompt from user message ───────────────────────────
function extractImagePrompt(text: string): string {
  // Pull subject after "of/for/showing/about" with an image noun
  const afterOf = text.match(/\b(?:image|picture|photo|art|meme|banner|logo|wallpaper|painting|portrait|landscape|scene)\s+(?:of|for|showing|about|depicting)\s+(.+)/i)?.[1];
  if (afterOf) return afterOf.replace(/[?.!]$/, "").trim();

  // Pull subject after creation verb: "draw me a X", "generate a X", etc.
  const afterVerb = text.match(/\b(?:generate|create|make|draw|paint|render|illustrate|show|design|sketch)\s+(?:me\s+)?(?:a\s+|an\s+|the\s+|some\s+)?(.+)/i)?.[1];
  if (afterVerb) {
    const stripped = afterVerb
      .replace(/\b(image|picture|photo|artwork|illustration|of|for)\b/gi, "")
      .replace(/\s+/g, " ").trim();
    if (stripped.length > 3) return stripped;
  }

  // Generic: strip meta/action words, keep the visual description
  const cleaned = text
    .replace(/\b(please|can you|could you|i want|i need|give me|show me|for me|help me)\b/gi, "")
    .replace(/\b(generate|create|make|draw|design|show|give|produce|build|get|paint|render|illustrate|sketch)\b/gi, "")
    .replace(/\b(a |an )?(image|picture|photo|artwork|illustration|wallpaper|meme|banner|logo|painting)\b/gi, "")
    .replace(/\b(of|for|showing|about|with|using|depicting)\b/gi, "")
    .replace(/\b(new|different|style|prompt|another|variation|again)\b/gi, "")
    .replace(/[?.!]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  // Always return something — worst case use the full cleaned message
  return cleaned.length > 3 ? cleaned : text.replace(/[?.!]/g, "").trim();
}

// ── Find previous image prompt from conversation history ──────────────────
function findPreviousImagePrompt(messages: Array<{role: string; content: string}>): string {
  for (let i = messages.length - 2; i >= 0; i--) {
    const match = messages[i]?.content?.match(/\*\*Prompt used:\*\*\s*(.+)/);
    if (match) return match[1].trim();
  }
  return "";
}

// ── Detect if user wants a variation of last image ────────────────────────
function isVariationRequest(text: string): boolean {
  const t = text.trim();
  const words = t.split(/\s+/).length;
  // Creation verbs at the start = new image request, never a variation
  if (/^(create|generate|make|draw|paint|render|illustrate|show|get|give|produce)\b/i.test(t)) return false;
  // Long messages are new requests, not style tweaks
  if (words >= 8) return false;
  const isStyleWord = /^(anime|realistic|pixel art|cyberpunk|watercolor|3d|cartoon|sketch|neon|retro|minimalist|oil paint|dark|light|colorful|black and white|vintage|futuristic|ghibli|fantasy|sci-fi)(\s+style)?$/i.test(t);
  const hasVariationWord = /\b(another|new|different|again|variation|redo|retry|same|more|style|anime|realistic|pixel art|cyberpunk|watercolor|3d|cartoon|sketch|neon|retro|minimalist)\b/i.test(t);
  return isStyleWord || hasVariationWord;
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const lastUserMsg: string = messages[messages.length - 1]?.content ?? "";
    const types = detectQueryTypes(lastUserMsg);

    // Also treat short style/variation messages as image gen if a previous image exists
    const prevPromptForVariation = findPreviousImagePrompt(messages);
    const shouldGenImage = types.isImageGen || (isVariationRequest(lastUserMsg) && prevPromptForVariation !== "");

    // Fetch all relevant data in parallel
    const fetches: Promise<string>[] = [];

    if (types.isPrice) {
      const coins = detectCoins(lastUserMsg);
      if (coins.length > 0) fetches.push(fetchPrices(coins));
    }
    if (types.isCA) {
      const addr = extractSolanaAddress(lastUserMsg);
      if (addr) fetches.push(fetchFullTokenAnalysis(addr));
    }
    if (types.isDex) {
      fetches.push(fetchDexScreener(lastUserMsg));
    }
    if (types.isNewGems) fetches.push(fetchNewGems());
    if (types.isTwitter) {
      const handle = extractTwitterHandle(lastUserMsg);
      if (handle) fetches.push(fetchTwitterKOL(handle));
    }
    if (types.isDefi)      fetches.push(fetchDefiLlama());
    if (types.isFearGreed) fetches.push(fetchFearGreed());
    if (types.isGas)       fetches.push(fetchGasPrice());
    if (types.isTrending)  fetches.push(fetchTrending());
    if (types.isNews) {
      // extract keyword from message for targeted news
      const keyword = lastUserMsg.match(/news\s+(?:about|on|for)?\s*(\w+)/i)?.[1] || "";
      fetches.push(fetchCryptoNews(keyword || undefined));
    }

    // ── Image generation ───────────────────────────────────────────────────
    if (shouldGenImage) {
      let prompt = extractImagePrompt(lastUserMsg);

      // Variation request: only override prompt when nothing meaningful was extracted
      const isVariation = isVariationRequest(lastUserMsg);
      if (isVariation || !prompt) {
        const prevPrompt = findPreviousImagePrompt(messages);
        if (prevPrompt && (!prompt || isVariation)) {
          const styleMatch = lastUserMsg.match(/\b(anime|realistic|pixel art|cyberpunk|watercolor|3d|cartoon|sketch|oil paint|neon|minimalist|retro)\b/i);
          // Only use prevPrompt if no real new prompt was extracted
          if (!prompt || prompt.split(" ").length <= 3) {
            prompt = styleMatch ? `${prevPrompt}, ${styleMatch[0]} style` : prevPrompt;
          }
        }
      }
      if (!prompt) prompt = lastUserMsg.replace(/[?.!]/g, "").trim();

      const styledPrompt = `${prompt}, digital art, vibrant colors, high quality, 4k`;
      const seed = Math.floor(Math.random() * 999999);

      // Pollinations — server builds URL instantly, browser loads it (no edge timeout risk)
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(styledPrompt)}?width=512&height=512&seed=${seed}`;

      const reply = `![${prompt}](${imageUrl})\n\n**Prompt used:** ${prompt}\n\nAsk for a variation: *"anime style"*, *"realistic"*, *"pixel art"*, *"cyberpunk"*, *"watercolor"*`;
      const readable = new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode(reply));
          controller.close();
        },
      });
      return new Response(readable, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
    }

    const results = await Promise.all(fetches);
    const liveContext = results.filter(Boolean).join("");

    const groqMessages = messages.map((m: { role: string; content: string }, i: number) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: i === messages.length - 1 && liveContext
        ? m.content + liveContext
        : m.content,
    }));

    // Multiple API keys (comma-separated in GROQ_API_KEY) + model fallbacks
    const keys = (process.env.GROQ_API_KEY ?? "").split(",").map(k => k.trim()).filter(Boolean);
    const MODELS = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "gemma2-9b-it"];

    // Try all keys with best model first, then all keys with fallback models
    const attempts = MODELS.flatMap(model => keys.map(key => ({ key, model })));

    let groqRes: Response | null = null;
    for (const { key, model } of attempts) {
      groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "system", content: SYSTEM_PROMPT }, ...groqMessages],
          stream: true,
          max_tokens: 2048,
          temperature: 0.6,
        }),
      });
      if (groqRes.status !== 429) break;
    }

    if (!groqRes || !groqRes.ok || !groqRes.body) {
      const errText = await groqRes?.text().catch(() => "unknown") ?? "no response";
      return new Response(
        `**Error ${groqRes?.status ?? 0}:** ${errText.slice(0, 300)}`,
        { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8" } }
      );
    }

    // Parse SSE stream and forward just the text tokens
    const readable = new ReadableStream({
      async start(controller) {
        const reader = groqRes.body!.getReader();
        const decoder = new TextDecoder();
        let buf = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          const lines = buf.split("\n");
          buf = lines.pop() ?? "";
          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6).trim();
            if (data === "[DONE]") continue;
            try {
              const token = JSON.parse(data).choices?.[0]?.delta?.content ?? "";
              if (token) controller.enqueue(new TextEncoder().encode(token));
            } catch { /* skip malformed lines */ }
          }
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("API error:", msg);
    return new Response(`**Error:** ${msg}`, {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}
