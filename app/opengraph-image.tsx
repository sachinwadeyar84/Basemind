import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "SolAI — AI for Solana Crypto";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#050509",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          position: "relative",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {/* Purple glow */}
        <div style={{
          position: "absolute", top: 0, left: 0,
          width: "500px", height: "500px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(153,69,255,0.25) 0%, transparent 70%)",
          display: "flex",
        }} />
        {/* Green glow */}
        <div style={{
          position: "absolute", bottom: 0, right: 0,
          width: "400px", height: "400px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(20,241,149,0.15) 0%, transparent 70%)",
          display: "flex",
        }} />

        {/* Top border */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "3px",
          background: "linear-gradient(90deg,#9945FF,#6E7BFF,#14F195)",
          display: "flex",
        }} />

        {/* Logo circle */}
        <div style={{
          width: "110px", height: "110px", borderRadius: "28px",
          background: "#0D0B21",
          border: "2px solid rgba(153,69,255,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: "32px",
          boxShadow: "0 0 40px rgba(153,69,255,0.3)",
        }}>
          <div style={{
            fontSize: "64px",
            display: "flex",
          }}>◎</div>
        </div>

        {/* Title */}
        <div style={{
          fontSize: "88px", fontWeight: 900,
          letterSpacing: "-4px", lineHeight: 1,
          marginBottom: "16px",
          display: "flex",
        }}>
          <span style={{ color: "#ffffff" }}>Sol</span>
          <span style={{ color: "#14F195" }}>AI</span>
        </div>

        {/* Subtitle */}
        <div style={{
          fontSize: "28px", color: "#6b7280", fontWeight: 400,
          marginBottom: "48px",
          display: "flex",
        }}>
          AI built for Solana degens
        </div>

        {/* Feature pills */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {[
            { label: "🚨 Rug Detector", bg: "rgba(153,69,255,0.15)", border: "rgba(153,69,255,0.4)", color: "#a78bfa" },
            { label: "💎 Gem Finder",   bg: "rgba(20,241,149,0.12)", border: "rgba(20,241,149,0.4)", color: "#14F195" },
            { label: "🐦 KOL Scorer",   bg: "rgba(56,189,248,0.12)", border: "rgba(56,189,248,0.4)", color: "#38bdf8" },
            { label: "🎮 Degen Arena",  bg: "rgba(251,191,36,0.12)", border: "rgba(251,191,36,0.4)", color: "#fbbf24" },
          ].map(p => (
            <div key={p.label} style={{
              padding: "10px 22px", borderRadius: "99px",
              background: p.bg, border: `1.5px solid ${p.border}`,
              color: p.color, fontSize: "18px", fontWeight: 600,
              display: "flex",
            }}>
              {p.label}
            </div>
          ))}
        </div>

        {/* URL bottom right */}
        <div style={{
          position: "absolute", bottom: "48px", right: "80px",
          fontSize: "22px", color: "#374151", fontWeight: 500,
          display: "flex",
        }}>
          mysolai.vercel.app
        </div>

        {/* Bottom border */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "3px",
          background: "linear-gradient(90deg,#9945FF,#6E7BFF,#14F195)",
          display: "flex",
        }} />
      </div>
    ),
    { ...size }
  );
}
