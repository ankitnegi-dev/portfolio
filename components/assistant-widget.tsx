"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  IconMessageCircle2,
  IconX,
  IconSend2,
  IconArrowLeft,
  IconHome,
  IconMessage,
  IconCircleCheckFilled,
  IconCircleXFilled,
} from "@tabler/icons-react";
import { useBackendStatus } from "@/lib/use-backend-status";
import Image from "next/image";

type Message = { role: "user" | "assistant"; content: string };
type View = "home" | "list" | "chat";

const SUGGESTIONS = [
  "What has Ankit built with LangGraph?",
  "What's DocIntel's retrieval pipeline?",
  "What's Ankit's tech stack?",
];

function TypingDots({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] font-mono">
      <span className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)]"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </span>
      {label}
    </div>
  );
}

function StatusCard() {
  const { status, latency, updatedAt } = useBackendStatus();

  const isOnline = status === "online";
  const label =
    status === "online"
      ? "All systems operational"
      : status === "waking"
      ? "Waking up…"
      : status === "offline"
      ? "Backend offline"
      : "Checking…";

  const sub =
    isOnline && latency !== null
      ? `${latency}ms · ${updatedAt?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) ?? ""}`
      : updatedAt
      ? updatedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "";

  return (
    <div className="flex items-center gap-3 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5">
      {isOnline ? (
        <IconCircleCheckFilled size={18} className="text-[var(--accent)] shrink-0" />
      ) : (
        <IconCircleXFilled size={18} className="text-[var(--accent-warm)] shrink-0" />
      )}
      <div className="min-w-0">
        <p className="text-xs font-medium text-[var(--text-primary)]">{label}</p>
        {sub && (
          <p className="font-mono text-[10px] text-[var(--text-muted)]">{sub}</p>
        )}
      </div>
    </div>
  );
}

export function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>("home");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [slowWake, setSlowWake] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, loading]);

  function toggleOpen() {
    setOpen((v) => {
      const next = !v;
      if (next) setView("home"); // always land on Home when reopening
      return next;
    });
  }

  async function send(text: string) {
    const userMessage: Message = { role: "user", content: text };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setSlowWake(false);

    const wakeTimer = setTimeout(() => setSlowWake(true), 4000);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: nextMessages }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply ?? "Something went wrong." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Couldn't reach the assistant. Please try again.",
        },
      ]);
    } finally {
      clearTimeout(wakeTimer);
      setLoading(false);
      setSlowWake(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    send(trimmed);
  }

  function goToMessagesTab() {
    setView(messages.length > 0 ? "chat" : "list");
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="mb-3 w-[340px] max-w-[calc(100vw-2.5rem)] h-[480px] rounded-[var(--radius)] border border-[var(--border)] glass-surface shadow-2xl flex flex-col overflow-hidden"
          >
            {/* ---------- HOME ---------- */}
            {view === "home" && (
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between px-4 pt-4 pb-2">
                  <div className="w-8 h-8 rounded-full bg-[var(--accent-soft)] flex items-center justify-center">
                    <IconMessageCircle2 size={16} stroke={1.5} className="text-[var(--accent)]" />
                  </div>
                  <div className="flex items-center gap-3">
                    <Image
                      src="/avatar.jpg"
                      alt="Ankit Negi"
                      width={36}
                      height={36}
                      className="rounded-full border-2 border-[var(--bg)] object-cover"
                    />
                    <button
                      onClick={() => setOpen(false)}
                      aria-label="Close assistant"
                      className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      <IconX size={18} stroke={1.5} />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 pt-3 pb-5 space-y-4">
                  <div>
                    <p className="font-display text-lg font-semibold leading-snug">
                      Hi there 👋
                    </p>
                    <p className="font-display text-lg font-semibold leading-snug">
                      Want to know more about my work?
                    </p>
                  </div>

                  <button
                    onClick={() => setView("chat")}
                    className="w-full flex items-center justify-between rounded-[var(--radius-sm)] border border-[var(--border)] px-3 py-2.5 text-left text-sm text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    Send us a message
                    <IconSend2 size={16} stroke={1.5} className="text-[var(--accent)]" />
                  </button>

                  <StatusCard />
                </div>

                <nav className="flex items-center border-t border-[var(--border)]">
                  <button
                    className="flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[var(--accent)]"
                    aria-current="page"
                  >
                    <IconHome size={18} stroke={1.5} />
                    <span className="text-[10px] font-mono">home</span>
                  </button>
                  <button
                    onClick={goToMessagesTab}
                    className="flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                  >
                    <IconMessage size={18} stroke={1.5} />
                    <span className="text-[10px] font-mono">messages</span>
                  </button>
                </nav>
              </div>
            )}

            {/* ---------- MESSAGES (empty placeholder) ---------- */}
            {view === "list" && (
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
                  <p className="text-sm font-medium">Messages</p>
                  <button
                    onClick={() => setOpen(false)}
                    aria-label="Close assistant"
                    className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    <IconX size={18} stroke={1.5} />
                  </button>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center">
                  <IconMessage size={28} stroke={1.3} className="text-[var(--text-muted)]" />
                  <div>
                    <p className="text-sm font-medium">No messages yet</p>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">
                      Ask anything about Ankit&apos;s projects or experience.
                    </p>
                  </div>
                  <button
                    onClick={() => setView("chat")}
                    className="mt-2 inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] bg-[var(--accent)] text-[var(--bg)] text-sm font-medium px-4 py-2 hover:opacity-90 transition-opacity"
                  >
                    Send us a message
                    <IconSend2 size={14} stroke={2} />
                  </button>
                </div>

                <nav className="flex items-center border-t border-[var(--border)]">
                  <button
                    onClick={() => setView("home")}
                    className="flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                  >
                    <IconHome size={18} stroke={1.5} />
                    <span className="text-[10px] font-mono">home</span>
                  </button>
                  <button
                    className="flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[var(--accent)]"
                    aria-current="page"
                  >
                    <IconMessage size={18} stroke={1.5} />
                    <span className="text-[10px] font-mono">messages</span>
                  </button>
                </nav>
              </div>
            )}

            {/* ---------- CHAT ---------- */}
            {view === "chat" && (
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-2 px-3 py-3 border-b border-[var(--border)]">
                  <button
                    onClick={() => setView("list")}
                    aria-label="Back"
                    className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-1"
                  >
                    <IconArrowLeft size={18} stroke={1.5} />
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Ask about Ankit</p>
                    <p className="font-mono text-[11px] text-[var(--text-muted)] truncate">
                      Answers grounded in his actual Projects
                    </p>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    aria-label="Close assistant"
                    className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-1"
                  >
                    <IconX size={18} stroke={1.5} />
                  </button>
                </div>

                <div
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
                >
                  {messages.length === 0 && (
                    <div className="space-y-2">
                      <p className="text-xs text-[var(--text-secondary)]">
                        Try asking:
                      </p>
                      {SUGGESTIONS.map((s) => (
                        <button
                          key={s}
                          onClick={() => send(s)}
                          className="block w-full text-left text-xs rounded-[var(--radius-sm)] border border-[var(--border)] px-3 py-2 text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--text-primary)] transition-colors"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}

                  {messages.map((m, i) => (
                    <div
                      key={i}
                      className={`text-sm rounded-[var(--radius-sm)] px-3 py-2 max-w-[85%] ${
                        m.role === "user"
                          ? "ml-auto bg-[var(--accent)] text-[var(--bg)]"
                          : "bg-[var(--surface-2)] text-[var(--text-primary)]"
                      }`}
                    >
                      {m.content}
                    </div>
                  ))}

                  {loading && (
                    <div className="bg-[var(--surface-2)] rounded-[var(--radius-sm)] px-3 py-2 max-w-[85%]">
                      <TypingDots
                        label={slowWake ? "waking up the backend…" : "thinking…"}
                      />
                    </div>
                  )}
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="flex items-center gap-2 border-t border-[var(--border)] p-3"
                >
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask something…"
                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--text-muted)]"
                  />
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    aria-label="Send"
                    className="text-[var(--accent)] disabled:text-[var(--text-muted)] transition-colors"
                  >
                    <IconSend2 size={18} stroke={1.5} />
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={toggleOpen}
        whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
        aria-label={open ? "Close assistant" : "Open assistant"}
        className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--accent)] text-[var(--bg)] shadow-lg"
      >
        {open ? (
          <IconX size={20} stroke={1.5} />
        ) : (
          <IconMessageCircle2 size={20} stroke={1.5} />
        )}
      </motion.button>
    </div>
  );
}