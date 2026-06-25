import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#06020F",
          width: "1200px",
          height: "630px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 80px",
          position: "relative",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {/* Purple glow */}
        <div style={{ position: "absolute", top: "-80px", left: "-80px", width: "450px", height: "450px", borderRadius: "50%", background: "rgba(153,69,255,0.25)", filter: "blur(80px)", display: "flex" }} />
        {/* Green glow */}
        <div style={{ position: "absolute", bottom: "-60px", right: "150px", width: "350px", height: "350px", borderRadius: "50%", background: "rgba(20,241,149,0.18)", filter: "blur(80px)", display: "flex" }} />

        {/* Top border */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: "linear-gradient(90deg,#9945FF,#6E7BFF,#14F195)", display: "flex" }} />
        {/* Bottom border */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "4px", background: "linear-gradient(90deg,#14F195,#6E7BFF,#9945FF)", display: "flex" }} />

        {/* ── LEFT: Circuit brain logo ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative", width: "270px", height: "270px", flexShrink: 0 }}>
          {/* Outer ring */}
          <div style={{ position: "absolute", width: "270px", height: "270px", borderRadius: "50%", border: "1.5px solid rgba(153,69,255,0.3)", display: "flex" }} />
          <div style={{ position: "absolute", width: "248px", height: "248px", borderRadius: "50%", border: "1px solid rgba(20,241,149,0.2)", display: "flex" }} />

          {/* Core circle */}
          <div style={{
            width: "208px", height: "208px", borderRadius: "50%",
            background: "#150830",
            border: "3px solid #9945FF",
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative",
            boxShadow: "0 0 50px rgba(153,69,255,0.5)",
          }}>
            {/* S circuit */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: "72px", height: "40px", borderRadius: "36px 36px 0 0", border: "9px solid #9945FF", borderBottom: "none", display: "flex" }} />
              <div style={{ width: "72px", height: "9px", background: "linear-gradient(90deg,#9945FF,#14F195)", display: "flex" }} />
              <div style={{ width: "72px", height: "40px", borderRadius: "0 0 36px 36px", border: "9px solid #14F195", borderTop: "none", display: "flex" }} />
            </div>
            {/* Top node */}
            <div style={{ position: "absolute", top: "24px", right: "26px", width: "14px", height: "14px", borderRadius: "50%", background: "#9945FF", boxShadow: "0 0 14px #9945FF", display: "flex" }} />
            {/* Bottom node */}
            <div style={{ position: "absolute", bottom: "24px", left: "26px", width: "14px", height: "14px", borderRadius: "50%", background: "#14F195", boxShadow: "0 0 14px #14F195", display: "flex" }} />
            {/* Mid node */}
            <div style={{ position: "absolute", top: "45%", right: "20px", width: "8px", height: "8px", borderRadius: "50%", background: "#6E7BFF", display: "flex" }} />
          </div>

          {/* Orbit dots */}
          <div style={{ position: "absolute", top: "10px", left: "48%", width: "10px", height: "10px", borderRadius: "50%", background: "#9945FF", boxShadow: "0 0 10px #9945FF", display: "flex" }} />
          <div style={{ position: "absolute", bottom: "16px", right: "16px", width: "8px", height: "8px", borderRadius: "50%", background: "#14F195", boxShadow: "0 0 10px #14F195", display: "flex" }} />
          <div style={{ position: "absolute", left: "6px", top: "44%", width: "7px", height: "7px", borderRadius: "50%", background: "#6E7BFF", display: "flex" }} />
          <div style={{ position: "absolute", top: "20%", left: "14px", width: "5px", height: "5px", borderRadius: "50%", background: "#9945FF", opacity: 0.6, display: "flex" }} />
        </div>

        {/* ── RIGHT: Text ── */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, paddingLeft: "60px" }}>

          {/* Badge */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px", background: "rgba(153,69,255,0.12)", border: "1px solid rgba(153,69,255,0.4)", borderRadius: "99px", padding: "6px 20px", width: "fit-content" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#14F195", display: "flex" }} />
            <span style={{ color: "#a78bfa", fontSize: "15px", fontWeight: 700, letterSpacing: "1px" }}>AI FOR SOLANA · $SMAI</span>
          </div>

          {/* SolAI */}
          <div style={{ display: "flex", alignItems: "baseline", fontSize: "94px", fontWeight: 900, letterSpacing: "-3px", lineHeight: 1, marginBottom: "10px" }}>
            <span style={{ color: "#ffffff" }}>Sol</span>
            <span style={{ color: "#14F195" }}>AI</span>
          </div>

          <div style={{ fontSize: "24px", color: "#555", marginBottom: "38px", display: "flex" }}>
            AI built for Solana degens
          </div>

          {/* Feature pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {[
              { label: "🚨 Rug Detector", color: "#f87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.4)" },
              { label: "💎 Gem Finder",   color: "#14F195", bg: "rgba(20,241,149,0.1)",  border: "rgba(20,241,149,0.4)" },
              { label: "🐦 KOL Scorer",   color: "#38bdf8", bg: "rgba(56,189,248,0.1)",  border: "rgba(56,189,248,0.4)" },
              { label: "🎮 Degen Arena",  color: "#a78bfa", bg: "rgba(153,69,255,0.1)",  border: "rgba(153,69,255,0.4)" },
            ].map(p => (
              <div key={p.label} style={{ padding: "10px 22px", borderRadius: "99px", background: p.bg, border: `1.5px solid ${p.border}`, color: p.color, fontSize: "17px", fontWeight: 700, display: "flex" }}>
                {p.label}
              </div>
            ))}
          </div>

          <div style={{ marginTop: "30px", fontSize: "20px", color: "#374151", display: "flex" }}>
            mysolai.vercel.app
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
