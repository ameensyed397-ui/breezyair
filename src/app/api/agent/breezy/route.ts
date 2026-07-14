import { createAgentUIStreamResponse, type UIMessage } from "ai";
import { breezyAgent } from "@/lib/agent/breezy";
import { IS_MODEL_CONNECTED } from "@/lib/agent/model";

// The Breezy agent runs on Node (Fluid Compute) so tool adapters can reach
// external services (Notion, WhatsApp) later.
export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Web chat door into Agent 1 (Breezy). The voice door lives at
 * /api/agent/voice and runs the exact same agent.
 */
export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  if (!IS_MODEL_CONNECTED) {
    return Response.json(
      { error: "Breezy is not connected yet. Set an LLM API key (AI_GATEWAY_API_KEY, KIMI_API_KEY, MINIMAX_API_KEY, DEEPSEEK_API_KEY, or OPENAI_API_KEY) in .env.local to switch the agent on." },
      { status: 503 }
    );
  }

  return createAgentUIStreamResponse({
    agent: breezyAgent,
    uiMessages: messages,
  });
}
