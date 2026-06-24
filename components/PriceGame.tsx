"use client";

import { useState, useEffect } from "react";

interface Token {
  name: string;
  price: number;
  volume24h: number;
  priceChange24h: number;
}

type Guess = "up" | "down" | null;

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  if (n < 0.01) return `$${n.toExponential(2)}`;
  return `$${n.toFixed(4)}`;
}

function fmtVol(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

export default function PriceGame({ onClose }: { onClose: () => void }) {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [guesses, setGuesses] = useState<Guess[]>([null, null, null]);
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    fetch("/api/game")
      .then((r) => r.json())
      .then((d) => {
        if (!d.tokens || d.tokens.length < 3) { setError(true); }
        else { setTokens(d.tokens); }
        setLoading(false);
      })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  function guess(idx: number, dir: "up" | "down") {
    if (revealed) return;
    const next = [...guesses];
    next[idx] = dir;
    setGuesses(next);
  }

  function reveal() {
    let s = 0;
    tokens.forEach((t, i) => {
      const correct: Guess = t.priceChange24h >= 0 ? "up" : "down";
      if (guesses[i] === correct) s++;
    });
    setScore(s);
    setRevealed(true);
  }

  function playAgain() {
    setTokens([]);
    setGuesses([null, null, null]);
    setRevealed(false);
    setLoading(true);
    setError(false);
    fetch("/api/game")
      .then((r) => r.json())
      .then((d) => {
        if (!d.tokens || d.tokens.length < 3) setError(true);
        else setTokens(d.tokens);
        setLoading(false);
      })
      .catch(() => { setError(true); setLoading(false); });
  }

  const allGuessed = guesses.every((g) => g !== null);
  const scoreMsg = score === 3 ? "🔥 Perfect! Crypto oracle." : score === 2 ? "💪 Nice! 2 out of 3." : score === 1 ? "📉 1 out of 3. Keep studying." : "😅 0 out of 3. Oof.";

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "#111", border: "1px solid #252535", borderRadius: 20, padding: 24, maxWidth: 420, width: "100%", position: "relative" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <div>
            <h2 style={{ color: "#fff", fontWeight: 700, fontSize: 17, margin: 0 }}>🎮 Price Prediction</h2>
            <p style={{ color: "#555", fontSize: 12, margin: "4px 0 0" }}>Did these Solana tokens go UP or DOWN in 24h?</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#444", cursor: "pointer", fontSize: 20, lineHeight: 1, padding: 4 }}>✕</button>
        </div>

        {/* Progress dots */}
        {!revealed && !loading && !error && (
          <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ height: 4, flex: 1, borderRadius: 2, background: guesses[i] ? (guesses[i] === "up" ? "#14F195" : "#f87171") : "#222" }} />
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#444", fontSize: 13 }}>
            <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 12 }}>
              {[0, 1, 2].map((i) => (
                <div key={i} className="dot" style={{ width: 7, height: 7, borderRadius: "50%", background: "#9945FF", animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
            Fetching live Solana data…
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ textAlign: "center", padding: "30px 0" }}>
            <p style={{ color: "#f87171", fontSize: 13, marginBottom: 16 }}>Failed to load tokens. Markets might be closed.</p>
            <button onClick={playAgain} style={{ padding: "9px 20px", borderRadius: 10, border: "1px solid #9945FF", background: "transparent", color: "#9945FF", cursor: "pointer", fontSize: 13 }}>Try again</button>
          </div>
        )}

        {/* Token cards */}
        {!loading && !error && tokens.map((token, i) => {
          const isUp = guesses[i] === "up";
          const isDown = guesses[i] === "down";
          const actualUp = token.priceChange24h >= 0;
          const correct = revealed ? (actualUp ? "up" : "down") === guesses[i] : null;

          return (
            <div key={i} style={{ marginBottom: i < 2 ? 10 : 0, background: "#0d0d1a", borderRadius: 14, padding: "14px 16px", border: `1px solid ${revealed ? (correct ? "#14F195" : "#f87171") + "55" : "#1e1e2e"}` }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <div>
                  <span style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>{token.name}</span>
                  <div style={{ color: "#555", fontSize: 11, marginTop: 2 }}>Price: <span style={{ color: "#aaa" }}>{fmt(token.price)}</span> · Vol: <span style={{ color: "#aaa" }}>{fmtVol(token.volume24h)}</span></div>
                </div>
                {revealed && (
                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: actualUp ? "#14F195" : "#f87171", fontWeight: 700, fontSize: 14 }}>
                      {actualUp ? "▲" : "▼"} {Math.abs(token.priceChange24h).toFixed(1)}%
                    </div>
                    <div style={{ fontSize: 11, color: correct ? "#14F195" : "#f87171", marginTop: 2 }}>
                      {correct ? "✓ Correct" : "✗ Wrong"}
                    </div>
                  </div>
                )}
              </div>

              {/* Guess buttons */}
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => guess(i, "up")}
                  disabled={revealed}
                  style={{
                    flex: 1, padding: "9px 0", borderRadius: 10, border: "none", cursor: revealed ? "default" : "pointer", fontWeight: 700, fontSize: 13,
                    background: isUp ? "#14F195" : "#1a1a2a",
                    color: isUp ? "#000" : "#555",
                    transition: "all 0.15s",
                    opacity: revealed && !isUp ? 0.4 : 1,
                  }}
                >
                  ▲ UP
                </button>
                <button
                  onClick={() => guess(i, "down")}
                  disabled={revealed}
                  style={{
                    flex: 1, padding: "9px 0", borderRadius: 10, border: "none", cursor: revealed ? "default" : "pointer", fontWeight: 700, fontSize: 13,
                    background: isDown ? "#f87171" : "#1a1a2a",
                    color: isDown ? "#000" : "#555",
                    transition: "all 0.15s",
                    opacity: revealed && !isDown ? 0.4 : 1,
                  }}
                >
                  ▼ DOWN
                </button>
              </div>
            </div>
          );
        })}

        {/* Score banner */}
        {revealed && (
          <div style={{ marginTop: 14, background: score === 3 ? "#0a1f0a" : score >= 2 ? "#0a100a" : "#1a1010", border: `1px solid ${score === 3 ? "#14F195" : score >= 2 ? "#4ade80" : "#f87171"}44`, borderRadius: 12, padding: "12px 16px", textAlign: "center" }}>
            <p style={{ color: "#fff", fontWeight: 700, fontSize: 15, margin: 0 }}>{scoreMsg}</p>
            <p style={{ color: "#555", fontSize: 12, margin: "4px 0 0" }}>{score}/3 correct</p>
          </div>
        )}

        {/* Action buttons */}
        <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
          {!revealed ? (
            <button
              onClick={reveal}
              disabled={!allGuessed}
              style={{ flex: 1, padding: "12px 0", borderRadius: 12, border: "none", fontWeight: 700, fontSize: 14, cursor: allGuessed ? "pointer" : "not-allowed", background: allGuessed ? "linear-gradient(135deg,#9945FF,#14F195)" : "#1a1a2a", color: allGuessed ? "#fff" : "#333", transition: "all 0.2s" }}
            >
              {allGuessed ? "Reveal Results →" : `Pick ${guesses.filter(Boolean).length}/3`}
            </button>
          ) : (
            <>
              <button onClick={playAgain} style={{ flex: 1, padding: "12px 0", borderRadius: 12, border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer", background: "linear-gradient(135deg,#9945FF,#14F195)", color: "#fff" }}>
                Play Again
              </button>
              <button onClick={onClose} style={{ flex: 1, padding: "12px 0", borderRadius: 12, border: "1px solid #252535", background: "transparent", color: "#555", fontSize: 14, cursor: "pointer" }}>
                Close
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
