/**
 * 🎙️ VOICE DOOR — OPEN NODE into Agent 1 (Breezy).
 *
 * A connected voice provider (Vapi / Retell / ElevenLabs / Twilio) POSTs the
 * caller transcript here; we run the SAME Breezy brain and return reply text for
 * the provider to speak. Audio synthesis itself is the open node in
 * lib/agent/adapters/voice.ts (`speak()`), intentionally not implemented yet.
 *
 * This route already works for TEXT so you can test the full pipeline (diagnose
 * → quote → capture → book) before any telephony is wired.
 */

import { breezyAgent } from "@/lib/agent/breezy";
import { VOICE_CONNECTED, type VoiceTurn } from "@/lib/agent/adapters/voice";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  const turn = (await req.json()) as Partial<VoiceTurn>;

  if (!turn.transcript) {
    return Response.json({ error: "Missing 'transcript'." }, { status: 400 });
  }

  if (!process.env.AI_GATEWAY_API_KEY && !process.env.VERCEL) {
    return Response.json(
      { error: "Breezy is not connected yet. Set AI_GATEWAY_API_KEY to switch the agent on." },
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
    status: "open — awaiting provider",
    connect: "Point your voice provider's webhook here (POST { transcript, callerId?, source, languageHint? }).",
  });
}
