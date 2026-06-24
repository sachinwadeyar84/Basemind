"use client";
import { useState, useEffect, useRef, useCallback } from "react";

const TIMER_SEC = 8;

interface Token { name: string; price: number; volume24h: number; priceChange24h: number; }
interface Feedback { correct: boolean; pts: number; change: number; tokenName: string; timeout: boolean; }
interface LBEntry { score: number; rank: string; date: string; }

function getRank(score: number) {
  if (score >= 1500) return { title: "Solana God",     emoji: "👑", color: "#FFD700" };
  if (score >= 1000) return { title: "Diamond Hands",  emoji: "💎", color: "#a78bfa" };
  if (score >=  600) return { title: "Degen Whale",    emoji: "🐋", color: "#38bdf8" };
  if (score >=  300) return { title: "Rookie Trader",  emoji: "📈", color: "#14F195" };
  return               { title: "Paper Hands",         emoji: "🙈", color: "#f87171" };
}

function fmt(n: number) {
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
  if (n < 0.000001) return `$${n.toExponential(2)}`;
  if (n < 0.01) return `$${n.toFixed(6)}`;
  return `$${n.toFixed(4)}`;
}
function fmtVol(n: number) {
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

type Phase = "loading" | "playing" | "feedback" | "done" | "error";

export default function PriceGame({ onClose }: { onClose: () => void }) {
  const [tokens,   setTokens]   = useState<Token[]>([]);
  const [phase,    setPhase]    = useState<Phase>("loading");
  const [idx,      setIdx]      = useState(0);
  const [score,    setScore]    = useState(0);
  const [streak,   setStreak]   = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_SEC);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [history,  setHistory]  = useState<boolean[]>([]);
  const [lb,       setLb]       = useState<LBEntry[]>([]);
  const [showLb,   setShowLb]   = useState(false);

  const scoreRef  = useRef(0);
  const streakRef = useRef(0);
  const didGuess  = useRef(false);
  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null);

  function loadLb() {
    try { return JSON.parse(localStorage.getItem("solai_lb") ?? "[]") as LBEntry[]; }
    catch { return []; }
  }

  function saveLb(finalScore: number) {
    const rank = getRank(finalScore);
    const entry: LBEntry = { score: finalScore, rank: `${rank.emoji} ${rank.title}`, date: new Date().toLocaleDateString() };
    const updated = [...loadLb(), entry].sort((a, b) => b.score - a.score).slice(0, 10);
    try { localStorage.setItem("solai_lb", JSON.stringify(updated)); } catch {}
    setLb(updated);
  }

  function loadTokens() {
    fetch("/api/game")
      .then(r => r.json())
      .then(d => {
        if (d.tokens?.length >= 3) { setTokens(d.tokens); setPhase("playing"); }
        else setPhase("error");
      })
      .catch(() => setPhase("error"));
  }

  useEffect(() => { setLb(loadLb()); loadTokens(); }, []);

  // Timer — resets when phase becomes "playing" or idx changes
  useEffect(() => {
    if (phase !== "playing") return;
    didGuess.current = false;
    setTimeLeft(TIMER_SEC);
    const iv = setInterval(() => {
      setTimeLeft(t => { if (t <= 1) { clearInterval(iv); return 0; } return t - 1; });
    }, 1000);
    timerRef.current = iv;
    return () => clearInterval(iv);
  }, [phase, idx]);

  const handleGuess = useCallback((dir: "up" | "down" | null) => {
    if (didGuess.current) return;
    didGuess.current = true;
    if (timerRef.current) clearInterval(timerRef.current);

    const token = tokens[idx];
    if (!token) return;

    const actual: "up" | "down" = token.priceChange24h >= 0 ? "up" : "down";
    const timedOut = dir === null;
    const correct  = !timedOut && dir === actual;

    const newStreak = correct ? streakRef.current + 1 : 0;
    const pts       = correct ? 100 * (streakRef.current + 1) : 0;
    const newScore  = scoreRef.current + pts;

    streakRef.current = newStreak;
    scoreRef.current  = newScore;

    setStreak(newStreak);
    setScore(newScore);
    setHistory(h => [...h, correct]);
    setFeedback({ correct, pts, change: token.priceChange24h, tokenName: token.name, timeout: timedOut });
    setPhase("feedback");

    const isLast = idx + 1 >= tokens.length;
    setTimeout(() => {
      if (isLast) { saveLb(newScore); setPhase("done"); }
      else        { setIdx(i => i + 1); setPhase("playing"); }
    }, 2200);
  }, [tokens, idx]);

  // Store latest handleGuess for timeout handler
  const handleGuessRef = useRef(handleGuess);
  useEffect(() => { handleGuessRef.current = handleGuess; });

  // Timeout trigger
  useEffect(() => {
    if (timeLeft === 0 && phase === "playing") handleGuessRef.current(null);
  }, [timeLeft, phase]);

  function playAgain() {
    scoreRef.current = streakRef.current = 0;
    setScore(0); setStreak(0); setIdx(0);
    setHistory([]); setFeedback(null); setTokens([]);
    setPhase("loading");
    loadTokens();
  }

  const token = tokens[idx];
  const rank  = getRank(score);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.93)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "#111", border: "1px solid #252535", borderRadius: 24, padding: 24, maxWidth: 390, width: "100%", position: "relative" }}>

        {/* ── Header (playing / feedback) ── */}
        {(phase === "playing" || phase === "feedback") && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            {/* progress dots */}
            <div style={{ display: "flex", gap: 5 }}>
              {tokens.map((_, i) => (
                <div key={i} style={{
                  width: 10, height: 10, borderRadius: "50%", transition: "background 0.3s",
                  background: i < history.length ? (history[i] ? "#14F195" : "#f87171") : i === idx ? "#9945FF" : "#1e1e2e",
                  boxShadow: i === idx ? "0 0 8px #9945FF" : "none",
                }} />
              ))}
            </div>
            {/* score + streak */}
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              {streak >= 2 && (
                <span style={{ background: "#ff6b0018", border: "1px solid #ff6b00", borderRadius: 20, padding: "2px 10px", fontSize: 12, color: "#ff6b00", fontWeight: 700 }}>
                  🔥 ×{streak}
                </span>
              )}
              <span style={{ color: "#9945FF", fontWeight: 800, fontSize: 18 }}>{score}</span>
              <span style={{ color: "#333", fontSize: 12 }}>pts</span>
            </div>
          </div>
        )}

        {/* ── LOADING ── */}
        {phase === "loading" && (
          <div style={{ textAlign: "center", padding: "44px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>🎮</div>
            <p style={{ color: "#fff", fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Degen Arena</p>
            <p style={{ color: "#444", fontSize: 13, marginBottom: 16 }}>Fetching live Solana tokens…</p>
            <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
              {[0,1,2].map(i => (
                <div key={i} className="dot" style={{ width: 7, height: 7, borderRadius: "50%", background: "#9945FF", animationDelay: `${i*0.2}s` }} />
              ))}
            </div>
          </div>
        )}

        {/* ── ERROR ── */}
        {phase === "error" && (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <p style={{ color: "#f87171", marginBottom: 16 }}>Failed to load tokens. Try again?</p>
            <button onClick={playAgain} style={{ padding: "10px 24px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#9945FF,#14F195)", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
              Retry
            </button>
          </div>
        )}

        {/* ── PLAYING ── */}
        {phase === "playing" && token && (
          <>
            {/* Token card */}
            <div style={{ background: "#0d0d1a", borderRadius: 16, padding: "18px 20px", marginBottom: 14, border: "1px solid #1e1e2e" }}>
              <p style={{ color: "#555", fontSize: 11, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>
                Token {idx + 1} of {tokens.length}
              </p>
              <h2 style={{ color: "#fff", fontWeight: 800, fontSize: 24, margin: "0 0 6px" }}>{token.name}</h2>
              <div style={{ display: "flex", gap: 16 }}>
                <div><span style={{ color: "#555", fontSize: 11 }}>Price</span><br /><span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{fmt(token.price)}</span></div>
                <div><span style={{ color: "#555", fontSize: 11 }}>Vol 24h</span><br /><span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{fmtVol(token.volume24h)}</span></div>
              </div>
            </div>

            {/* Multiplier hint */}
            {streak >= 1 && (
              <p style={{ textAlign: "center", color: "#ff6b00", fontSize: 12, marginBottom: 10, fontWeight: 700 }}>
                🔥 Streak ×{streak + 1} — correct = <strong>{100 * (streak + 1)} pts!</strong>
              </p>
            )}

            {/* Timer bar */}
            <div style={{ height: 6, background: "#1a1a2a", borderRadius: 3, marginBottom: 6, overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: 3,
                width: `${(timeLeft / TIMER_SEC) * 100}%`,
                background: timeLeft <= 3 ? "#f87171" : timeLeft <= 5 ? "#fbbf24" : "#14F195",
                transition: "width 1s linear, background 0.4s",
              }} />
            </div>
            <p style={{ textAlign: "right", color: timeLeft <= 3 ? "#f87171" : "#333", fontSize: 11, fontWeight: 700, marginBottom: 18 }}>
              {timeLeft}s
            </p>

            {/* UP / DOWN buttons */}
            <div style={{ display: "flex", gap: 12 }}>
              {(["up", "down"] as const).map(dir => {
                const isUp = dir === "up";
                return (
                  <button
                    key={dir}
                    onClick={() => handleGuess(dir)}
                    style={{
                      flex: 1, padding: "20px 0", borderRadius: 16,
                      border: `2px solid ${isUp ? "#14F195" : "#f87171"}`,
                      background: isUp ? "#0a1f0a" : "#1f0a0a",
                      color: isUp ? "#14F195" : "#f87171",
                      fontWeight: 800, fontSize: 20, cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = isUp ? "#14F195" : "#f87171"; e.currentTarget.style.color = "#000"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = isUp ? "#0a1f0a" : "#1f0a0a"; e.currentTarget.style.color = isUp ? "#14F195" : "#f87171"; }}
                  >
                    {isUp ? "▲ UP" : "▼ DOWN"}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* ── FEEDBACK ── */}
        {phase === "feedback" && feedback && (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <div style={{ fontSize: 56, marginBottom: 10, lineHeight: 1 }}>
              {feedback.correct ? "✅" : feedback.timeout ? "⏱️" : "❌"}
            </div>
            <h3 style={{ color: feedback.correct ? "#14F195" : "#f87171", fontSize: 22, fontWeight: 800, margin: "0 0 8px" }}>
              {feedback.timeout ? "Too slow!" : feedback.correct ? "Nailed it!" : "Wrong!"}
            </h3>
            <p style={{ color: "#888", fontSize: 14, marginBottom: 10 }}>
              <strong style={{ color: "#fff" }}>{feedback.tokenName}</strong> went{" "}
              <strong style={{ color: feedback.change >= 0 ? "#14F195" : "#f87171" }}>
                {feedback.change >= 0 ? "▲" : "▼"} {Math.abs(feedback.change).toFixed(1)}%
              </strong>{" "}in 24h
            </p>
            {feedback.pts > 0 && (
              <div style={{ background: "#9945FF1a", border: "1px solid #9945FF55", borderRadius: 12, padding: "12px 20px", display: "inline-block" }}>
                <span style={{ color: "#a78bfa", fontWeight: 800, fontSize: 20 }}>+{feedback.pts} pts</span>
                {feedback.pts > 100 && <span style={{ color: "#ff6b00", fontSize: 12, marginLeft: 8 }}>🔥 Streak bonus!</span>}
              </div>
            )}
            <p style={{ color: "#2a2a3a", fontSize: 12, marginTop: 14 }}>Next token loading…</p>
          </div>
        )}

        {/* ── DONE ── */}
        {phase === "done" && (
          <>
            {/* Rank card */}
            <div style={{ textAlign: "center", marginBottom: 18 }}>
              <div style={{ fontSize: 52, marginBottom: 8, lineHeight: 1 }}>{rank.emoji}</div>
              <h2 style={{ color: rank.color, fontWeight: 800, fontSize: 24, margin: "0 0 4px" }}>{rank.title}</h2>
              <p style={{ color: "#fff", fontWeight: 800, fontSize: 32, margin: "0 0 12px" }}>{score} <span style={{ fontSize: 16, color: "#555", fontWeight: 400 }}>pts</span></p>

              {/* History row */}
              <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 16 }}>
                {history.map((h, i) => (
                  <span key={i} style={{ fontSize: 22 }}>{h ? "✅" : "❌"}</span>
                ))}
              </div>

              {/* Stats bar */}
              <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 16 }}>
                <div style={{ background: "#0d0d1a", borderRadius: 10, padding: "8px 14px", border: "1px solid #1e1e2e" }}>
                  <p style={{ color: "#555", fontSize: 10, margin: 0 }}>Correct</p>
                  <p style={{ color: "#14F195", fontWeight: 700, fontSize: 15, margin: 0 }}>{history.filter(Boolean).length}/{history.length}</p>
                </div>
                <div style={{ background: "#0d0d1a", borderRadius: 10, padding: "8px 14px", border: "1px solid #1e1e2e" }}>
                  <p style={{ color: "#555", fontSize: 10, margin: 0 }}>Best Streak</p>
                  <p style={{ color: "#ff6b00", fontWeight: 700, fontSize: 15, margin: 0 }}>
                    {(() => { let max = 0, cur = 0; history.forEach(h => { cur = h ? cur + 1 : 0; max = Math.max(max, cur); }); return max; })()}🔥
                  </p>
                </div>
                <div style={{ background: "#0d0d1a", borderRadius: 10, padding: "8px 14px", border: "1px solid #1e1e2e" }}>
                  <p style={{ color: "#555", fontSize: 10, margin: 0 }}>Pts/Token</p>
                  <p style={{ color: "#9945FF", fontWeight: 700, fontSize: 15, margin: 0 }}>{Math.round(score / Math.max(1, history.length))}</p>
                </div>
              </div>

              {/* Share */}
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I scored ${score} pts as "${rank.emoji} ${rank.title}" on @SolAI Degen Arena! 🎮\n${history.map(h => h ? "✅" : "❌").join("")}\n\nCan you beat me? 👉 mysolai.vercel.app/chat\n\n#Solana #Crypto #SolAI`)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "inline-block", padding: "10px 22px", borderRadius: 12, background: "#000", border: "1px solid #333", color: "#fff", fontSize: 13, fontWeight: 700, textDecoration: "none" }}
              >
                𝕏 Share Score
              </a>
            </div>

            {/* Leaderboard */}
            <button
              onClick={() => setShowLb(s => !s)}
              style={{ width: "100%", padding: "8px 0", background: "transparent", border: "1px solid #1e1e2e", borderRadius: 10, color: "#444", fontSize: 13, cursor: "pointer", marginBottom: 8 }}
            >
              {showLb ? "▲ Hide Leaderboard" : "🏆 My Best Scores"}
            </button>
            {showLb && lb.length > 0 && (
              <div style={{ background: "#0d0d1a", borderRadius: 12, padding: 12, marginBottom: 12, maxHeight: 150, overflowY: "auto" }}>
                {lb.map((e, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderBottom: i < lb.length - 1 ? "1px solid #1a1a2a" : "none" }}>
                    <span style={{ color: i === 0 ? "#FFD700" : "#555", fontSize: 13 }}>#{i + 1} {e.rank}</span>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>{e.score} pts</span>
                      <span style={{ color: "#333", fontSize: 11, marginLeft: 6 }}>{e.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={playAgain} style={{ flex: 1, padding: "13px 0", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#9945FF,#14F195)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                Play Again
              </button>
              <button onClick={onClose} style={{ flex: 1, padding: "13px 0", borderRadius: 12, border: "1px solid #252535", background: "transparent", color: "#555", fontSize: 14, cursor: "pointer" }}>
                Close
              </button>
            </div>
          </>
        )}

        {/* Close X (loading / playing / feedback) */}
        {phase !== "done" && (
          <button onClick={onClose} style={{ position: "absolute", top: 14, right: 16, background: "none", border: "none", color: "#2a2a3a", cursor: "pointer", fontSize: 20, lineHeight: 1, padding: 4 }}>
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
