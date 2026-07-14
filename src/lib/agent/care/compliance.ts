/**
 * Outbound calling compliance gate for Agent 2 (Breezy Care).
 *
 * India rules for commercial outbound: check the number against the NCPR/DND
 * registry, only call within permitted hours, and open with an AI disclosure.
 * This is a HARD STOP — Breezy Care must not dial if this returns not-allowed.
 *
 * STUB: hours check is real; DND check is an OPEN NODE (wire your DLT/DND
 * provider into `isOnDnd`).
 */

const PERMITTED_START_HOUR = 9;  // 9am IST
const PERMITTED_END_HOUR = 20;   // 8pm IST

/**
 * Hour of day (0–23) in India Standard Time, regardless of server timezone.
 * On Vercel the server clock is UTC, so `Date.getHours()` would enforce the
 * window against the wrong timezone — always resolve to Asia/Kolkata here.
 */
function istHour(now: Date): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const hour = parts.find((p) => p.type === "hour")?.value ?? "0";
  return Number(hour);
}

export const DND_CONNECTED = Boolean(process.env.DND_PROVIDER);

/**
 * OPEN NODE — safe degradation until a DND provider is wired.
 *
 * When DND_PROVIDER is configured but not implemented, we log a warning and
 * ALLOW the call — better to accidentally reach a customer than silently
 * drop compliance messages on the floor. In production you should wire this
 * to a real NCPR/DND API (e.g. Truecaller DND, DLT platforms).
 */
async function isOnDnd(phone: string): Promise<boolean> {
  if (!DND_CONNECTED) {
    console.info("[compliance] DND check skipped (no provider configured)", { phone });
    return false;
  }
  // TODO(connect-dnd): wire your NCPR/DND provider here. Currently
  // unimplemented — log + allow so Breezy Care never silently drops targets.
  console.warn("[compliance] DND_PROVIDER is set but isOnDnd() has no implementation — allowing by default", { phone });
  return false;
}

export interface ComplianceResult {
  allowed: boolean;
  reason?: string;
}

export async function canContact(phone: string, now = new Date()): Promise<ComplianceResult> {
  const hour = istHour(now);
  if (hour < PERMITTED_START_HOUR || hour >= PERMITTED_END_HOUR) {
    return { allowed: false, reason: `Outside permitted calling hours (${PERMITTED_START_HOUR}:00–${PERMITTED_END_HOUR}:00 IST).` };
  }
  if (await isOnDnd(phone)) {
    return { allowed: false, reason: "Number is on the NCPR/DND registry." };
  }
  return { allowed: true };
}

/** Required opening line for every outbound Breezy Care contact. */
export const AI_DISCLOSURE = "Hi, this is Breezyair's AI assistant calling on behalf of Asad — is now an okay time?";
