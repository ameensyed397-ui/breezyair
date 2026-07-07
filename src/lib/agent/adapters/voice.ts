/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║  🎙️  VOICE NODE — LEFT OPEN, READY TO CONNECT                              ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║  This is the door for phone / voice into the SAME "Breezy" brain that the  ║
 * ║  website chat widget uses. Nothing here is implemented yet — it is the     ║
 * ║  contract a voice provider plugs into. Same agent, same tools, same CRM.   ║
 * ║                                                                             ║
 * ║  HOW TO CONNECT A VOICE PROVIDER (Vapi / Retell / ElevenLabs / Twilio):    ║
 * ║   • Provider handles telephony + speech-to-text + text-to-speech.          ║
 * ║   • On each caller utterance, provider POSTs the running transcript to      ║
 * ║     /api/agent/voice (see app/api/agent/voice/route.ts).                    ║
 * ║   • That route feeds the transcript into the Breezy agent (breezy.ts) and   ║
 * ║     returns the agent's reply text for the provider to speak.               ║
 * ║   • Missed inbound calls → provider triggers the same endpoint with         ║
 * ║     source "Missed-Call".                                                    ║
 * ║                                                                             ║
 * ║  Implement `speak()` + set VOICE_PROVIDER to flip VOICE_CONNECTED true.     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import type { LeadSource } from "@/lib/agent/types";

export const VOICE_CONNECTED = Boolean(process.env.VOICE_PROVIDER);

/** A single turn coming in from a voice channel. */
export interface VoiceTurn {
  /** Caller phone number, if the provider passes it. */
  callerId?: string;
  /** Full running transcript or latest utterance. */
  transcript: string;
  /** Distinguishes a live call from a missed-call callback. */
  source: Extract<LeadSource, "Call-In" | "Missed-Call">;
  /** BCP-47 hints the caller's language, e.g. "kn-IN" | "hi-IN" | "en-IN". */
  languageHint?: string;
}

/**
 * The reply the voice provider should speak back.
 * `text` is always produced by the Breezy agent; `ssml` is optional if the
 * connected provider supports it.
 */
export interface VoiceReply {
  text: string;
  ssml?: string;
  endCall?: boolean;
}

/**
 * OPEN NODE — not implemented. When a voice provider is connected, this returns
 * the audio-ready reply. Until then the /api/agent/voice route still runs the
 * agent brain and returns text, so you can test the pipeline before wiring audio.
 */
export async function speak(_reply: VoiceReply): Promise<never> {
  throw new Error(
    "Voice node is open but not connected. Set VOICE_PROVIDER and implement speak() in adapters/voice.ts to connect Vapi/Retell/ElevenLabs/Twilio."
  );
}
