"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Logo from "@/components/Logo";

const FEATURES = [
  { icon: "📈", title: "Live Token Prices", desc: "Real-time prices for any coin — Bitcoin, ETH, meme coins — straight from CoinGecko." },
  { icon: "🔍", title: "DEX Screener", desc: "Paste any contract address to instantly get price, volume, liquidity, and market cap." },
  { icon: "🏦", title: "DeFi TVL Rankings", desc: "Total value locked on Solana and every major chain, live from DeFiLlama." },
  { icon: "😱", title: "Fear & Greed Index", desc: "Real-time market sentiment score — know if crypto is panicking or greedy before you trade." },
  { icon: "⛽", title: "ETH Gas Tracker", desc: "Live Ethereum gas prices — slow, normal, fast — before any on-chain transaction." },
  { icon: "🔥", title: "Trending Tokens", desc: "See what's pumping on CoinGecko right now. Coins, NFTs, and top movers." },
  { icon: "📰", title: "Crypto News", desc: "Latest headlines fetched live so you never miss a market-moving announcement." },
  { icon: "🧠", title: "Deep AI Knowledge", desc: "Expert-level answers on Solana, DeFi, trading, meme coins, pump.fun, and everything crypto." },
];

const STATS = [
  { value: "Base", label: "Blockchain" },
  { value: "Free", label: "AI Access" },
  { value: "<$0.01", label: "Gas per tx" },
  { value: "8+", label: "Live APIs" },
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
    <div style={{ background: "#050509", minHeight: "100vh", color: "#fff", fontFamily: "Inter, sans-serif", overflowX: "hidden" }}>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: isMobile ? "12px 18px" : "14px 48px",
        background: "rgba(5,5,9,0.85)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Logo size={36} />
          <span style={{ fontWeight: 800, fontSize: 16, color: "#fff", letterSpacing: "-0.3px" }}>SolAI</span>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {!isMobile && (
            <a href="#features" style={{ fontSize: 13, color: "#6b7280", textDecoration: "none" }}>Features</a>
          )}
          {!isMobile && (
            <a href="#token" style={{ fontSize: 13, color: "#6b7280", textDecoration: "none", marginRight: 8 }}>Token</a>
          )}
          <Link href="/chat" style={{
            padding: isMobile ? "8px 18px" : "9px 22px",
            background: "linear-gradient(135deg, #1a5fb4, #2196f3)",
            borderRadius: 40, color: "#fff", fontWeight: 700,
            fontSize: 13, textDecoration: "none",
            boxShadow: "0 4px 16px rgba(33,150,243,0.35)",
          }}>
            Launch App →
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        textAlign: "center",
        padding: isMobile ? "64px 20px 56px" : "100px 24px 80px",
        position: "relative",
      }}>
        {/* Glow blob */}
        <div style={{
          position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)",
          width: 600, height: 400, borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(29,111,216,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* Logo */}
        <div style={{
          marginBottom: 36, position: "relative", zIndex: 1,
          filter: "drop-shadow(0 0 40px rgba(153,69,255,0.4)) drop-shadow(0 0 80px rgba(20,241,149,0.15))",
        }}>
          <Logo size={isMobile ? 120 : 160} />
        </div>

        {/* Tag */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "5px 14px", borderRadius: 99,
          background: "rgba(33,150,243,0.08)", border: "1px solid rgba(33,150,243,0.2)",
          fontSize: 12, color: "#60a5fa", letterSpacing: "0.5px", marginBottom: 22,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22d3ee", display: "inline-block" }} />
          AI FOR SOLANA · $SMAI
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: isMobile ? 40 : 72, fontWeight: 900,
          letterSpacing: isMobile ? "-1.5px" : "-3px",
          lineHeight: 1.0, marginBottom: 22, position: "relative", zIndex: 1,
        }}>
          <span style={{ color: "#fff" }}>The Smartest AI</span>
          <br />
          <span style={{
            background: "linear-gradient(135deg, #2196f3 0%, #38bdf8 50%, #67e8f9 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            on Solana
          </span>
        </h1>

        <p style={{
          fontSize: isMobile ? 15 : 18, color: "#6b7280",
          maxWidth: 540, lineHeight: 1.75, marginBottom: 44, position: "relative", zIndex: 1,
        }}>
          Real-time crypto prices, DeFi data, DEX analytics, gas tracker, trending tokens, and expert AI answers — all in one place.
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", position: "relative", zIndex: 1 }}>
          <Link href="/chat" style={{
            padding: isMobile ? "13px 28px" : "15px 36px",
            background: "linear-gradient(135deg, #1a5fb4, #2196f3)",
            borderRadius: 40, color: "#fff", fontWeight: 700,
            fontSize: isMobile ? 15 : 17, textDecoration: "none",
            boxShadow: "0 8px 40px rgba(33,150,243,0.4)",
            display: "inline-block",
          }}>
            Start Chatting Free →
          </Link>
          <a href="#features" style={{
            padding: isMobile ? "13px 28px" : "15px 36px",
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 40, color: "#9ca3af", fontWeight: 600,
            fontSize: isMobile ? 15 : 17, textDecoration: "none",
            display: "inline-block",
          }}>
            See Features ↓
          </a>
        </div>

        {/* Live badges */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginTop: 48, position: "relative", zIndex: 1 }}>
          {["🔴 Live Prices", "📊 DEX Data", "⛽ Gas Tracker", "🔥 Trending", "😱 Fear & Greed", "📰 Crypto News"].map(tag => (
            <span key={tag} style={{
              padding: "5px 13px", background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)", borderRadius: 99,
              fontSize: 11.5, color: "#4b5563",
            }}>{tag}</span>
          ))}
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div style={{
        maxWidth: 800, margin: "0 auto 80px",
        display: "grid", gridTemplateColumns: `repeat(${isMobile ? 2 : 4}, 1fr)`,
        gap: 1, background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, overflow: "hidden",
        marginLeft: isMobile ? 16 : "auto", marginRight: isMobile ? 16 : "auto",
      }}>
        {STATS.map((s, i) => (
          <div key={s.label} style={{
            padding: "24px 20px", textAlign: "center",
            background: "#070711",
            borderRight: i < STATS.length - 1 && !isMobile ? "1px solid rgba(255,255,255,0.04)" : "none",
          }}>
            <div style={{ fontSize: isMobile ? 22 : 26, fontWeight: 900, color: "#38bdf8", letterSpacing: "-0.5px" }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "#374151", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: isMobile ? "0 16px 80px" : "0 48px 100px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: isMobile ? 26 : 38, fontWeight: 800, letterSpacing: "-1px", marginBottom: 12 }}>
            Live Intelligence, Built In
          </h2>
          <p style={{ color: "#4b5563", fontSize: 15 }}>No hallucinated prices. Real data, injected in real time.</p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
          gap: 10,
        }}>
          {FEATURES.map(f => (
            <div key={f.title} style={{
              background: "#070711",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: 18, padding: isMobile ? "18px 14px" : "24px 20px",
              transition: "border-color 0.2s",
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(33,150,243,0.3)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)")}
            >
              <div style={{ fontSize: isMobile ? 22 : 28, marginBottom: 12 }}>{f.icon}</div>
              <h3 style={{ fontWeight: 700, fontSize: isMobile ? 12.5 : 14, marginBottom: 8, color: "#e2e8f0" }}>{f.title}</h3>
              <p style={{ color: "#374151", fontSize: isMobile ? 11 : 13, lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{
        padding: isMobile ? "60px 20px" : "80px 48px",
        background: "linear-gradient(180deg, transparent, rgba(29,111,216,0.04), transparent)",
        textAlign: "center",
      }}>
        <h2 style={{ fontSize: isMobile ? 24 : 34, fontWeight: 800, marginBottom: 12, letterSpacing: "-0.5px" }}>
          How It Works
        </h2>
        <p style={{ color: "#4b5563", marginBottom: 48, fontSize: 15 }}>Three steps to smarter crypto decisions</p>
        <div style={{
          display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
          gap: 16, maxWidth: 820, margin: "0 auto",
        }}>
          {[
            { step: "01", title: "Ask anything", desc: "Type any question — a price, a contract address, market sentiment, gas fees, or just \"what's trending?\"" },
            { step: "02", title: "Live data fetched", desc: "SolAI automatically detects what data you need and fetches it from 8+ live APIs in real time." },
            { step: "03", title: "Smart AI answer", desc: "You get a clear, accurate response with real numbers — not outdated training data." },
          ].map(item => (
            <div key={item.step} style={{
              background: "#070711", border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: 20, padding: "32px 24px",
            }}>
              <div style={{
                fontSize: 11, fontWeight: 800, color: "#2196f3",
                letterSpacing: "2px", marginBottom: 16,
              }}>{item.step}</div>
              <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 10 }}>{item.title}</h3>
              <p style={{ color: "#374151", fontSize: 13.5, lineHeight: 1.7 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TOKEN ── */}
      <section id="token" style={{ padding: isMobile ? "60px 20px" : "80px 48px", textAlign: "center" }}>
        <div style={{
          maxWidth: 680, margin: "0 auto",
          background: "linear-gradient(135deg, #070d1a, #070714)",
          border: "1px solid rgba(33,150,243,0.15)",
          borderRadius: 28, padding: isMobile ? "40px 24px" : "60px 48px",
          boxShadow: "0 0 100px rgba(29,111,216,0.1)",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: -60, right: -60,
            width: 200, height: 200, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(33,150,243,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
            <Logo size={72} />
          </div>

          <div style={{
            display: "inline-block", padding: "4px 14px",
            background: "rgba(33,150,243,0.1)", border: "1px solid rgba(33,150,243,0.2)",
            borderRadius: 99, fontSize: 11.5, color: "#60a5fa",
            marginBottom: 20, letterSpacing: "1px",
          }}>
            $SMAI · SOLANA BLOCKCHAIN
          </div>

          <h2 style={{ fontSize: isMobile ? 24 : 30, fontWeight: 800, marginBottom: 14, letterSpacing: "-0.5px" }}>
            The Token Behind the AI
          </h2>
          <p style={{ color: "#4b5563", fontSize: 15, lineHeight: 1.8, marginBottom: 36 }}>
            SolAI is an AI-powered meme coin on the Base blockchain.
            This app <strong style={{ color: "#9ca3af" }}>is</strong> the product — the AI is the utility.
            Built on Coinbase&apos;s Base L2 with EVM compatibility and gas fees under $0.01.
          </p>

          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 36 }}>
            {[
              { k: "Chain", v: "Base (L2)" },
              { k: "Gas", v: "<$0.01" },
              { k: "EVM", v: "Compatible" },
              { k: "AI", v: "Free Access" },
            ].map(item => (
              <div key={item.k} style={{
                padding: "12px 20px", background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14,
              }}>
                <div style={{ fontSize: 17, fontWeight: 800, color: "#38bdf8" }}>{item.v}</div>
                <div style={{ fontSize: 11, color: "#374151", marginTop: 2 }}>{item.k}</div>
              </div>
            ))}
          </div>

          <Link href="/chat" style={{
            padding: "14px 36px",
            background: "linear-gradient(135deg, #1a5fb4, #2196f3)",
            borderRadius: 40, color: "#fff", fontWeight: 700,
            fontSize: 16, textDecoration: "none", display: "inline-block",
            boxShadow: "0 6px 30px rgba(33,150,243,0.35)",
          }}>
            Launch SolAI AI →
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        padding: isMobile ? "24px 18px" : "28px 48px",
        borderTop: "1px solid rgba(255,255,255,0.04)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Logo size={28} />
          <span style={{ fontSize: 13, color: "#1f2937" }}>
            SolAI · $SMAI on Solana · AI for Crypto
          </span>
        </div>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <Link href="/chat" style={{ fontSize: 13, color: "#2196f3", textDecoration: "none" }}>Launch App →</Link>
        </div>
      </footer>
    </div>
  );
}
