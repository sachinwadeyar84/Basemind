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
          background: "#06020F",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 80px",
          position: "relative",
          fontFamily: "Arial, sans-serif",
          overflow: "hidden",
        }}
      >
        {/* Background glow blobs */}
        <div style={{ position: "absolute", top: "-100px", left: "-100px", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(153,69,255,0.3) 0%, transparent 65%)", display: "flex" }} />
        <div style={{ position: "absolute", bottom: "-80px", right: "200px", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(20,241,149,0.2) 0%, transparent 65%)", display: "flex" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(110,123,255,0.15) 0%, transparent 65%)", display: "flex" }} />

        {/* Top gradient bar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: "linear-gradient(90deg,#9945FF,#6E7BFF,#14F195)", display: "flex" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "4px", background: "linear-gradient(90deg,#9945FF,#6E7BFF,#14F195)", display: "flex" }} />

        {/* ── LEFT: Brain/AI Logo ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative", width: "300px", height: "300px", flexShrink: 0 }}>

          {/* Outer ring */}
          <div style={{
            position: "absolute", width: "280px", height: "280px", borderRadius: "50%",
            border: "2px solid rgba(153,69,255,0.3)",
            display: "flex",
          }} />
          <div style={{
            position: "absolute", width: "260px", height: "260px", borderRadius: "50%",
            border: "1px solid rgba(20,241,149,0.2)",
            display: "flex",
          }} />

          {/* Core circle — brain background */}
          <div style={{
            width: "220px", height: "220px", borderRadius: "50%",
            background: "linear-gradient(135deg, #1a0533 0%, #0a1f12 100%)",
            border: "3px solid rgba(153,69,255,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative",
            boxShadow: "0 0 60px rgba(153,69,255,0.4), 0 0 120px rgba(153,69,255,0.15)",
          }}>

            {/* Inner S symbol styled as circuit */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              {/* Top arc */}
              <div style={{
                width: "80px", height: "44px", borderRadius: "40px 40px 0 0",
                border: "8px solid #9945FF", borderBottom: "none",
                display: "flex",
              }} />
              {/* Middle connector */}
              <div style={{
                width: "80px", height: "10px",
                background: "linear-gradient(90deg, #9945FF, #14F195)",
                display: "flex",
              }} />
              {/* Bottom arc */}
              <div style={{
                width: "80px", height: "44px", borderRadius: "0 0 40px 40px",
                border: "8px solid #14F195", borderTop: "none",
                display: "flex",
              }} />
            </div>

            {/* Node dots */}
            <div style={{ position: "absolute", top: "28px", right: "30px", width: "14px", height: "14px", borderRadius: "50%", background: "#9945FF", boxShadow: "0 0 12px #9945FF", display: "flex" }} />
            <div style={{ position: "absolute", bottom: "28px", left: "30px", width: "14px", height: "14px", borderRadius: "50%", background: "#14F195", boxShadow: "0 0 12px #14F195", display: "flex" }} />
            <div style={{ position: "absolute", top: "50%", right: "22px", width: "9px", height: "9px", borderRadius: "50%", background: "#6E7BFF", display: "flex" }} />
          </div>

          {/* Orbit dots */}
          <div style={{ position: "absolute", top: "16px", left: "50%", width: "10px", height: "10px", borderRadius: "50%", background: "#9945FF", boxShadow: "0 0 8px #9945FF", display: "flex" }} />
          <div style={{ position: "absolute", bottom: "20px", right: "20px", width: "8px", height: "8px", borderRadius: "50%", background: "#14F195", boxShadow: "0 0 8px #14F195", display: "flex" }} />
          <div style={{ position: "absolute", left: "10px", top: "50%", width: "7px", height: "7px", borderRadius: "50%", background: "#6E7BFF", display: "flex" }} />
        </div>

        {/* ── RIGHT: Text content ── */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, paddingLeft: "60px" }}>

          {/* Badge */}
          <div style={{
            display: "flex", alignItems: "center", gap: "8px",
            marginBottom: "20px",
            background: "rgba(153,69,255,0.12)",
            border: "1px solid rgba(153,69,255,0.35)",
            borderRadius: "99px", padding: "6px 18px",
            width: "fit-content",
          }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#14F195", display: "flex" }} />
            <span style={{ color: "#a78bfa", fontSize: "16px", fontWeight: 700, letterSpacing: "1px" }}>AI FOR SOLANA · $SMAI</span>
          </div>

          {/* Title */}
          <div style={{ display: "flex", fontSize: "86px", fontWeight: 900, letterSpacing: "-3px", lineHeight: 1, marginBottom: "12px" }}>
            <span style={{ color: "#ffffff" }}>Sol</span>
            <span style={{ color: "#14F195" }}>AI</span>
          </div>

          {/* Tagline */}
          <div style={{ fontSize: "24px", color: "#6b7280", fontWeight: 400, marginBottom: "40px", display: "flex" }}>
            AI built for Solana degens
          </div>

          {/* Feature pills — 2x2 grid */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {[
              { label: "🚨 Rug Detector",  bg: "rgba(248,113,113,0.12)", border: "rgba(248,113,113,0.35)", color: "#f87171" },
              { label: "💎 Gem Finder",    bg: "rgba(20,241,149,0.12)",  border: "rgba(20,241,149,0.35)",  color: "#14F195" },
              { label: "🐦 KOL Scorer",    bg: "rgba(56,189,248,0.12)",  border: "rgba(56,189,248,0.35)",  color: "#38bdf8" },
              { label: "🎮 Degen Arena",   bg: "rgba(153,69,255,0.12)",  border: "rgba(153,69,255,0.35)",  color: "#a78bfa" },
            ].map(p => (
              <div key={p.label} style={{
                padding: "10px 20px", borderRadius: "99px",
                background: p.bg, border: `1.5px solid ${p.border}`,
                color: p.color, fontSize: "17px", fontWeight: 700,
                display: "flex",
              }}>
                {p.label}
              </div>
            ))}
          </div>

          {/* URL */}
          <div style={{ marginTop: "32px", fontSize: "20px", color: "#374151", fontWeight: 500, display: "flex" }}>
            mysolai.vercel.app
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
