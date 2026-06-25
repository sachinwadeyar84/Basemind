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
        {/* Glow blobs */}
        <div style={{ position: "absolute", top: "-100px", left: "-100px", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(153,69,255,0.3) 0%, transparent 65%)", display: "flex" }} />
        <div style={{ position: "absolute", bottom: "-80px", right: "200px", width: "400px", height: "400px", borderRadius: "radial-gradient(circle, rgba(20,241,149,0.2) 0%, transparent 65%)", display: "flex" }} />

        {/* Top + bottom border */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: "linear-gradient(90deg,#9945FF,#6E7BFF,#14F195)", display: "flex" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "4px", background: "linear-gradient(90deg,#9945FF,#6E7BFF,#14F195)", display: "flex" }} />

        {/* ── Logo (left) ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative", width: "280px", height: "280px", flexShrink: 0 }}>
          {/* Outer rings */}
          <div style={{ position: "absolute", width: "278px", height: "278px", borderRadius: "50%", border: "2px solid rgba(153,69,255,0.25)", display: "flex" }} />
          <div style={{ position: "absolute", width: "256px", height: "256px", borderRadius: "50%", border: "1px solid rgba(20,241,149,0.2)", display: "flex" }} />

          {/* Core */}
          <div style={{
            width: "210px", height: "210px", borderRadius: "50%",
            background: "linear-gradient(135deg,#1a0533,#0a1f12)",
            border: "3px solid rgba(153,69,255,0.6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative",
            boxShadow: "0 0 60px rgba(153,69,255,0.5), inset 0 0 40px rgba(153,69,255,0.1)",
          }}>
            {/* S shape */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: "76px", height: "42px", borderRadius: "38px 38px 0 0", border: "8px solid #9945FF", borderBottom: "none", display: "flex" }} />
              <div style={{ width: "76px", height: "10px", background: "linear-gradient(90deg,#9945FF,#14F195)", display: "flex" }} />
              <div style={{ width: "76px", height: "42px", borderRadius: "0 0 38px 38px", border: "8px solid #14F195", borderTop: "none", display: "flex" }} />
            </div>
            {/* Node dots */}
            <div style={{ position: "absolute", top: "26px", right: "28px", width: "13px", height: "13px", borderRadius: "50%", background: "#9945FF", boxShadow: "0 0 12px #9945FF", display: "flex" }} />
            <div style={{ position: "absolute", bottom: "26px", left: "28px", width: "13px", height: "13px", borderRadius: "50%", background: "#14F195", boxShadow: "0 0 12px #14F195", display: "flex" }} />
          </div>

          {/* Orbit dots */}
          <div style={{ position: "absolute", top: "12px", left: "50%", width: "9px", height: "9px", borderRadius: "50%", background: "#9945FF", boxShadow: "0 0 8px #9945FF", display: "flex" }} />
          <div style={{ position: "absolute", bottom: "18px", right: "18px", width: "7px", height: "7px", borderRadius: "50%", background: "#14F195", boxShadow: "0 0 8px #14F195", display: "flex" }} />
          <div style={{ position: "absolute", left: "8px", top: "45%", width: "6px", height: "6px", borderRadius: "50%", background: "#6E7BFF", display: "flex" }} />
        </div>

        {/* ── Text (right) ── */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, paddingLeft: "56px" }}>

          {/* Badge */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "18px", background: "rgba(153,69,255,0.12)", border: "1px solid rgba(153,69,255,0.35)", borderRadius: "99px", padding: "6px 18px", width: "fit-content" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#14F195", boxShadow: "0 0 6px #14F195", display: "flex" }} />
            <span style={{ color: "#a78bfa", fontSize: "15px", fontWeight: 700, letterSpacing: "1px" }}>AI FOR SOLANA · $SMAI</span>
          </div>

          {/* SolAI */}
          <div style={{ display: "flex", fontSize: "90px", fontWeight: 900, letterSpacing: "-3px", lineHeight: 1, marginBottom: "10px" }}>
            <span style={{ color: "#ffffff" }}>Sol</span>
            <span style={{ color: "#14F195" }}>AI</span>
          </div>

          <div style={{ fontSize: "23px", color: "#6b7280", marginBottom: "36px", display: "flex" }}>
            AI built for Solana degens
          </div>

          {/* Pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {[
              ["🚨 Rug Detector",  "rgba(248,113,113,0.12)", "rgba(248,113,113,0.4)", "#f87171"],
              ["💎 Gem Finder",    "rgba(20,241,149,0.12)",  "rgba(20,241,149,0.4)",  "#14F195"],
              ["🐦 KOL Scorer",    "rgba(56,189,248,0.12)",  "rgba(56,189,248,0.4)",  "#38bdf8"],
              ["🎮 Degen Arena",   "rgba(153,69,255,0.12)",  "rgba(153,69,255,0.4)",  "#a78bfa"],
            ].map(([label, bg, border, color]) => (
              <div key={label} style={{ padding: "10px 20px", borderRadius: "99px", background: bg, border: `1.5px solid ${border}`, color, fontSize: "17px", fontWeight: 700, display: "flex" }}>
                {label}
              </div>
            ))}
          </div>

          <div style={{ marginTop: "28px", fontSize: "19px", color: "#374151", display: "flex" }}>
            mysolai.vercel.app
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
