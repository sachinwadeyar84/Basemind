"use client";

import Link from "next/link";
import Logo from "@/components/Logo";
import { useState, useEffect } from "react";

const FEATURES = [
  {
    icon: "📈",
    title: "Live Token Prices",
    desc: "Ask the price of any coin — Bitcoin, ETH, meme coins. Real-time data from CoinGecko.",
  },
  {
    icon: "🔍",
    title: "DEX Screener",
    desc: "Paste any contract address or name to get live price, volume, liquidity, and market cap.",
  },
  {
    icon: "🏦",
    title: "DeFi TVL Rankings",
    desc: "Ask about total value locked on Base or any chain. Live data from DeFiLlama.",
  },
  {
    icon: "😱",
    title: "Fear & Greed Index",
    desc: "Real-time crypto sentiment score. Know if the market is panicking or euphoric.",
  },
  {
    icon: "⛽",
    title: "ETH Gas Tracker",
    desc: "Live Ethereum gas prices — slow, normal, fast — before any on-chain transaction.",
  },
  {
    icon: "🔥",
    title: "Trending Tokens",
    desc: "See what's pumping on CoinGecko right now — coins, NFTs, and top movers.",
  },
  {
    icon: "📰",
    title: "Crypto News",
    desc: "Latest headlines from across crypto, fetched in real time so you never miss a move.",
  },
  {
    icon: "🧠",
    title: "AI Knowledge Base",
    desc: "Deep expertise in Base, DeFi, meme coins, trading, Solidity, and everything crypto.",
  },
];

export default function LandingPage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div style={{ background: "#080810", minHeight: "100vh", color: "#fff", fontFamily: "inherit" }}>

      {/* NAV */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: isMobile ? "14px 18px" : "16px 40px",
        borderBottom: "1px solid #12121e",
        position: "sticky", top: 0, background: "#080810cc",
        zIndex: 100, backdropFilter: "blur(12px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Logo size={32} />
          <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: "-0.3px", color: "#fff" }}>
            BasedMind
          </span>
        </div>
        <Link href="/chat" style={{
          padding: isMobile ? "8px 18px" : "10px 24px",
          background: "linear-gradient(135deg, #1d6fd8, #38bdf8)",
          borderRadius: 40, color: "#fff", fontWeight: 700,
          fontSize: isMobile ? 13 : 14, textDecoration: "none",
          boxShadow: "0 4px 20px #1d6fd840",
        }}>
          Launch App →
        </Link>
      </nav>

      {/* HERO */}
      <section style={{
        textAlign: "center",
        padding: isMobile ? "72px 20px 60px" : "110px 24px 90px",
      }}>
        <div style={{
          width: isMobile ? 80 : 100, height: isMobile ? 80 : 100,
          margin: "0 auto 32px",
          filter: "drop-shadow(0 0 48px #1d6fd870)",
        }}>
          <Logo size={isMobile ? 80 : 100} />
        </div>

        <h1 style={{
          fontSize: isMobile ? 42 : 72, fontWeight: 900,
          letterSpacing: isMobile ? "-1px" : "-2px",
          lineHeight: 1.05, marginBottom: 20,
        }}>
          <span style={{ color: "#fff" }}>BASED</span>
          <span style={{
            background: "linear-gradient(135deg, #1d6fd8, #38bdf8)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>MIND</span>
        </h1>

        <p style={{
          fontSize: isMobile ? 11 : 13, color: "#334155",
          letterSpacing: "4px", textTransform: "uppercase",
          marginBottom: 20,
        }}>
          — AI for Base Crypto —
        </p>

        <p style={{
          fontSize: isMobile ? 15 : 17, color: "#475569",
          maxWidth: 520, margin: "0 auto 48px",
          lineHeight: 1.75,
        }}>
          The smartest AI assistant on the Base blockchain.
          Real-time prices, DeFi data, trending tokens, gas tracker,
          and deep crypto knowledge — all powered by{" "}
          <span style={{ color: "#38bdf8", fontWeight: 600 }}>$BMIND</span>.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/chat" style={{
            padding: isMobile ? "13px 28px" : "15px 36px",
            background: "linear-gradient(135deg, #1d6fd8, #38bdf8)",
            borderRadius: 40, color: "#fff", fontWeight: 700,
            fontSize: isMobile ? 15 : 17, textDecoration: "none",
            boxShadow: "0 8px 40px #1d6fd850",
            display: "inline-block",
          }}>
            Start Chatting Free →
          </Link>
        </div>
      </section>

      {/* LIVE DATA BADGE ROW */}
      <div style={{
        display: "flex", justifyContent: "center", gap: 8,
        flexWrap: "wrap", padding: "0 20px 60px",
      }}>
        {["Live Prices", "DEX Data", "Gas Tracker", "Trending Coins", "Fear & Greed", "Crypto News"].map(tag => (
          <span key={tag} style={{
            padding: "5px 14px", background: "#0d0d1a",
            border: "1px solid #1a1a30", borderRadius: 99,
            fontSize: 12, color: "#475569", letterSpacing: "0.3px",
          }}>{tag}</span>
        ))}
      </div>

      {/* FEATURES GRID */}
      <section style={{ padding: isMobile ? "0 16px 70px" : "0 40px 90px", maxWidth: 1100, margin: "0 auto" }}>
        <h2 style={{
          textAlign: "center", fontSize: isMobile ? 24 : 32,
          fontWeight: 800, marginBottom: 10, letterSpacing: "-0.5px",
        }}>
          Live Intelligence, Built In
        </h2>
        <p style={{ textAlign: "center", color: "#334155", marginBottom: 40, fontSize: 15 }}>
          No hallucinated prices. Real data, injected in real time.
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
          gap: 12,
        }}>
          {FEATURES.map(f => (
            <div key={f.title} style={{
              background: "#0c0c18", border: "1px solid #141424",
              borderRadius: 16, padding: isMobile ? "16px 14px" : "22px 20px",
            }}>
              <div style={{ fontSize: isMobile ? 22 : 26, marginBottom: 10 }}>{f.icon}</div>
              <h3 style={{ fontWeight: 700, fontSize: isMobile ? 13 : 14, marginBottom: 6, color: "#e2e8f0" }}>
                {f.title}
              </h3>
              <p style={{ color: "#374151", fontSize: isMobile ? 11.5 : 13, lineHeight: 1.6 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* TOKEN SECTION */}
      <section style={{
        textAlign: "center",
        padding: isMobile ? "50px 20px" : "70px 24px",
        background: "linear-gradient(180deg, transparent, #0a0a1a 40%, transparent)",
      }}>
        <div style={{
          display: "inline-block", padding: "4px 14px",
          background: "#0d0d1a", border: "1px solid #1a1a30",
          borderRadius: 99, fontSize: 12, color: "#38bdf8",
          marginBottom: 20, letterSpacing: "1px",
        }}>
          $BMIND · BASE BLOCKCHAIN
        </div>
        <h2 style={{ fontSize: isMobile ? 24 : 32, fontWeight: 800, marginBottom: 14 }}>
          The Token Behind the AI
        </h2>
        <p style={{
          color: "#374151", maxWidth: 480, margin: "0 auto 40px",
          fontSize: 15, lineHeight: 1.75,
        }}>
          BasedMind is a utility meme coin on Base. This app is the product.
          The AI is the utility. $BMIND holders own a piece of the future of crypto AI.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { value: "Base", label: "Blockchain" },
            { value: "EVM", label: "Compatible" },
            { value: "<$0.01", label: "Gas per tx" },
            { value: "Free", label: "AI Access" },
          ].map(s => (
            <div key={s.label} style={{
              padding: "16px 24px", background: "#0c0c18",
              border: "1px solid #141424", borderRadius: 14, minWidth: 90,
            }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#38bdf8" }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "#374151", marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{
        padding: isMobile ? "50px 20px" : "70px 40px",
        textAlign: "center",
      }}>
        <div style={{
          maxWidth: 600, margin: "0 auto",
          padding: isMobile ? "36px 24px" : "52px 48px",
          background: "linear-gradient(135deg, #0d1a30, #0a1220)",
          border: "1px solid #1a2a40",
          borderRadius: 24,
          boxShadow: "0 0 80px #1d6fd820",
        }}>
          <div style={{ marginBottom: 20, filter: "drop-shadow(0 0 20px #1d6fd860)" }}>
            <Logo size={52} />
          </div>
          <h2 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 800, marginBottom: 10 }}>
            Ready to go Based?
          </h2>
          <p style={{ color: "#374151", marginBottom: 28, fontSize: 15 }}>
            Ask BasedMind anything — crypto, DeFi, prices, code, or life.
          </p>
          <Link href="/chat" style={{
            padding: "14px 36px",
            background: "linear-gradient(135deg, #1d6fd8, #38bdf8)",
            borderRadius: 40, color: "#fff", fontWeight: 700,
            fontSize: 16, textDecoration: "none",
            display: "inline-block",
            boxShadow: "0 6px 30px #1d6fd850",
          }}>
            Launch BasedMind AI →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        padding: isMobile ? "20px 18px" : "24px 40px",
        borderTop: "1px solid #0e0e1a",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Logo size={20} />
          <span style={{ fontSize: 12, color: "#1e1e2e" }}>
            BasedMind · $BMIND on Base · AI for Crypto
          </span>
        </div>
        <Link href="/chat" style={{ fontSize: 13, color: "#1d6fd8", textDecoration: "none" }}>
          Launch App →
        </Link>
      </footer>
    </div>
  );
}
