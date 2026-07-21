# Vercel Environment Variables

The site reads all its env vars at runtime on Vercel. Any var that is **missing
in Vercel but present in `.env.local`** will silently fail in production.

This doc is the deployment-time checklist — use it whenever you onboard a new
secret or suspect a production-only bug.

## How to set / edit

1. Open <https://vercel.com/dashboard> → select the `breezyair` project.
2. **Settings** → **Environment Variables**.
3. Add the key + value, then pick which environments it applies to:
   - **Production** — `breezyair.co`
   - **Preview** — every PR / branch deploy
   - **Development** — `vercel dev` locally
4. **Save**. New vars require a redeploy (Vercel will prompt or you can hit
   **Deployments → ⋯ → Redeploy**).

> Tip: when adding LLM keys, set them in **all three** environments so preview
> branches can also chat. Notion keys only need Production.

## Required for the site to work in production

### LLM (chatbot)

The Breezy chat widget calls `/api/agent/breezy`. The model resolver in
`src/lib/agent/model.ts` checks keys in this order — set **one** of them.

| Var                              | Notes                                                                                  |
|----------------------------------|----------------------------------------------------------------------------------------|
| `AI_GATEWAY_API_KEY`             | Recommended. OIDC works automatically on Vercel; create one at Vercel → AI Gateway.    |
| `GOOGLE_GENERATIVE_AI_API_KEY`   | Direct Gemini. Set `BREEZY_MODEL=gemini-2.5-flash` to override the default.            |
| `KIMI_API_KEY`                   | Moonshot direct.                                                                        |
| `OPENAI_API_KEY`                 | Any OpenAI-compatible endpoint (set `OPENAI_BASE_URL` for non-OpenAI hosts).            |
| `DEEPSEEK_API_KEY`               | DeepSeek direct.                                                                        |
| `MINIMAX_API_KEY`                | MiniMax direct.                                                                        |

Optional:
- `BREEZY_MODEL` — override the default model slug (e.g. `gemini-2.5-flash`,
  `moonshotai/kimi-k2`, `deepseek/deepseek-v3.1`).

> ⚠️ **DO NOT** rely on the AI Gateway on Vercel without setting
> `AI_GATEWAY_API_KEY` explicitly. `process.env.VERCEL=1` is always set on
> Vercel, but the resolver requires an explicit key (commit `59f7e2e`).

### Notion CRM

Without these, forms are logged to stdout only and the Breezy agent cannot
look up availability.

| Var                          | Purpose                                       | Source                              |
|------------------------------|-----------------------------------------------|-------------------------------------|
| `NOTION_TOKEN`               | Integration secret                             | <https://www.notion.so/my-integrations> |
| `NOTION_LEADS_DB`            | 32-char ID of the Leads DB                     | DB URL                              |
| `NOTION_APPOINTMENTS_DB`     | 32-char ID of the Appointments DB              | DB URL                              |
| `NOTION_AMC_DB`              | 32-char ID of the AMC Contracts DB             | DB URL                              |
| `NOTION_B2B_LEADS_DB`        | 32-char ID of the B2B Leads DB                 | DB URL                              |
| `NOTION_TECHNICIANS_DB`      | (Reserved — not yet used)                      | DB URL                              |

Database schemas are documented in `NOTION_SETUP.md`.

### Cron protection

| Var            | Purpose                                                          |
|----------------|------------------------------------------------------------------|
| `CRON_SECRET`  | Verifies calls to `/api/agent/care/run`. Use a long random value (`openssl rand -hex 32`). Vercel passes it as `Authorization: Bearer <secret>`. |

## Optional (graceful stubs if missing)

These features are no-ops when unset — leave them off until you're ready to use them.

| Var                          | Purpose                                       | Setup doc                  |
|------------------------------|-----------------------------------------------|----------------------------|
| `RAZORPAY_KEY_ID`            | Online payment (Razorpay)                     | Razorpay dashboard         |
| `RAZORPAY_KEY_SECRET`        | Online payment (Razorpay)                     | Razorpay dashboard         |
| `WHATSAPP_TOKEN`             | WhatsApp confirmations + urgent alerts         | `WHATSAPP_SETUP.md`        |
| `WHATSAPP_PHONE_NUMBER_ID`   | WhatsApp sender                                | `WHATSAPP_SETUP.md`        |
| `WHATSAPP_CONFIRM_TEMPLATE`  | Approved template name (customer confirm)     | `WHATSAPP_SETUP.md`        |
| `WHATSAPP_ALERT_TEMPLATE`    | Approved template name (urgent alert to Asad)  | `WHATSAPP_SETUP.md`        |
| `ASAD_ESCALATION_PHONE`      | Who receives urgent alerts (default `+918660174569`) | —                    |
| `VOICE_PROVIDER`             | Voice channel (parked)                        | —                          |
| `DND_PROVIDER`               | NCPR/DND compliance check (stub)              | —                          |
| `GOOGLE_SITE_VERIFICATION`   | Google Search Console verification token      | search.google.com/search-console |
| `SANITY_API_READ_TOKEN`      | Read token for private Sanity datasets        | sanity.io                  |

## Public vars (`NEXT_PUBLIC_*`)

These are exposed to the browser and **must not** contain secrets. Set them in
Vercel like any other var.

| Var                              | Purpose                  |
|----------------------------------|--------------------------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID`  | Sanity project ID        |
| `NEXT_PUBLIC_SANITY_DATASET`     | Sanity dataset (default `production`) |

## Verifying after a deploy

```bash
# Chatbot health
curl -X POST https://breezyair.co/api/agent/breezy \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"hi"}]}'

# Notion smoke (any enquiry form)
curl -X POST https://breezyair.co/api/enquiry \
  -H "Content-Type: application/json" \
  -d '{"type":"contact","name":"Verify","phone":"+919999999999","locality":"Koramangala","issueType":"verify","urgency":"Normal","honeyPot":""}'
```

If the chatbot returns `503` → LLM key missing. If the form logs
`[crm:stub] createLead` → Notion env var missing.

## Notes

- Vercel encrypts all env vars at rest. They are injected at build time (for
  `NEXT_PUBLIC_*` + server vars used during static generation) and at runtime
  for everything else.
- Changing a var does **not** auto-redeploy existing deployments. You must
  redeploy for new values to take effect.
- Vercel free tier limits cron invocations to 2/day on Hobby, 40/day on Pro.
  Breezy Care runs once daily so this is fine.
