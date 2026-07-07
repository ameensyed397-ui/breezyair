/**
 * Central model configuration for all Breezyair agents.
 *
 * Uses the Vercel AI Gateway — model IDs are plain "provider/model" strings, so
 * you can switch providers without changing code. Set AI_GATEWAY_API_KEY (or run
 * on Vercel with OIDC) to authenticate.
 *
 * To see the latest available model IDs:
 *   curl -s https://ai-gateway.vercel.sh/v1/models | jq -r '.data[].id'
 */

export const BREEZY_MODEL = process.env.BREEZY_MODEL ?? "anthropic/claude-sonnet-4-6";
