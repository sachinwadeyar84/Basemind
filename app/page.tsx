"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Send, Plus, MessageSquare, Trash2, Copy, Check, Menu, X } from "lucide-react";
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
  "How do meme coins work?",
  "Tell me about DeFi on Base",
  "What makes $BMIND special?",
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
    <div style={{ display: "flex", height: "100vh", background: "#0d0d0d", overflow: "hidden" }}>

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
          position: "fixed", top: 0, left: 0, height: "100vh", zIndex: 50,
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
        <div style={{ padding: "10px 12px", borderTop: "1px solid #1f1f1f", fontSize: 11, color: "#333" }}>
          $BMIND · AI on Base
        </div>
      </div>

      {/* MAIN AREA */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Top bar */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 20px", borderBottom: "1px solid #1a1a1a",
        }}>
          <button
            onClick={() => setSidebarOpen(o => !o)}
            style={{ background: "none", border: "none", color: "#555", cursor: "pointer", padding: 4, borderRadius: 6 }}
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <div style={{
            fontSize: 11, padding: "4px 10px", borderRadius: 20,
            background: "#111", border: "1px solid #1f1f1f", color: "#6c63ff",
            display: "flex", alignItems: "center", gap: 5,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />
            Live on Base
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 0 16px" }}>
          <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 20px" }}>

            {messages.length === 0 && (
              <div style={{ paddingTop: 80, textAlign: "center" }}>
                <div style={{ margin: "0 auto 20px", width: 64, filter: "drop-shadow(0 0 20px #6c63ff50)" }}>
                  <Logo size={64} />
                </div>
                <h2 style={{ fontSize: isMobile ? 22 : 26, fontWeight: 700, color: "#fff", marginBottom: 8 }}>How can I help you today?</h2>
                <p style={{ fontSize: 14, color: "#444", marginBottom: 40 }}>BasedMind — the AI powering the $BMIND ecosystem on Base</p>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 10, maxWidth: 540, margin: "0 auto" }}>
                  {SUGGESTIONS.map(s => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      style={{
                        textAlign: "left", padding: "14px 16px", borderRadius: 12,
                        background: "#141414", border: "1px solid #222",
                        color: "#888", fontSize: 13, cursor: "pointer", transition: "all 0.15s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "#6c63ff50"; e.currentTarget.style.color = "#fff"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "#222"; e.currentTarget.style.color = "#888"; }}
                    >{s}</button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className="msg-enter" style={{
                padding: "24px 0",
                borderBottom: i < messages.length - 1 ? "1px solid #161616" : "none",
              }}>
                {msg.role === "user" ? (
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <div style={{
                      maxWidth: "75%", background: "#1e1e2e",
                      border: "1px solid #2a2a3a", borderRadius: "18px 18px 4px 18px",
                      padding: "12px 16px", fontSize: 14, color: "#e2e8f0",
                      lineHeight: 1.7, whiteSpace: "pre-wrap",
                    }}>{msg.content}</div>
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{ flexShrink: 0, marginTop: 2 }}><Logo size={32} /></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="md-body">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                      </div>
                      {msg.content && (
                        <button
                          onClick={() => copyMessage(msg.content, i)}
                          style={{
                            marginTop: 10, display: "flex", alignItems: "center", gap: 5,
                            fontSize: 11, color: copied === i ? "#22c55e" : "#444",
                            background: "none", border: "none", cursor: "pointer", padding: 0,
                          }}
                        >
                          {copied === i ? <Check size={12} /> : <Copy size={12} />}
                          {copied === i ? "Copied" : "Copy"}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {loading && (messages.length === 0 || messages[messages.length - 1].role === "user") && (
              <div className="msg-enter" style={{ padding: "24px 0", display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                  background: "linear-gradient(135deg,#6c63ff,#38bdf8)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 800, color: "#fff",
                }}>BM</div>
                <div style={{ display: "flex", gap: 5, paddingTop: 10 }}>
                  {[0,1,2].map(i => (
                    <div key={i} className="dot" style={{
                      width: 7, height: 7, borderRadius: "50%", background: "#6c63ff",
                      animationDelay: `${i * 0.2}s`,
                    }} />
                  ))}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input */}
        <div style={{ padding: "10px 20px 18px" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <div style={{
              display: "flex", alignItems: "flex-end", gap: 10,
              background: "#141414", border: "1px solid #252525",
              borderRadius: 16, padding: "12px 14px",
            }}>
              <textarea
                ref={inputRef}
                rows={1}
                placeholder="Message BasedMind..."
                value={input}
                onChange={e => {
                  setInput(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 140) + "px";
                }}
                onKeyDown={handleKeyDown}
                style={{
                  flex: 1, background: "none", border: "none", outline: "none",
                  color: "#e2e8f0", fontSize: 14, lineHeight: 1.6, resize: "none",
                  maxHeight: 140, fontFamily: "inherit",
                }}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                style={{
                  width: 36, height: 36, borderRadius: 10, border: "none",
                  background: input.trim() && !loading ? "linear-gradient(135deg,#6c63ff,#38bdf8)" : "#1f1f1f",
                  color: input.trim() && !loading ? "#fff" : "#444",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: input.trim() && !loading ? "pointer" : "not-allowed",
                  flexShrink: 0, transition: "all 0.2s",
                }}
              ><Send size={15} /></button>
            </div>
            <p style={{ textAlign: "center", fontSize: 11, color: "#2a2a2a", marginTop: 8 }}>
              BasedMind can make mistakes. Powered by $BMIND on Base.
            </p>
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
