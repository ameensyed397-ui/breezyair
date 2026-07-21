import { createAgentUIStreamResponse, type UIMessage } from "ai";
import { breezyAgent } from "@/lib/agent/breezy";
import { IS_MODEL_CONNECTED } from "@/lib/agent/model";
import { rateLimit, clientIp } from "@/lib/rate-limit";

// The Breezy agent runs on Node (Fluid Compute) so tool adapters can reach
// external services (Notion, WhatsApp) later.
export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Web chat door into Agent 1 (Breezy). The voice door lives at
 * /api/agent/voice and runs the exact same agent.
 */
export async function POST(req: Request) {
  // Rate limit: max 20 chat messages per minute per IP.
  const rl = rateLimit(`chat:${clientIp(req)}`, 20, 60_000);
  if (!rl.ok) {
    return Response.json(
      { error: "Too many messages. Please wait a moment before sending another." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    );
  }

  let messages: UIMessage[];
  try {
    const body = await req.json();
    messages = body.messages;
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!IS_MODEL_CONNECTED) {
    return Response.json(
      { error: "Breezy is temporarily unavailable. Please try the booking form or call us directly." },
      { status: 503 }
    );
  }

  return createAgentUIStreamResponse({
    agent: breezyAgent,
    uiMessages: messages,
  });
}

