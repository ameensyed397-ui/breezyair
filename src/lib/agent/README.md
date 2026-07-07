# Breezyair Agents

Two agents, by design — the ceiling, not the floor. Resist adding a third.

```
                         ┌────────────────────────────┐
  Website chat  ───────► │                            │
  (BreezyWidget)         │   AGENT 1 · "Breezy"        │──► get_pricing (pricing.ts)
                         │   Lead Capture & Booking    │──► check_availability ┐
  🎙️ Voice (OPEN NODE) ─► │   lib/agent/breezy.ts       │──► book_slot          ├─► CRM adapter
  /api/agent/voice       │                            │──► create_lead        ┘   (adapters/crm.ts)
                         └────────────────────────────┘──► flag_urgent ──► notify (adapters/notify.ts)

  Daily cron ──────────► ┌────────────────────────────┐
  /api/agent/care/run    │   AGENT 2 · "Breezy Care"   │──► compliance gate (NCPR/DND + hours)
                         │   Follow-up & Renewal       │──► notify adapter
                         │   care/breezy-care.ts       │   (review / AMC renewal / re-engage)
                         └────────────────────────────┘
```

Both agents share ONE pricing source (`pricing.ts`) and ONE CRM (`adapters/crm.ts`),
so they never contradict each other.

## What works today (no external services)
- Web chat widget → `/api/agent/breezy` → Breezy agent → tools → **stub** adapters (log + mock).
- Voice route `/api/agent/voice` runs the same brain and returns **text** (test the full
  diagnose→quote→capture→book pipeline before wiring any telephony).
- Only requirement to switch the LLM on: `AI_GATEWAY_API_KEY` (see `.env.example`).

## Open nodes — left ready to connect
| Node | File | Connect by |
|------|------|-----------|
| 🎙️ **Voice** | `adapters/voice.ts` + `app/api/agent/voice/route.ts` | Point Vapi/Retell/ElevenLabs/Twilio webhook at the voice route; implement `speak()`. |
| 🗂️ **Notion CRM** | `adapters/crm.ts` | `npm i @notionhq/client`, set `NOTION_*`, implement 3 functions. |
| 💬 **WhatsApp** | `adapters/notify.ts` | Wire Meta Cloud API / Gupshup / Twilio into 2 functions. |
| ☎️ **DND/NCPR** | `care/compliance.ts` | Wire DND provider into `isOnDnd`. |

Each adapter auto-detects its env var and falls back to a safe stub, so the app
always builds and runs. Nothing in the agents changes when you connect a node.

## Model
`model.ts` — one env-configurable string via the Vercel AI Gateway
(`BREEZY_MODEL`, default `anthropic/claude-sonnet-4-6`).
