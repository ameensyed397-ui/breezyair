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
 */

import { AMC_PLANS } from "@/lib/agent/pricing";
import { canContact, AI_DISCLOSURE } from "@/lib/agent/care/compliance";
import { sendConfirmation } from "@/lib/agent/adapters/notify";
import {
  CRM_CONNECTED,
  findRenewalsDue,
  findRecentlyServiced,
  findStaleLeads,
  updateLeadStatus,
} from "@/lib/agent/adapters/crm";

export const BREEZY_CARE_INSTRUCTIONS = `You are "Breezy Care", Breezyair's outbound follow-up assistant. You are warm, brief and single-purpose. Always open with: "${AI_DISCLOSURE}". One message = one job (a review request, an AMC renewal, or a gentle nudge). Never hard-sell. Use real plan pricing: ${AMC_PLANS.map((p) => `${p.name} ${p.price}`).join(", ")}. If the person is busy or says no, thank them and stop.`;

export type CareReason = "review" | "amc-renewal" | "re-engagement";

export interface CareTarget {
  name: string;
  phone: string;
  reason: CareReason;
  plan?: string; // for amc-renewal
  price?: string; // for amc-renewal
}

/** Build today's outbound list from all three CRM query sources. */
async function findTodaysTargets(): Promise<CareTarget[]> {
  if (!CRM_CONNECTED) {
    console.info("[breezy-care] findTodaysTargets — CRM not connected, returning none");
    return [];
  }

  const [renewals, serviced, stale] = await Promise.all([
    findRenewalsDue(30),
    findRecentlyServiced(),
    findStaleLeads(),
  ]);

  const targets: CareTarget[] = [];

  // AMC renewal reminders (with plan pricing from the source of truth)
  for (const r of renewals) {
    const plan = AMC_PLANS.find((p) => p.name.toLowerCase().includes(r.plan.toLowerCase().split(" ")[0]));
    targets.push({
      name: r.name,
      phone: r.phone,
      reason: "amc-renewal",
      plan: r.plan,
      price: plan?.price || "₹1,499",
    });
  }

  // Review requests — serviced yesterday
  for (const s of serviced) {
    targets.push({ name: s.name, phone: s.phone, reason: "review" });
  }

  // Re-engagement — stale leads stuck at "New"
  for (const s of stale) {
    targets.push({ name: s.name, phone: s.phone, reason: "re-engagement" });
  }

  return targets;
}

function composeMessage(t: CareTarget): string {
  switch (t.reason) {
    case "review":
      return `${AI_DISCLOSURE} ${t.name}, hope your AC's running cool after Asad's visit! If you have 20 seconds, a quick Google review really helps us. 🙏`;
    case "amc-renewal":
      return `${AI_DISCLOSURE} ${t.name}, your Breezyair ${t.plan ?? "AMC"} plan is up for renewal soon (renew from ${t.price ?? AMC_PLANS[0].price}). Want me to lock it in so you don't miss a service?`;
    case "re-engagement":
      return `${AI_DISCLOSURE} ${t.name}, you enquired about AC service recently — still need a hand? Happy to book you a slot whenever suits.`;
  }
}

export interface CareRunSummary {
  considered: number;
  contacted: number;
  skipped: { phone: string; reason: string }[];
  outcomes: { phone: string; reason: CareReason; sent: boolean; noted: boolean }[];
}

/** Daily batch entry point (called by the cron route). */
export async function runBreezyCareBatch(now = new Date()): Promise<CareRunSummary> {
  const targets = await findTodaysTargets();
  const summary: CareRunSummary = { considered: targets.length, contacted: 0, skipped: [], outcomes: [] };

  for (const t of targets) {
    const gate = await canContact(t.phone, now);
    if (!gate.allowed) {
      summary.skipped.push({ phone: t.phone, reason: gate.reason ?? "blocked" });
      continue;
    }

    await sendConfirmation(t.phone, composeMessage(t));
    summary.contacted += 1;

    // Write outcome back to the lead's CRM record
    const note =
      t.reason === "review"
        ? "Review request sent via Breezy Care"
        : t.reason === "amc-renewal"
        ? `AMC renewal reminder sent (${t.plan ?? "unknown plan"}, ${t.price ?? "unknown price"})`
        : "Re-engagement message sent via Breezy Care";

    const { updated } = await updateLeadStatus(t.phone, "Followed-up", note);
    summary.outcomes.push({ phone: t.phone, reason: t.reason, sent: true, noted: updated });
  }

  return summary;
}
