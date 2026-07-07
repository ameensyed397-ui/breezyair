"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { X, Send } from "lucide-react";

/**
 * Breezy — the website "door" into Agent 1. The voice door (/api/agent/voice)
 * runs the same brain. Neo-brutalist mascot styling to match the site.
 */
export function BreezyWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/agent/breezy" }),
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  const busy = status === "submitted" || status === "streaming";

  const onSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || busy) return;
    sendMessage({ text: input });
    setInput("");
  };

  return (
    <>
      {/* Launcher */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Chat with Breezy"
          className="btn-lift fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-[#4fc3f7] text-black font-bold text-sm border-2 border-black brutal-shadow pl-2 pr-4 py-2"
        >
          <span className="w-9 h-9 shrink-0">
            <Image src="/mascot-indoor.png" alt="" width={36} height={36} className="w-full h-full object-contain" />
          </span>
          Chat with Breezy
        </button>
      )}

      {/* Panel */}
      {open && (
        <div className="fixed bottom-5 right-5 z-50 w-[min(92vw,380px)] h-[min(72vh,560px)] flex flex-col border-2 border-black bg-white brutal-shadow">
          {/* Header */}
          <div className="flex items-center gap-3 p-3 border-b-2 border-black bg-[#4fc3f7]">
            <span className="w-9 h-9 shrink-0 border-2 border-black bg-white">
              <Image src="/mascot-indoor.png" alt="Breezy" width={36} height={36} className="w-full h-full object-contain" />
            </span>
            <div className="flex-1 leading-tight">
              <p className="font-display text-lg font-bold text-black">Breezy</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-black/70">Breezyair AI · replies instantly</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="p-1.5 border-2 border-black bg-white text-black">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 flex flex-col gap-3 bg-[#f5f7fa]">
            {messages.length === 0 && (
              <div className="border-2 border-black bg-white p-3 text-sm text-gray-600 leading-relaxed">
                <span className="font-bold text-[#111111]">Namaskara! I&apos;m Breezy 👋</span><br />
                Breezyair&apos;s AI assistant. Tell me what&apos;s up with your AC — not cooling, noisy, leaking? — and I&apos;ll get you a quick quote and a slot. Kannada / Hindi / English, whatever&apos;s easy.
              </div>
            )}

            {messages.map((m) => {
              const text = m.parts.filter((p) => p.type === "text").map((p) => (p as { text: string }).text).join("");
              if (!text) return null;
              const mine = m.role === "user";
              return (
                <div key={m.id} className={mine ? "self-end max-w-[85%]" : "self-start max-w-[85%]"}>
                  <div className={mine
                    ? "border-2 border-black bg-[#ffb74d] text-black px-3 py-2 text-sm"
                    : "border-2 border-black bg-white text-[#111111] px-3 py-2 text-sm"}>
                    {text}
                  </div>
                </div>
              );
            })}

            {busy && (
              <div className="self-start border-2 border-black bg-white px-3 py-2 text-sm text-gray-400">Breezy is typing…</div>
            )}

            {error && (
              <div className="border-2 border-black bg-[#ffe4e4] text-[#b91c1c] px-3 py-2 text-xs">
                Breezy isn&apos;t connected yet. Add <code>AI_GATEWAY_API_KEY</code> to switch the agent on — meanwhile,{" "}
                <a href="tel:+918660174569" className="underline font-bold">call Asad</a> or use{" "}
                <a href="/book" className="underline font-bold">the booking form</a>.
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={onSend} className="p-3 border-t-2 border-black bg-white flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message…"
              disabled={busy}
              className="flex-1 h-11 px-3 text-sm border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-[#4fc3f7] min-w-0 disabled:opacity-60"
              aria-label="Message Breezy"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label="Send"
              className="btn-lift h-11 w-11 shrink-0 flex items-center justify-center bg-[#4fc3f7] text-black border-2 border-black disabled:opacity-50 disabled:pointer-events-none"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
