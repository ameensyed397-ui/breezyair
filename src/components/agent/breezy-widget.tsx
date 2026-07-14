"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { X, Send, ThumbsUp, ThumbsDown } from "lucide-react";
import ReactMarkdown from "react-markdown";

/**
 * Breezy — the website "door" into Agent 1. The voice door (/api/agent/voice)
 * runs the same brain. Neo-brutalist mascot styling to match the site.
 */
export function BreezyWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<Record<string, "up" | "down">>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleFeedback = (id: string, type: "up" | "down") => {
    setFeedback((prev) => ({ ...prev, [id]: type }));
  };

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/agent/breezy" }),
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  // Let any "Chat with Breezy" button elsewhere on the site open this widget
  // by dispatching window.dispatchEvent(new Event("breezy:open")).
  useEffect(() => {
    const openHandler = () => setOpen(true);
    window.addEventListener("breezy:open", openHandler);
    return () => window.removeEventListener("breezy:open", openHandler);
  }, []);

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
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[60] flex flex-col items-end gap-2 group">
          {/* Tooltip bubble */}
          <div 
            onClick={() => setOpen(true)}
            className="hidden sm:flex items-center gap-2 bg-white border-2 border-black brutal-shadow px-4 py-2 cursor-pointer transform transition-transform hover:-translate-y-1"
          >
            <span className="text-[11px] font-bold uppercase tracking-widest text-black">Need AC help?</span>
          </div>
          
          <button
            onClick={() => setOpen(true)}
            aria-label="Chat with Breezy"
            className="btn-lift relative flex items-center justify-center bg-[#ffb74d] hover:bg-[#ffa726] border-2 border-black brutal-shadow rounded-full w-16 h-16 sm:w-20 sm:h-20 transition-transform"
          >
            {/* Notification Dot */}
            <div className="absolute top-0 right-0 w-4 h-4 sm:w-5 sm:h-5 bg-[#ef4444] border-2 border-black rounded-full animate-pulse z-10" />
            
            {/* Avatar */}
            <span className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-white border-2 border-transparent">
              <Image src="/breezy-avatar-doodle-v2.png" alt="" width={80} height={80} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
            </span>
          </button>
        </div>
      )}

      {/* Panel */}
      {open && (
        <div className="fixed bottom-5 right-5 z-50 w-[min(92vw,380px)] h-[min(72vh,560px)] flex flex-col border-2 border-black bg-white brutal-shadow">
          {/* Header */}
          <div className="flex items-center gap-3 p-3 border-b-2 border-black bg-[#ffb74d]">
            <span className="w-10 h-10 shrink-0 border-2 border-black bg-white rounded-full overflow-hidden flex items-center justify-center">
              <Image src="/breezy-avatar-doodle-v2.png" alt="Breezy" width={40} height={40} className="w-full h-full object-cover" />
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
              <div className="border-2 border-black bg-white p-3 text-sm text-[#111111] leading-relaxed brutal-shadow-sm">
                <p className="font-bold mb-2">Namaskara! I&apos;m Breezy 👋, Breezyair&apos;s AI assistant.</p>
                <p className="mb-2">Got an AC issue? Whether it&apos;s leaking, making a racket, or just blowing warm air, tell me what&apos;s wrong.</p>
                <p>I&apos;ll get you a ballpark quote and book a same-day fix. <span className="text-gray-500 italic text-xs">(English / Hindi / Kannada works!)</span></p>
              </div>
            )}

            {messages.map((m) => {
              const text = m.parts.filter((p) => p.type === "text").map((p) => (p as { text: string }).text).join("");
              if (!text) return null;
              const mine = m.role === "user";
              return (
                <div key={m.id} className={`flex flex-col gap-1 ${mine ? "self-end max-w-[85%]" : "self-start max-w-[85%]"}`}>
                  <div className={mine
                    ? "border-2 border-black bg-[#ffb74d] text-black px-3 py-2 text-sm"
                    : "border-2 border-black bg-white text-[#111111] px-3 py-2 text-sm"}>
                    {mine ? (
                      text
                    ) : (
                      <div className="space-y-2">
                        <ReactMarkdown
                          components={{
                            p: ({node, ...props}) => <p className="leading-relaxed" {...props} />,
                            strong: ({node, ...props}) => (
                              <strong 
                                className="font-bold" 
                                style={{ background: "linear-gradient(transparent 60%, rgba(79, 195, 247, 0.3) 60%)", paddingBottom: "1px" }} 
                                {...props} 
                              />
                            ),
                            a: ({node, ...props}) => <a className="text-[#0d47a1] underline font-bold" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc pl-4 space-y-1" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal pl-4 space-y-1" {...props} />,
                            li: ({node, ...props}) => <li className="marker:text-black" {...props} />,
                          }}
                        >
                          {text}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                  {!mine && (
                    <div className="flex items-center gap-2 self-start pl-1">
                      <button 
                        onClick={() => handleFeedback(m.id, "up")}
                        className={`p-1 rounded transition-transform hover:scale-110 ${feedback[m.id] === "up" ? "text-[#4fc3f7] opacity-100" : "text-gray-400 opacity-60 hover:opacity-100 hover:text-gray-600"}`}
                        aria-label="Helpful"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleFeedback(m.id, "down")}
                        className={`p-1 rounded transition-transform hover:scale-110 ${feedback[m.id] === "down" ? "text-[#ef4444] opacity-100" : "text-gray-400 opacity-60 hover:opacity-100 hover:text-gray-600"}`}
                        aria-label="Not helpful"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            {busy && (
              <div className="self-start border-2 border-black bg-white px-3 py-2 text-sm text-gray-400">Breezy is typing…</div>
            )}

            {error && (
              <div className="border-2 border-black bg-[#ffe4e4] text-[#b91c1c] px-3 py-2 text-xs brutal-shadow-sm">
                <p className="font-bold mb-1">Oops, my brain is offline right now!</p>
                <p>
                  While we get me reconnected, please <a href="tel:+918660174569" className="underline font-bold">call Asad directly</a> or use{" "}
                  <a href="/book" className="underline font-bold">the booking form</a>. 
                  <span className="hidden"> (Devs: Check AI_GATEWAY_API_KEY)</span>
                </p>
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
