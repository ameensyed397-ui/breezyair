/**
 * 🎙️ VOICE DOOR — PARKED.
 *
 * The voice channel is intentionally switched off for now while we focus on the
 * web chat + CRM. The wiring for it (same Breezy brain, adapters/voice.ts) is
 * kept intact so it can be re-enabled later without a rewrite — flip
 * VOICE_PARKED to false (and set AI_GATEWAY_API_KEY) to bring it back.
 */

import { breezyAgent } from "@/lib/agent/breezy";
import { VOICE_CONNECTED, type VoiceTurn } from "@/lib/agent/adapters/voice";
import { IS_MODEL_CONNECTED } from "@/lib/agent/model";

export const runtime = "nodejs";
export const maxDuration = 60;

/** Master switch. While true, the voice endpoint responds 503 and never runs the agent. */
const VOICE_PARKED = true;

export async function POST(req: Request) {
  if (VOICE_PARKED) {
    return Response.json(
      { error: "Voice channel is parked. Use the web chat (/api/agent/breezy) or the booking form for now." },
      { status: 503 }
    );
  }

  const turn = (await req.json()) as Partial<VoiceTurn>;

  if (!turn.transcript) {
    return Response.json({ error: "Missing 'transcript'." }, { status: 400 });
  }

  if (!IS_MODEL_CONNECTED) {
    return Response.json(
      { error: "Breezy is temporarily unavailable. Please try the booking form or call us directly." },
      { status: 503 }
    );
  }

  const result = await breezyAgent.generate({
    prompt: turn.transcript,
  });

  // When a provider is connected, hand result.text to adapters/voice.ts speak().
  return Response.json({
    text: result.text,
    voiceConnected: VOICE_CONNECTED,
    note: VOICE_CONNECTED ? undefined : "Voice provider not connected — returning text only. See adapters/voice.ts.",
  });
}

export function GET() {
  return Response.json({
    node: "voice",
    status: VOICE_PARKED ? "parked" : "open — awaiting provider",
    connect: "Set VOICE_PARKED=false in this route, then point your voice provider's webhook here.",
  });
}
