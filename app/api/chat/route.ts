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
  const isStyleWord = /^(anime|realistic|pixel art|cyberpunk|watercolor|3d|cartoon|sketch|neon|retro|minimalist|oil paint|dark|light|colorful|black and white|vintage|futuristic|ghibli|fantasy|sci-fi)(\s+style)?$/i.test(t);
  const hasVariationWord = /\b(another|new|different|again|variation|redo|retry|same|more|style|anime|realistic|pixel art|cyberpunk|watercolor|3d|cartoon|sketch|neon|retro|minimalist)\b/i.test(t);
  return (isStyleWord || hasVariationWord) && words < 10;
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

    // ── Image generation ───────────────────────────────────────────────────
    if (shouldGenImage) {
      let prompt = extractImagePrompt(lastUserMsg);

      // Variation request: reuse previous prompt + apply style modifier
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

      // Try Hugging Face FLUX.1-schnell first (~3-8s, server-side, free tier)
      let imageUrl: string | null = null;
      const hfKey = process.env.HUGGINGFACE_API_KEY;
      if (hfKey) {
        try {
          const hfRes = await fetch(
            "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
            {
              method: "POST",
              headers: { Authorization: `Bearer ${hfKey}`, "Content-Type": "application/json" },
              body: JSON.stringify({ inputs: styledPrompt, parameters: { width: 512, height: 512 } }),
              signal: AbortSignal.timeout(25000),
            }
          );
          if (hfRes.ok) {
            const contentType = hfRes.headers.get("content-type") ?? "";
            if (contentType.startsWith("image/")) {
              const buf = await hfRes.arrayBuffer();
              const bytes = new Uint8Array(buf);
              let binary = "";
              for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
              const b64 = btoa(binary);
              imageUrl = `data:${contentType};base64,${b64}`;
            }
          }
        } catch {
          // HF failed — fall through to Pollinations
        }
      }

      // Fallback: Pollinations turbo (~10-15s, client-side load)
      if (!imageUrl) {
        imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(styledPrompt)}?width=512&height=512&nologo=true&seed=${seed}&model=turbo`;
      }

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

    const MODELS = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "gemma2-9b-it"];
    let groqRes: Response | null = null;
    for (const model of MODELS) {
      groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
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
      if (groqRes.status !== 429) break; // success or non-rate-limit error
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
