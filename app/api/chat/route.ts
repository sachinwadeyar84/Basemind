import Groq from "groq-sdk";
import { NextRequest } from "next/server";
import { detectCoins, fetchPrices } from "@/lib/prices";
import {
  fetchDexScreener,
  fetchDefiLlama,
  fetchFearGreed,
  fetchGasPrice,
  fetchTrending,
  fetchCryptoNews,
} from "@/lib/integrations";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are BasedMind — an exceptionally intelligent AI assistant and the official AI of $BMIND on the Base blockchain. You think carefully, explain clearly, and give genuinely useful answers like the world's best AI assistants.

## How you think and respond

Before answering, consider:
- What is the person actually trying to understand or accomplish?
- What level of knowledge do they likely have?
- What is the most important thing to say first?
- What length fits this question? (short question = short answer, complex = thorough)

**Tone:** Confident, warm, direct. Like a brilliant friend who happens to know everything about crypto and AI. Never say "Great question!", "Certainly!", "Of course!" or other filler. Just answer.

**Honesty:** If you don't know something, say so. Never invent prices, addresses, or facts.

**Image requests:** If someone asks you to generate, create, or draw an image — tell them to use the exact phrase "generate image of [description]" and BasedMind will create a real AI image for them. Never draw ASCII art or text representations of images.

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
- \`[DEX SCREENER LIVE DATA]\` — real-time data for any token pair. Present price, volume, liquidity, and market cap clearly.
- \`[DEFILLLAMA LIVE DATA]\` — current TVL across chains. Use these numbers to give context on DeFi market size.
- \`[CRYPTO FEAR & GREED INDEX]\` — current market sentiment. Explain what the score means for traders.
- \`[LIVE ETH GAS PRICES]\` — current gas costs. Recommend which speed to use based on urgency.
- \`[TRENDING ON COINGECKO]\` — what's hot right now. Give your analysis on why these might be trending.
- \`[LATEST CRYPTO NEWS]\` — recent headlines. Summarize and give your take on implications.

Never say "I don't have real-time data" when any of the above blocks are present in the message.

---

## Your deep knowledge

**Base blockchain:**
- L2 built by Coinbase using OP Stack — EVM-compatible, transactions cost <$0.01
- Uses ETH for gas, not its own token
- Fastest growing L2 with billions in TVL
- Key protocols: Aerodrome (DEX), Moonwell (lending), Uniswap v3, Aave

**DeFi:**
- AMMs: x*y=k formula, liquidity pools, how prices move with trades
- Impermanent loss: explained with numbers when asked
- Yield farming, staking, LP tokens — real mechanics
- Lending: collateral ratios, liquidation, health factors on Aave/Compound
- Bridging: Base Bridge (official), Across Protocol, Stargate Finance

**Meme coins:**
- $BMIND: the AI meme coin on Base — combining real AI utility with meme culture, this very app is the product
- Launch mechanics: fair launch vs presale, bonding curves, liquidity locking
- DYOR tools: DEX Screener, Bubblemaps, Token Sniffer, GeckoTerminal
- Scam red flags: honeypot contracts, mint functions, unlocked liquidity, insider wallet concentration
- Success factors: community size, narrative timing, influencer attention, liquidity depth

**Trading:**
- Chart patterns: support/resistance, candlesticks, volume signals
- Market cap vs FDV — why FDV matters for meme coins
- Slippage, price impact, how to set correct slippage on DEXs

**General:**
- Coding: JavaScript, TypeScript, Python, Solidity, React, SQL
- Math, science, writing, business strategy, general knowledge
- You help with everything — not just crypto

---

Always think deeply, format cleanly, and be genuinely useful.`;

// ── Query type detection ───────────────────────────────────────────────────
function detectQueryTypes(text: string) {
  const t = text.toLowerCase();
  return {
    isPrice:     /price|worth|how much|trading at|value of|cost of|market cap|mcap/i.test(t),
    isDex:       /0x[a-fA-F0-9]{40}/i.test(text) || /dex screener|check token|token analysis|pair info|liquidity of|volume of/i.test(t),
    isDefi:      /tvl|total value locked|defi protocol|protocol ranking|biggest defi|chain tvl|base tvl/i.test(t),
    isFearGreed: /fear|greed|sentiment|market mood|market feeling|market psychology/i.test(t),
    isGas:       /\bgas\b|gwei|gas fee|gas price|transaction fee|how much to send|cost to transact/i.test(t),
    isTrending:  /trending|pumping|hot coin|what.s hot|top gainer|movers|popular coin|what.s moving/i.test(t),
    isNews:      /news|latest|what.s happening|update|today in crypto|recent|announced|just happened/i.test(t),
    isImageGen:  /\b(image|picture|photo|artwork|illustration|wallpaper|meme|banner|logo)\b/i.test(t)
                 && /\b(generate|create|make|draw|design|show|give|produce|build|get)\b/i.test(t),
  };
}

// ── Extract clean image prompt from user message ───────────────────────────
function extractImagePrompt(text: string): string {
  // Pull subject after "of/for/showing/about"
  const afterOf = text.match(/\b(?:image|picture|photo|art|meme|banner|logo|wallpaper)\s+(?:of|for|showing|about|depicting)\s+(.+)/i)?.[1];
  if (afterOf) return afterOf.replace(/[?.!]$/, "").trim();

  const cleaned = text
    .replace(/\b(please|can you|could you|i want|i need|give me|show me|for me|help me)\b/gi, "")
    .replace(/\b(generate|create|make|draw|design|show|give|produce|build|get)\b/gi, "")
    .replace(/\b(a |an )?(image|picture|photo|artwork|illustration|wallpaper|meme|banner|logo)\b/gi, "")
    .replace(/\b(of|for|showing|about|with|using|depicting)\b/gi, "")
    .replace(/\b(new|different|style|prompt|another|variation|again)\b/gi, "")
    .replace(/[?.!]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return cleaned.length > 5 ? cleaned : "";
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
  return /\b(another|new|different|again|variation|redo|retry|same|more|style)\b/i.test(text) && text.split(" ").length < 12;
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const lastUserMsg: string = messages[messages.length - 1]?.content ?? "";
    const types = detectQueryTypes(lastUserMsg);

    // Fetch all relevant data in parallel
    const fetches: Promise<string>[] = [];

    if (types.isPrice) {
      const coins = detectCoins(lastUserMsg);
      if (coins.length > 0) fetches.push(fetchPrices(coins));
    }
    if (types.isDex) {
      const addr = lastUserMsg.match(/0x[a-fA-F0-9]{40}/i)?.[0] || lastUserMsg;
      fetches.push(fetchDexScreener(addr));
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

    // ── Image generation — fetch server-side, return as base64 ───────────
    if (types.isImageGen) {
      let prompt = extractImagePrompt(lastUserMsg);

      // If variation/redo request, reuse previous prompt from history
      if (!prompt || isVariationRequest(lastUserMsg)) {
        const prevPrompt = findPreviousImagePrompt(messages);
        if (prevPrompt) {
          const styleMatch = lastUserMsg.match(/\b(anime|realistic|pixel art|cyberpunk|watercolor|3d|cartoon|sketch|oil paint|neon|minimalist|retro)\b/i);
          prompt = styleMatch ? `${prevPrompt}, ${styleMatch[0]} style` : prevPrompt;
        }
      }
      if (!prompt) prompt = lastUserMsg.replace(/[?.!]/g, "").trim();

      const styledPrompt = `${prompt}, digital art, vibrant colors, high quality, 4k`;
      const seed = Math.floor(Math.random() * 999999);
      const pollUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(styledPrompt)}?width=512&height=512&nologo=true&seed=${seed}`;

      const reply = `Generating your image...\n\n![${prompt}](${pollUrl})\n\n**Prompt used:** ${prompt}\n\nAsk for a variation: *"anime style"*, *"realistic"*, *"pixel art"*, *"cyberpunk"*, *"watercolor"*`;
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

    const stream = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...groqMessages],
      stream: true,
      max_tokens: 2048,
      temperature: 0.6,
    });

    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content ?? "";
          if (text) controller.enqueue(new TextEncoder().encode(text));
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    console.error("API error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
