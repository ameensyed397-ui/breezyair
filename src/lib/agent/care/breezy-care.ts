/**
 * AGENT 2 — "Breezy Care": Follow-up & Renewal.
 *
 * Outbound and SCHEDULED (not live/reactive like Breezy). Runs as a daily batch:
 *   • Serviced yesterday        → review request
 *   • AMC expiring in 30 days   → renewal reminder (with real plan pricing)
 *   • Lead stuck at "New" 48h+  → gentle re-engagement
 *
 * Every contact passes the compliance gate first (care/compliance.ts) and opens
 * with the AI disclosure. Shares the SAME Notion CRM + pricing source as Breezy,
 * so the two agents never contradict each other.
 *
 * STATUS: phase-2 scaffold. The batch shape and compliance gate are real; the
 * CRM queries + send are OPEN NODES wired through the same adapters as Breezy.
 */

import { AMC_PLANS } from "@/lib/agent/pricing";
import { canContact, AI_DISCLOSURE } from "@/lib/agent/care/compliance";
import { sendConfirmation } from "@/lib/agent/adapters/notify";
import { CRM_CONNECTED } from "@/lib/agent/adapters/crm";

export const BREEZY_CARE_INSTRUCTIONS = `You are "Breezy Care", Breezyair's outbound follow-up assistant. You are warm, brief and single-purpose. Always open with: "${AI_DISCLOSURE}". One message = one job (a review request, an AMC renewal, or a gentle nudge). Never hard-sell. Use real plan pricing: ${AMC_PLANS.map((p) => `${p.name} ${p.price}`).join(", ")}. If the person is busy or says no, thank them and stop.`;

export type CareReason = "review" | "amc-renewal" | "re-engagement";

export interface CareTarget {
  name: string;
  phone: string;
  reason: CareReason;
}

/** OPEN NODE — replace with real Notion queries once CRM is connected. */
async function findTodaysTargets(): Promise<CareTarget[]> {
  if (!CRM_CONNECTED) {
    console.info("[breezy-care:stub] findTodaysTargets — CRM not connected, returning none");
    return [];
  }
  // TODO(connect-notion): query Leads for status=Serviced(yesterday) | AMC expiring in 30d | status=New >48h
  throw new Error("CRM connected but findTodaysTargets not implemented — see care/breezy-care.ts");
}

function composeMessage(t: CareTarget): string {
  switch (t.reason) {
    case "review":
      return `${AI_DISCLOSURE} ${t.name}, hope your AC's running cool after Asad's visit! If you have 20 seconds, a quick Google review really helps us. 🙏`;
    case "amc-renewal":
      return `${AI_DISCLOSURE} ${t.name}, your Breezyair AMC is up for renewal soon. Want me to renew your plan (from ${AMC_PLANS[0].price}) so you don't miss a service?`;
    case "re-engagement":
      return `${AI_DISCLOSURE} ${t.name}, you enquired about AC service recently — still need a hand? Happy to book you a slot whenever suits.`;
  }
}

export interface CareRunSummary {
  considered: number;
  contacted: number;
  skipped: { phone: string; reason: string }[];
}

/** Daily batch entry point (called by the cron route). */
export async function runBreezyCareBatch(now = new Date()): Promise<CareRunSummary> {
  const targets = await findTodaysTargets();
  const summary: CareRunSummary = { considered: targets.length, contacted: 0, skipped: [] };

  for (const t of targets) {
    const gate = await canContact(t.phone, now);
    if (!gate.allowed) {
      summary.skipped.push({ phone: t.phone, reason: gate.reason ?? "blocked" });
      continue;
    }
    await sendConfirmation(t.phone, composeMessage(t));
    summary.contacted += 1;
    // TODO(connect-notion): write outcome back to the lead's record
  }

  return summary;
}
