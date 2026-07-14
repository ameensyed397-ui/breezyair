/**
 * ┌───────────────────────────────────────────────────────────────────────────┐
 * │  NOTIFY ADAPTER — WhatsApp (Meta Cloud API)                                  │
 * ├───────────────────────────────────────────────────────────────────────────┤
 * │  • sendConfirmation → WhatsApp message to the customer                       │
 * │  • flagUrgent       → WhatsApp ping to Asad on genuine emergencies           │
 * │                                                                             │
 * │  No WHATSAPP_TOKEN set → safe STUB (logs only). App still runs.              │
 * │                                                                             │
 * │  IMPORTANT (WhatsApp rules): messages we start (customer filled a web form / │
 * │  chat, not WhatsApp) are "business-initiated" and MUST use an approved       │
 * │  TEMPLATE. Set WHATSAPP_CONFIRM_TEMPLATE / WHATSAPP_ALERT_TEMPLATE to single- │
 * │  parameter ({{1}}) templates and the freeform message fills {{1}}. Without a  │
 * │  template we fall back to a plain-text send, which only works inside the      │
 * │  24-hour customer-service window. See WHATSAPP_SETUP.md.                      │
 * └───────────────────────────────────────────────────────────────────────────┘
 */

export const NOTIFY_CONNECTED = Boolean(process.env.WHATSAPP_TOKEN);

/** Asad's number for urgent escalations. */
const ASAD_PHONE = process.env.ASAD_ESCALATION_PHONE ?? "+918660174569";

const API_VERSION = process.env.WHATSAPP_API_VERSION ?? "v21.0";
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const TEMPLATE_LANG = process.env.WHATSAPP_TEMPLATE_LANG ?? "en";

interface WaSendResponse {
  messages?: { id: string }[];
  error?: { message?: string; code?: number };
}

/** WhatsApp wants digits only (country code + number, no '+' or spaces). */
function toWaNumber(phone: string): string {
  return phone.replace(/[^0-9]/g, "");
}

async function postToWhatsApp(body: Record<string, unknown>): Promise<{ ok: boolean; id?: string; error?: string }> {
  if (!PHONE_NUMBER_ID) {
    console.error("[notify] WHATSAPP_TOKEN set but WHATSAPP_PHONE_NUMBER_ID is missing — see WHATSAPP_SETUP.md");
    return { ok: false, error: "missing WHATSAPP_PHONE_NUMBER_ID" };
  }
  try {
    const res = await fetch(`https://graph.facebook.com/${API_VERSION}/${PHONE_NUMBER_ID}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messaging_product: "whatsapp", recipient_type: "individual", ...body }),
    });
    const data = (await res.json().catch(() => null)) as WaSendResponse | null;
    if (!res.ok || data?.error) {
      const error = data?.error?.message ?? `HTTP ${res.status}`;
      console.error("[notify] WhatsApp send failed:", error);
      return { ok: false, error };
    }
    return { ok: true, id: data?.messages?.[0]?.id };
  } catch (err) {
    console.error("[notify] WhatsApp request threw:", err);
    return { ok: false, error: err instanceof Error ? err.message : "unknown" };
  }
}

/** Send one freeform line, preferring an approved single-param template, else plain text. */
async function sendWhatsApp(to: string, message: string, template?: string): Promise<{ sent: boolean }> {
  const waTo = toWaNumber(to);

  if (template) {
    const result = await postToWhatsApp({
      to: waTo,
      type: "template",
      template: {
        name: template,
        language: { code: TEMPLATE_LANG },
        components: [{ type: "body", parameters: [{ type: "text", text: message }] }],
      },
    });
    return { sent: result.ok };
  }

  // Fallback: plain text (only delivered inside the 24h customer-service window).
  const result = await postToWhatsApp({ to: waTo, type: "text", text: { body: message } });
  return { sent: result.ok };
}

export async function sendConfirmation(to: string, message: string): Promise<{ sent: boolean }> {
  if (!NOTIFY_CONNECTED) {
    console.info("[notify:stub] sendConfirmation", { to, message });
    return { sent: false };
  }
  return sendWhatsApp(to, message, process.env.WHATSAPP_CONFIRM_TEMPLATE);
}

export async function flagUrgent(summary: string): Promise<{ escalated: boolean }> {
  if (!NOTIFY_CONNECTED) {
    console.warn("[notify:stub] flagUrgent -> would ping Asad", { asad: ASAD_PHONE, summary });
    return { escalated: false };
  }
  const { sent } = await sendWhatsApp(ASAD_PHONE, `🚨 Breezyair urgent: ${summary}`, process.env.WHATSAPP_ALERT_TEMPLATE);
  return { escalated: sent };
}
