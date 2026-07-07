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

const PERMITTED_START_HOUR = 9;  // 9am
const PERMITTED_END_HOUR = 20;   // 8pm

export const DND_CONNECTED = Boolean(process.env.DND_PROVIDER);

/** OPEN NODE — returns false (assume callable) until a DND provider is wired. */
async function isOnDnd(phone: string): Promise<boolean> {
  if (!DND_CONNECTED) {
    console.info("[compliance:stub] DND check skipped (no provider)", { phone });
    return false;
  }
  // TODO(connect-dnd): query NCPR/DND registry for `phone`
  throw new Error("DND provider configured but isOnDnd not implemented — see care/compliance.ts");
}

export interface ComplianceResult {
  allowed: boolean;
  reason?: string;
}

export async function canContact(phone: string, now = new Date()): Promise<ComplianceResult> {
  const hour = now.getHours();
  if (hour < PERMITTED_START_HOUR || hour >= PERMITTED_END_HOUR) {
    return { allowed: false, reason: `Outside permitted calling hours (${PERMITTED_START_HOUR}:00–${PERMITTED_END_HOUR}:00).` };
  }
  if (await isOnDnd(phone)) {
    return { allowed: false, reason: "Number is on the NCPR/DND registry." };
  }
  return { allowed: true };
}

/** Required opening line for every outbound Breezy Care contact. */
export const AI_DISCLOSURE = "Hi, this is Breezyair's AI assistant calling on behalf of Asad — is now an okay time?";
