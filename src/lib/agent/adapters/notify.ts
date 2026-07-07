/**
 * ┌───────────────────────────────────────────────────────────────────────────┐
 * │  NOTIFY ADAPTER — OPEN INTEGRATION NODE (WhatsApp / Asad escalation)       │
 * ├───────────────────────────────────────────────────────────────────────────┤
 * │  Sends the WhatsApp booking confirmation to the customer and pings Asad on │
 * │  true emergencies. STUB for now (logs only).                                │
 * │                                                                             │
 * │  TO CONNECT: wire WHATSAPP_TOKEN / a provider (Meta Cloud API, Gupshup,    │
 * │  Twilio) into the two functions below. Shapes are already final.           │
 * └───────────────────────────────────────────────────────────────────────────┘
 */

export const NOTIFY_CONNECTED = Boolean(process.env.WHATSAPP_TOKEN);

/** Asad's number for urgent escalations. */
const ASAD_PHONE = process.env.ASAD_ESCALATION_PHONE ?? "+918660174569";

export async function sendConfirmation(to: string, message: string): Promise<{ sent: boolean }> {
  if (!NOTIFY_CONNECTED) {
    console.info("[notify:stub] sendConfirmation", { to, message });
    return { sent: false };
  }
  // TODO(connect-whatsapp): POST to WhatsApp provider with { to, message }
  throw new Error("WhatsApp configured but sendConfirmation not yet implemented — see adapters/notify.ts");
}

export async function flagUrgent(summary: string): Promise<{ escalated: boolean }> {
  if (!NOTIFY_CONNECTED) {
    console.warn("[notify:stub] flagUrgent -> would ping Asad", { asad: ASAD_PHONE, summary });
    return { escalated: false };
  }
  // TODO(connect-whatsapp): ping ASAD_PHONE immediately with the urgent summary
  throw new Error("WhatsApp configured but flagUrgent not yet implemented — see adapters/notify.ts");
}
