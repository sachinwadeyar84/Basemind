"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Logo from "@/components/Logo";

const POWER_FEATURES = [
  {
    icon: "🚨",
    title: "Rug Detector",
    badge: "NEW",
    badgeColor: "#f87171",
    desc: "Paste any Solana CA — get instant Real or Fake verdict from 3 sources: GoPlus, RugCheck.xyz + DEX Screener.",
    prompt: "45Kt1mykq7kQWq2kLs1mfEHJmDLiiTk2rFKvkYX9pump",
    cta: "Scan a Token →",
    glow: "#f87171",
  },
  {
    icon: "🎮",
    title: "Degen Arena",
    badge: "GAME",
    badgeColor: "#9945FF",
    desc: "Guess if trending Solana tokens went UP or DOWN. Beat the clock, build streaks, earn your rank.",
    prompt: null,
    cta: "Play Now →",
    glow: "#9945FF",
    isGame: true,
  },
  {
    icon: "🐦",
    title: "KOL Analyzer",
    badge: "NEW",
    badgeColor: "#38bdf8",
    desc: "Drop any Twitter/X handle — get a KOL Score 0–100, engagement rate, follower quality, and community trust rating.",
    prompt: "analyze @ansemweb3 kol score",
    cta: "Analyze a KOL →",
    glow: "#38bdf8",
  },
  {
    icon: "💎",
    title: "New Gem Finder",
    badge: "LIVE",
    badgeColor: "#14F195",
    desc: "Real-time new Solana token launches filtered for liquidity and volume. Catch gems before they pump.",
    prompt: "find new gems on solana",
    cta: "Find Gems →",
    glow: "#14F195",
  },
  {
    icon: "🔥",
    title: "Trending Tokens",
    badge: "LIVE",
    badgeColor: "#fbbf24",
    desc: "What's pumping on Solana right now? Live trending pools from GeckoTerminal with volume and price action.",
    prompt: "what's trending on solana right now",
    cta: "See Trending →",
    glow: "#fbbf24",
  },
  {
    icon: "🧠",
    title: "Meme Coin Analyst",
    badge: "AI",
    badgeColor: "#a78bfa",
    desc: "20-year veteran crypto analysis on any meme coin. Narrative, tokenomics, on-chain health, and a brutally honest verdict.",
    prompt: "analyze BONK as a veteran meme coin trader",
    cta: "Get Analysis →",
    glow: "#a78bfa",
  },
];

const STATS = [
  { value: "Solana", label: "Blockchain" },
  { value: "Free",   label: "AI Access" },
  { value: "3",      label: "Rug Check APIs" },
  { value: "10+",    label: "Live Data Sources" },
];

const BADGES = ["🚨 Rug Detector", "🎮 Degen Arena", "🐦 KOL Score", "💎 New Gems", "🔥 Trending", "📊 DEX Data", "😱 Fear & Greed", "📰 Crypto News"];

export default function LandingPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

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
          {!isMobile && <a href="#features" style={{ fontSize: 13, color: "#6b7280", textDecoration: "none" }}>Features</a>}
          {!isMobile && <a href="#token" style={{ fontSize: 13, color: "#6b7280", textDecoration: "none", marginRight: 8 }}>Token</a>}
          <Link href="/chat" style={{
            padding: isMobile ? "8px 18px" : "9px 22px",
            background: "linear-gradient(135deg,#9945FF,#14F195)",
            borderRadius: 40, color: "#fff", fontWeight: 700,
            fontSize: 13, textDecoration: "none",
            boxShadow: "0 4px 16px rgba(153,69,255,0.35)",
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
        <div style={{
          position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)",
          width: 600, height: 400, borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(153,69,255,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{
          marginBottom: 36, position: "relative", zIndex: 1,
          filter: "drop-shadow(0 0 40px rgba(153,69,255,0.4)) drop-shadow(0 0 80px rgba(20,241,149,0.15))",
        }}>
          <Logo size={isMobile ? 120 : 160} />
        </div>

        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "5px 14px", borderRadius: 99,
          background: "rgba(153,69,255,0.08)", border: "1px solid rgba(153,69,255,0.2)",
          fontSize: 12, color: "#a78bfa", letterSpacing: "0.5px", marginBottom: 22,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#14F195", display: "inline-block" }} />
          AI FOR SOLANA · $SMAI
        </div>

        <h1 style={{
          fontSize: isMobile ? 40 : 72, fontWeight: 900,
          letterSpacing: isMobile ? "-1.5px" : "-3px",
          lineHeight: 1.0, marginBottom: 22, position: "relative", zIndex: 1,
        }}>
          <span style={{ color: "#fff" }}>The Smartest AI</span>
          <br />
          <span style={{
            background: "linear-gradient(135deg,#9945FF 0%,#6E7BFF 50%,#14F195 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            on Solana
          </span>
        </h1>

        <p style={{
          fontSize: isMobile ? 15 : 18, color: "#6b7280",
          maxWidth: 540, lineHeight: 1.75, marginBottom: 44, position: "relative", zIndex: 1,
        }}>
          Rug detection, KOL scoring, gem finding, price prediction game, meme coin analysis — all powered by live Solana data and AI.
        </p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", position: "relative", zIndex: 1 }}>
          <Link href="/chat" style={{
            padding: isMobile ? "13px 28px" : "15px 36px",
            background: "linear-gradient(135deg,#9945FF,#14F195)",
            borderRadius: 40, color: "#fff", fontWeight: 700,
            fontSize: isMobile ? 15 : 17, textDecoration: "none",
            boxShadow: "0 8px 40px rgba(153,69,255,0.4)",
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

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginTop: 48, position: "relative", zIndex: 1 }}>
          {BADGES.map(tag => (
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
            padding: "24px 20px", textAlign: "center", background: "#070711",
            borderRight: i < STATS.length - 1 && !isMobile ? "1px solid rgba(255,255,255,0.04)" : "none",
          }}>
            <div style={{ fontSize: isMobile ? 20 : 24, fontWeight: 900, color: "#14F195", letterSpacing: "-0.5px" }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "#374151", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── POWER FEATURES ── */}
      <section id="features" style={{ padding: isMobile ? "0 16px 80px" : "0 48px 100px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: isMobile ? 26 : 38, fontWeight: 800, letterSpacing: "-1px", marginBottom: 12 }}>
            What SolAI Can Do
          </h2>
          <p style={{ color: "#4b5563", fontSize: 15 }}>Six powerful tools. All free. All powered by live Solana data.</p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
          gap: 14,
        }}>
          {POWER_FEATURES.map((f, i) => (
            <div
              key={f.title}
              onMouseEnter={() => setHoveredCard(i)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                background: "#070711",
                border: `1px solid ${hoveredCard === i ? f.glow + "44" : "rgba(255,255,255,0.05)"}`,
                borderRadius: 20,
                padding: isMobile ? "22px 18px" : "28px 24px",
                transition: "all 0.2s",
                boxShadow: hoveredCard === i ? `0 0 30px ${f.glow}18` : "none",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Glow blob on hover */}
              {hoveredCard === i && (
                <div style={{
                  position: "absolute", top: -40, right: -40,
                  width: 120, height: 120, borderRadius: "50%",
                  background: `radial-gradient(circle, ${f.glow}20 0%, transparent 70%)`,
                  pointerEvents: "none",
                }} />
              )}

              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <span style={{ fontSize: 30 }}>{f.icon}</span>
                <span style={{
                  fontSize: 10, fontWeight: 800, letterSpacing: "0.5px",
                  padding: "3px 9px", borderRadius: 99,
                  background: f.badgeColor + "22",
                  color: f.badgeColor,
                  border: `1px solid ${f.badgeColor}44`,
                }}>{f.badge}</span>
              </div>

              <h3 style={{ fontWeight: 800, fontSize: 16, marginBottom: 10, color: "#e2e8f0" }}>{f.title}</h3>
              <p style={{ color: "#374151", fontSize: 13, lineHeight: 1.7, marginBottom: 18 }}>{f.desc}</p>

              {f.isGame ? (
                <Link href="/chat" style={{
                  display: "inline-block",
                  padding: "9px 18px", borderRadius: 10,
                  background: `linear-gradient(135deg,#9945FF,#14F195)`,
                  color: "#fff", fontWeight: 700, fontSize: 13,
                  textDecoration: "none",
                }}>
                  {f.cta}
                </Link>
              ) : (
                <Link
                  href={`/chat?q=${encodeURIComponent(f.prompt ?? "")}`}
                  style={{
                    display: "inline-block",
                    padding: "9px 18px", borderRadius: 10,
                    background: `${f.glow}18`,
                    border: `1px solid ${f.glow}44`,
                    color: f.glow, fontWeight: 700, fontSize: 13,
                    textDecoration: "none",
                    transition: "all 0.15s",
                  }}
                >
                  {f.cta}
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{
        padding: isMobile ? "60px 20px" : "80px 48px",
        background: "linear-gradient(180deg, transparent, rgba(153,69,255,0.04), transparent)",
        textAlign: "center",
      }}>
        <h2 style={{ fontSize: isMobile ? 24 : 34, fontWeight: 800, marginBottom: 12, letterSpacing: "-0.5px" }}>
          How It Works
        </h2>
        <p style={{ color: "#4b5563", marginBottom: 48, fontSize: 15 }}>Three steps to smarter Solana decisions</p>
        <div style={{
          display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
          gap: 16, maxWidth: 820, margin: "0 auto",
        }}>
          {[
            { step: "01", title: "Ask or paste a CA", desc: "Type a question, paste a Solana contract address, drop a Twitter handle, or ask what's trending." },
            { step: "02", title: "Live data fetched", desc: "SolAI auto-detects what you need and hits 10+ APIs — DEX Screener, GoPlus, RugCheck, GeckoTerminal — in real time." },
            { step: "03", title: "Veteran AI verdict", desc: "Get a clear answer with real numbers, rug scores, KOL ratings, and honest analysis. No hallucinations." },
          ].map(item => (
            <div key={item.step} style={{
              background: "#070711", border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: 20, padding: "32px 24px",
            }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#9945FF", letterSpacing: "2px", marginBottom: 16 }}>{item.step}</div>
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
          background: "linear-gradient(135deg,#07090d,#070714)",
          border: "1px solid rgba(153,69,255,0.15)",
          borderRadius: 28, padding: isMobile ? "40px 24px" : "60px 48px",
          boxShadow: "0 0 100px rgba(153,69,255,0.08)",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: -60, right: -60,
            width: 200, height: 200, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(153,69,255,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
            <Logo size={72} />
          </div>

          <div style={{
            display: "inline-block", padding: "4px 14px",
            background: "rgba(153,69,255,0.1)", border: "1px solid rgba(153,69,255,0.2)",
            borderRadius: 99, fontSize: 11.5, color: "#a78bfa",
            marginBottom: 20, letterSpacing: "1px",
          }}>
            $SMAI · SOLANA BLOCKCHAIN
          </div>

          <h2 style={{ fontSize: isMobile ? 24 : 30, fontWeight: 800, marginBottom: 14, letterSpacing: "-0.5px" }}>
            The Token Behind the AI
          </h2>
          <p style={{ color: "#4b5563", fontSize: 15, lineHeight: 1.8, marginBottom: 36 }}>
            SolAI is an AI-powered product on the <strong style={{ color: "#9ca3af" }}>Solana blockchain</strong>.
            This app <strong style={{ color: "#9ca3af" }}>is</strong> the utility — rug detection, KOL scoring, gem finding, and a price prediction game built for degens.
          </p>

          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 36 }}>
            {[
              { k: "Chain", v: "Solana" },
              { k: "Gas", v: "<$0.01" },
              { k: "Token", v: "$SMAI" },
              { k: "AI", v: "Free Access" },
            ].map(item => (
              <div key={item.k} style={{
                padding: "12px 20px", background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14,
              }}>
                <div style={{ fontSize: 17, fontWeight: 800, color: "#14F195" }}>{item.v}</div>
                <div style={{ fontSize: 11, color: "#374151", marginTop: 2 }}>{item.k}</div>
              </div>
            ))}
          </div>

          <Link href="/chat" style={{
            padding: "14px 36px",
            background: "linear-gradient(135deg,#9945FF,#14F195)",
            borderRadius: 40, color: "#fff", fontWeight: 700,
            fontSize: 16, textDecoration: "none", display: "inline-block",
            boxShadow: "0 6px 30px rgba(153,69,255,0.35)",
          }}>
            Launch SolAI →
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
        <Link href="/chat" style={{ fontSize: 13, color: "#9945FF", textDecoration: "none" }}>Launch App →</Link>
      </footer>
    </div>
  );
}
