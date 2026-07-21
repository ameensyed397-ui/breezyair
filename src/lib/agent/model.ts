import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { gateway } from "@ai-sdk/gateway";

/**
 * Checks if any valid LLM configuration key is present.
 */
export const IS_MODEL_CONNECTED = Boolean(
  process.env.AI_GATEWAY_API_KEY ||
  process.env.KIMI_API_KEY ||
  process.env.MINIMAX_API_KEY ||
  process.env.DEEPSEEK_API_KEY ||
  process.env.OPENAI_API_KEY ||
  process.env.GOOGLE_GENERATIVE_AI_API_KEY
);

/**
 * Central model resolver for all Breezyair agents.
 * Supports:
 * 1. Vercel AI Gateway (via AI_GATEWAY_API_KEY)
 * 2. Moonshot / Kimi directly (via KIMI_API_KEY)
 * 3. Minimax directly (via MINIMAX_API_KEY)
 * 4. DeepSeek directly (via DEEPSEEK_API_KEY)
 * 5. Google Gemini natively (via GOOGLE_GENERATIVE_AI_API_KEY)
 * 6. Generic OpenAI-compatible endpoint (via OPENAI_API_KEY + OPENAI_BASE_URL)
 */
function resolveModel() {
  if (process.env.AI_GATEWAY_API_KEY) {
    // Open-weight default — no Claude/OpenAI key required. Override with BREEZY_MODEL.
    // Strong open alternatives on the gateway: "moonshotai/kimi-k2",
    // "deepseek/deepseek-v3.1", "zai/glm-4.6", "minimax/minimax-m2".
    // Verify slugs: curl -s https://ai-gateway.vercel.sh/v1/models | jq -r '.data[].id'
    const modelId = process.env.BREEZY_MODEL ?? "moonshotai/kimi-k2";
    return gateway(modelId);
  }

  if (process.env.KIMI_API_KEY) {
    const provider = createOpenAI({
      apiKey: process.env.KIMI_API_KEY,
      baseURL: "https://api.moonshot.cn/v1",
    });
    const modelId = process.env.BREEZY_MODEL ?? "moonshot-v1-8k";
    return provider.chat(modelId);
  }

  if (process.env.MINIMAX_API_KEY) {
    const provider = createOpenAI({
      apiKey: process.env.MINIMAX_API_KEY,
      baseURL: "https://api.minimax.chat/v1",
    });
    const modelId = process.env.BREEZY_MODEL ?? "abab6.5g-chat";
    return provider.chat(modelId);
  }

  if (process.env.DEEPSEEK_API_KEY) {
    const provider = createOpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseURL: "https://api.deepseek.com/v1",
    });
    const modelId = process.env.BREEZY_MODEL ?? "deepseek-chat";
    return provider.chat(modelId);
  }

  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    const provider = createGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    });
    const modelId = process.env.BREEZY_MODEL ?? "gemini-1.5-flash";
    return provider(modelId);
  }

  if (process.env.OPENAI_API_KEY) {
    const provider = createOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.OPENAI_BASE_URL,
    });
    const modelId = process.env.BREEZY_MODEL ?? "gpt-4o-mini";
    return provider.chat(modelId);
  }

  // Graceful fallback for build step / offline development
  return "moonshotai/kimi-k2";
}

export const BREEZY_MODEL = resolveModel();
