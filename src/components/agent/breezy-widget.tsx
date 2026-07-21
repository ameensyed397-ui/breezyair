"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

const BreezyChatPanel = dynamic(
  () => import("./breezy-chat-panel").then((m) => ({ default: m.BreezyChatPanel })),
  { ssr: false }
);

/**
 * Breezy — the website "door" into Agent 1. The voice door (/api/agent/voice)
 * runs the same brain. Neo-brutalist mascot styling to match the site.
 *
 * This component is a lightweight launcher. The heavy chat panel (ai-sdk, zod,
 * react-markdown) only loads when the user opens the chat.
 */
export function BreezyWidget() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const openHandler = () => setOpen(true);
    window.addEventListener("breezy:open", openHandler);
    return () => window.removeEventListener("breezy:open", openHandler);
  }, []);

  return (
    <>
      {/* Launcher — zero heavy deps */}
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

      {/* Chat panel — loaded lazily only when opened */}
      {open && <BreezyChatPanel onClose={() => setOpen(false)} />}
    </>
  );
}
