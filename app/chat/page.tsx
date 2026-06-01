"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Send, Plus, MessageSquare, Trash2, Copy, Check, Menu } from "lucide-react";
import Link from "next/link";
import Logo from "@/components/Logo";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}

const SUGGESTIONS = [
  "What is the Base blockchain?",
  "Generate image of a crypto bull riding a rocket",
  "What's trending in crypto today?",
  "Create art of $BMIND token on Base blockchain",
];

function genId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Detect mobile and set sidebar default
  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("basedmind_convos");
    if (saved) {
      const parsed: Conversation[] = JSON.parse(saved);
      setConversations(parsed);
      if (parsed.length > 0) setActiveId(parsed[0].id);
    }
  }, []);

  // Save to localStorage whenever conversations change
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem("basedmind_convos", JSON.stringify(conversations));
    }
  }, [conversations]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations, loading, activeId]);

  const activeConvo = conversations.find(c => c.id === activeId) ?? null;
  const messages = activeConvo?.messages ?? [];

  function newChat() {
    const id = genId();
    const convo: Conversation = { id, title: "New conversation", messages: [], createdAt: Date.now() };
    setConversations(prev => [convo, ...prev]);
    setActiveId(id);
    setInput("");
    if (isMobile) setSidebarOpen(false);
  }

  function deleteConvo(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    setConversations(prev => {
      const next = prev.filter(c => c.id !== id);
      if (next.length === 0) localStorage.removeItem("basedmind_convos");
      else localStorage.setItem("basedmind_convos", JSON.stringify(next));
      return next;
    });
    if (activeId === id) {
      const rest = conversations.filter(c => c.id !== id);
      setActiveId(rest.length > 0 ? rest[0].id : null);
    }
  }

  const updateConvo = useCallback((id: string, msgs: Message[]) => {
    setConversations(prev =>
      prev.map(c => {
        if (c.id !== id) return c;
        const title = msgs[0]?.content.slice(0, 40) || "New conversation";
        return { ...c, title, messages: msgs };
      })
    );
  }, []);

  async function sendMessage(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;

    let currentId = activeId;

    // Create new conversation if none active
    if (!currentId) {
      const id = genId();
      const convo: Conversation = { id, title: msg.slice(0, 40), messages: [], createdAt: Date.now() };
      setConversations(prev => [convo, ...prev]);
      setActiveId(id);
      currentId = id;
    }

    const prevMessages = conversations.find(c => c.id === currentId)?.messages ?? [];
    const newMessages: Message[] = [...prevMessages, { role: "user", content: msg }];
    updateConvo(currentId, newMessages);
    setInput("");
    setLoading(true);

    if (inputRef.current) inputRef.current.style.height = "auto";

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok) throw new Error("API error");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";

      updateConvo(currentId, [...newMessages, { role: "assistant", content: "" }]);

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value, { stream: true });
        updateConvo(currentId, [...newMessages, { role: "assistant", content: assistantText }]);
      }
    } catch {
      updateConvo(currentId, [...newMessages, { role: "assistant", content: "Something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function copyMessage(content: string, idx: number) {
    navigator.clipboard.writeText(content);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  }

  // Group conversations by date
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  const groups: { label: string; items: Conversation[] }[] = [];
  const todayItems = conversations.filter(c => new Date(c.createdAt).toDateString() === today);
  const yesterdayItems = conversations.filter(c => new Date(c.createdAt).toDateString() === yesterday);
  const olderItems = conversations.filter(c => {
    const d = new Date(c.createdAt).toDateString();
    return d !== today && d !== yesterday;
  });
  if (todayItems.length) groups.push({ label: "Today", items: todayItems });
  if (yesterdayItems.length) groups.push({ label: "Yesterday", items: yesterdayItems });
  if (olderItems.length) groups.push({ label: "Older", items: olderItems });

  return (
    <div style={{ display: "flex", height: "100dvh", background: "#0d0d0d", overflow: "hidden" }}>

      {/* Mobile backdrop */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
            zIndex: 40, backdropFilter: "blur(2px)",
          }}
        />
      )}

      {/* SIDEBAR */}
      <div style={{
        width: 260,
        minWidth: 260,
        background: "#111",
        borderRight: "1px solid #1f1f1f",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        transition: "transform 0.25s ease",
        ...(isMobile ? {
          position: "fixed", top: 0, left: 0, height: "100dvh", zIndex: 50,
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
        } : {
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          position: "relative",
          marginLeft: sidebarOpen ? 0 : -260,
          transition: "margin-left 0.25s ease",
        }),
      }}>
        <div style={{ padding: "14px 12px 10px", flexShrink: 0 }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "4px 4px 14px", borderBottom: "1px solid #1f1f1f", marginBottom: 10 }}>
            <Logo size={30} />
            <span style={{ fontWeight: 700, fontSize: 14, color: "#fff" }}>BasedMind</span>
          </div>

          {/* New chat button */}
          <button
            onClick={newChat}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: 8,
              padding: "9px 12px", borderRadius: 9, border: "1px solid #2a2a2a",
              background: "#1a1a1a", color: "#ccc", fontSize: 13, cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "#222")}
            onMouseLeave={e => (e.currentTarget.style.background = "#1a1a1a")}
          >
            <Plus size={14} /> New chat
          </button>
        </div>

        {/* Conversation list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 8px 16px" }}>
          {conversations.length === 0 && (
            <p style={{ fontSize: 12, color: "#444", textAlign: "center", padding: "20px 0" }}>
              No conversations yet
            </p>
          )}
          {groups.map(group => (
            <div key={group.label}>
              <p style={{ fontSize: 11, color: "#444", padding: "10px 8px 4px", fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase" }}>
                {group.label}
              </p>
              {group.items.map(convo => (
                <div
                  key={convo.id}
                  onClick={() => { setActiveId(convo.id); if (isMobile) setSidebarOpen(false); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "8px 10px", borderRadius: 8, cursor: "pointer",
                    background: activeId === convo.id ? "#1e1e2e" : "transparent",
                    border: activeId === convo.id ? "1px solid #2a2a3a" : "1px solid transparent",
                    marginBottom: 2, transition: "all 0.15s", position: "relative",
                  }}
                  onMouseEnter={e => {
                    if (activeId !== convo.id) (e.currentTarget as HTMLDivElement).style.background = "#191919";
                  }}
                  onMouseLeave={e => {
                    if (activeId !== convo.id) (e.currentTarget as HTMLDivElement).style.background = "transparent";
                  }}
                >
                  <MessageSquare size={13} style={{ color: activeId === convo.id ? "#6c63ff" : "#444", flexShrink: 0 }} />
                  <span style={{
                    fontSize: 13, color: activeId === convo.id ? "#e2e8f0" : "#888",
                    flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {convo.title}
                  </span>
                  <button
                    onClick={e => deleteConvo(convo.id, e)}
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      color: "#444", padding: 2, borderRadius: 4, flexShrink: 0,
                      opacity: 0, transition: "opacity 0.15s",
                    }}
                    className="delete-btn"
                    onMouseEnter={e => (e.currentTarget.style.color = "#ef4444")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#444")}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding: "10px 12px", borderTop: "1px solid #1f1f1f", fontSize: 11, color: "#333", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>$BMIND · AI on Base</span>
          <Link href="/" style={{ color: "#1d6fd8", textDecoration: "none", fontSize: 11 }}>← Home</Link>
        </div>
      </div>

      {/* MAIN AREA */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Top bar */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: isMobile ? "10px 14px" : "10px 20px",
          borderBottom: "1px solid #1a1a1a",
          minHeight: isMobile ? 56 : 52,
          background: "#0d0d0d",
        }}>
          {/* Hamburger — opens sidebar */}
          <button
            onClick={() => setSidebarOpen(o => !o)}
            style={{
              background: "#1a1a1a", border: "1px solid #2a2a2a",
              color: "#ccc", cursor: "pointer",
              padding: "8px 10px", borderRadius: 10, display: "flex",
              alignItems: "center", gap: 6,
            }}
          >
            <Menu size={18} />
            {isMobile && <span style={{ fontSize: 12, color: "#888", fontWeight: 600 }}>History</span>}
          </button>

          {/* Center: logo + name */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Logo size={24} />
            <span style={{ fontWeight: 700, fontSize: 15, color: "#fff" }}>BasedMind</span>
          </div>

          {/* New chat button */}
          <button
            onClick={newChat}
            style={{
              background: "linear-gradient(135deg,#1d6fd8,#38bdf8)",
              border: "none", color: "#fff", cursor: "pointer",
              padding: "8px 12px", borderRadius: 10, display: "flex",
              alignItems: "center", gap: 6,
            }}
          >
            <Plus size={18} />
            {isMobile && <span style={{ fontSize: 12, fontWeight: 700 }}>New</span>}
          </button>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 0 8px" }}>
          <div style={{ maxWidth: 720, margin: "0 auto", padding: isMobile ? "0 14px" : "0 24px" }}>

            {messages.length === 0 && (
              <div style={{ paddingTop: isMobile ? 50 : 80, textAlign: "center", paddingBottom: 20 }}>
                <div style={{ margin: "0 auto 16px", width: isMobile ? 56 : 64, filter: "drop-shadow(0 0 18px #6c63ff50)" }}>
                  <Logo size={isMobile ? 56 : 64} />
                </div>
                <h2 style={{ fontSize: isMobile ? 20 : 26, fontWeight: 700, color: "#fff", marginBottom: 6 }}>
                  How can I help you today?
                </h2>
                <p style={{ fontSize: 13, color: "#444", marginBottom: 32 }}>
                  AI for the $BMIND ecosystem on Base
                </p>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr", gap: 8, maxWidth: 480, margin: "0 auto" }}>
                  {SUGGESTIONS.map(s => (
                    <button key={s} onClick={() => sendMessage(s)} style={{
                      textAlign: "left", padding: "12px 14px", borderRadius: 14,
                      background: "#161616", border: "1px solid #222",
                      color: "#777", fontSize: isMobile ? 12 : 13, cursor: "pointer",
                      lineHeight: 1.4,
                    }}>{s}</button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className="msg-enter" style={{ padding: isMobile ? "16px 0" : "20px 0" }}>
                {msg.role === "user" ? (
                  /* User message — bubble right */
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <div style={{
                      maxWidth: isMobile ? "88%" : "75%",
                      background: "#2a2a3a",
                      borderRadius: "18px 18px 4px 18px",
                      padding: isMobile ? "10px 14px" : "12px 16px",
                      fontSize: isMobile ? 14 : 14,
                      color: "#e2e8f0", lineHeight: 1.65, whiteSpace: "pre-wrap",
                    }}>{msg.content}</div>
                  </div>
                ) : (
                  /* AI message — full width, small logo left */
                  <div style={{ display: "flex", gap: isMobile ? 10 : 14, alignItems: "flex-start", color: "#d1d1d1" }}>
                    <div style={{ flexShrink: 0, marginTop: 3 }}><Logo size={isMobile ? 26 : 30} /></div>
                    <div style={{ flex: 1, minWidth: 0, color: "#d1d1d1" }}>
                      <div className="md-body" style={{ fontSize: isMobile ? 14 : 14.5, color: "#d1d1d1" }}>
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            img: ({ src, alt }) => (
                              <span style={{ display: "block", margin: "10px 0" }}>
                                <img
                                  src={src}
                                  alt={alt || "Generated image"}
                                  loading="lazy"
                                  style={{
                                    maxWidth: "100%", width: "100%", maxHeight: 480,
                                    objectFit: "contain", borderRadius: 14,
                                    border: "1px solid #252535", background: "#111",
                                    display: "block",
                                  }}
                                  onError={(e) => {
                                    const el = e.currentTarget;
                                    el.style.display = "none";
                                    const msg = document.createElement("p");
                                    msg.textContent = "⚠️ Image failed to load — Pollinations.ai may be busy. Try again in a moment.";
                                    msg.style.cssText = "color:#f87171;font-size:13px;padding:12px;background:#1a0a0a;border-radius:8px;border:1px solid #3a1a1a;";
                                    el.parentElement?.appendChild(msg);
                                  }}
                                />
                              </span>
                            ),
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                      {msg.content && (
                        <button onClick={() => copyMessage(msg.content, i)} style={{
                          marginTop: 8, display: "flex", alignItems: "center", gap: 4,
                          fontSize: 11, color: copied === i ? "#22c55e" : "#3a3a4a",
                          background: "none", border: "none", cursor: "pointer", padding: 0,
                        }}>
                          {copied === i ? <Check size={11} /> : <Copy size={11} />}
                          {copied === i ? "Copied" : "Copy"}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {loading && (messages.length === 0 || messages[messages.length - 1].role === "user") && (
              <div className="msg-enter" style={{ padding: "16px 0", display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{ flexShrink: 0, marginTop: 3 }}><Logo size={26} /></div>
                <div style={{ display: "flex", gap: 5, paddingTop: 8 }}>
                  {[0,1,2].map(i => (
                    <div key={i} className="dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "#6c63ff", animationDelay: `${i*0.2}s` }} />
                  ))}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input — ChatGPT style */}
        <div style={{ padding: isMobile ? "8px 12px 16px" : "10px 20px 18px", background: "#0d0d0d" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <div style={{
              display: "flex", alignItems: "flex-end", gap: 8,
              background: "#161616", border: "1px solid #2a2a2a",
              borderRadius: 20, padding: "10px 12px 10px 16px",
            }}>
              <textarea
                ref={inputRef}
                rows={1}
                placeholder="Message BasedMind..."
                value={input}
                onChange={e => {
                  setInput(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                }}
                onKeyDown={handleKeyDown}
                style={{
                  flex: 1, background: "none", border: "none", outline: "none",
                  color: "#e2e8f0", fontSize: 15, lineHeight: 1.5, resize: "none",
                  maxHeight: 120, fontFamily: "inherit", paddingTop: 2,
                }}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                style={{
                  width: 34, height: 34, borderRadius: "50%", border: "none",
                  background: input.trim() && !loading ? "linear-gradient(135deg,#6c63ff,#38bdf8)" : "#222",
                  color: input.trim() && !loading ? "#fff" : "#444",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: input.trim() && !loading ? "pointer" : "not-allowed",
                  flexShrink: 0, transition: "all 0.2s",
                }}
              ><Send size={15} /></button>
            </div>
            {!isMobile && (
              <p style={{ textAlign: "center", fontSize: 11, color: "#2a2a2a", marginTop: 6 }}>
                BasedMind can make mistakes. Powered by $BMIND on Base.
              </p>
            )}
          </div>
        </div>
      </div>

      <style>{`
        div:hover .delete-btn { opacity: 1 !important; }
        .delete-btn:hover { opacity: 1 !important; }
      `}</style>
    </div>
  );
}
