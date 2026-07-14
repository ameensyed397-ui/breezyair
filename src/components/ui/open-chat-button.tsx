"use client";

import { MessageSquare } from "lucide-react";

export function OpenChatButton() {
  return (
    <button
      type="button"
      onClick={() => {
        window.dispatchEvent(new Event("breezy:open"));
      }}
      className="card-lift bg-[#4fc3f7] flex items-center gap-4 p-4 border-2 border-black cursor-pointer"
    >
      <div className="w-11 h-11 bg-white border-2 border-black flex items-center justify-center shrink-0" aria-hidden="true">
        <MessageSquare className="w-5 h-5 text-[#4fc3f7]" />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-black/50">Got questions?</p>
        <p className="text-sm font-bold text-[#111111] mt-0.5">Chat with Breezy instead — instant answers</p>
      </div>
    </button>
  );
}
