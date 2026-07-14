# WhatsApp Notifications Setup (Meta Cloud API)

Breezyair sends two kinds of WhatsApp messages:

1. **Booking confirmation** to the customer ("Asad will call you in 30 minutes…").
2. **Urgent alert** to Asad when a lead is flagged as an emergency.

With `WHATSAPP_TOKEN` unset the app runs in a safe stub (logs only), so nothing
breaks before this is configured.

## Why templates are required

Both messages are **business-initiated** — the customer reached us via a web form
or the chat widget, not via WhatsApp. WhatsApp only allows business-initiated
messages through a **pre-approved message template**. Plain text is allowed *only*
inside a 24-hour window after the user messages your WhatsApp number first, so it
is not reliable for these alerts. Create the two templates below.

## 1. Create a Meta WhatsApp app

1. <https://developers.facebook.com> → create/select an app → add **WhatsApp**.
2. In **WhatsApp → API Setup**, note:
   - **Temporary access token** (for testing) or create a **System User token**
     (permanent) under Business Settings → this is `WHATSAPP_TOKEN`.
   - **Phone number ID** of your sender number → this is `WHATSAPP_PHONE_NUMBER_ID`.
3. Add and verify your business phone number.

## 2. Create two message templates

**WhatsApp Manager → Message templates → Create template.** Category **Utility**.
Give each a body with a single variable `{{1}}` — the app fills it with the full
message text.

| Env var                     | Suggested template name | Body                                   |
|-----------------------------|-------------------------|----------------------------------------|
| `WHATSAPP_CONFIRM_TEMPLATE` | `breezyair_confirm`     | `{{1}}`                                |
| `WHATSAPP_ALERT_TEMPLATE`   | `breezyair_alert`       | `{{1}}`                                |

(You can add fixed wording around `{{1}}`, e.g. `Breezyair: {{1}}` — the variable
must exist.) Wait for **Approved** status (usually minutes to a few hours).

## 3. Set the env vars

In `.env.local` and in Vercel project settings:

```bash
WHATSAPP_TOKEN=EAAG...                 # access token
WHATSAPP_PHONE_NUMBER_ID=123456789012345
WHATSAPP_CONFIRM_TEMPLATE=breezyair_confirm
WHATSAPP_ALERT_TEMPLATE=breezyair_alert
# WHATSAPP_TEMPLATE_LANG=en            # match your template's language
ASAD_ESCALATION_PHONE=+918660174569    # who gets urgent alerts
```

## 4. Test

With the dev server running:

```bash
# Urgent alert path (fires flagUrgent → Asad)
curl -X POST http://localhost:3000/api/enquiry -H "Content-Type: application/json" \
  -d '{"type":"booking","name":"Test","phone":"+91XXXXXXXXXX","locality":"koramangala","urgency":"Urgent","slotDate":"2026-07-20","slotTime":"morning","honeyPot":""}'
```

Asad's number should receive the alert. Check server logs for `[notify]` errors if
not (common causes: template not approved, wrong `WHATSAPP_PHONE_NUMBER_ID`, or the
recipient hasn't been added as a test number on a trial app).

## Notes

- On a **trial** app, Meta only delivers to phone numbers you've added as
  recipients in API Setup. Move to a live app + verified business to reach any number.
- Token, phone number ID and templates are the only things the code needs — the
  message wording itself lives in the app (`sendConfirmation` / `flagUrgent`).
