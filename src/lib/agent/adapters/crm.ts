/**
 * ┌───────────────────────────────────────────────────────────────────────────┐
 * │  CRM ADAPTER — Notion                                                        │
 * ├───────────────────────────────────────────────────────────────────────────┤
 * │  The seam between the agents/forms and your data.                           │
 * │                                                                             │
 * │  • No NOTION_TOKEN set  → safe STUB (logs + mock ids). App still runs.       │
 * │  • NOTION_TOKEN set     → writes real pages to your Notion databases.        │
 * │                                                                             │
 * │  SETUP: see NOTION_SETUP.md for the exact database property schema. In       │
 * │  short, create three Notion databases, share them with your integration,     │
 * │  and set NOTION_TOKEN + NOTION_LEADS_DB + NOTION_APPOINTMENTS_DB             │
 * │  (+ optional NOTION_TECHNICIANS_DB) in .env.local.                           │
 * └───────────────────────────────────────────────────────────────────────────┘
 */

import { Client } from "@notionhq/client";
import type { Lead, AvailabilitySlot, Appointment, Locality, AmcContract, AmcRenewalTarget, B2bLead } from "@/lib/agent/types";

export const CRM_CONNECTED = Boolean(process.env.NOTION_TOKEN);

/** The full argument object `pages.create` expects — lets us type property maps without `any`. */
type CreatePageArgs = Parameters<Client["pages"]["create"]>[0];

let _notion: Client | null = null;
function notion(): Client {
  if (!_notion) _notion = new Client({ auth: process.env.NOTION_TOKEN });
  return _notion;
}

/** Notion rich_text / title fields cap at 2000 chars per item. */
function text(value: string) {
  return [{ text: { content: value.slice(0, 2000) } }];
}

function requireDb(id: string | undefined, name: string): string {
  if (!id) throw new Error(`NOTION_TOKEN is set but ${name} is missing — see NOTION_SETUP.md`);
  return id;
}

/** Write a fully-captured lead into the CRM (Notion "Leads" DB). */
export async function createLead(lead: Lead): Promise<{ id: string; persisted: boolean }> {
  if (!CRM_CONNECTED) {
    console.info("[crm:stub] createLead", { ...lead, transcript: lead.transcript ? "<omitted>" : undefined });
    return { id: `stub_${Date.now()}`, persisted: false };
  }

  const db = requireDb(process.env.NOTION_LEADS_DB, "NOTION_LEADS_DB");
  const args = {
    parent: { database_id: db },
    properties: {
      Name: { title: text(lead.name || "Anonymous Customer") },
      Phone: { phone_number: lead.phone },
      Locality: { select: { name: lead.locality } },
      Issue: { rich_text: text(lead.issueType) },
      Urgency: { select: { name: lead.urgency } },
      Source: { select: { name: lead.source } },
      Status: { select: { name: lead.status } },
      Consent: { checkbox: lead.consentGiven },
      ...(lead.transcript ? { Transcript: { rich_text: text(lead.transcript) } } : {}),
    },
  } as CreatePageArgs;

  const page = await notion().pages.create(args);
  return { id: page.id, persisted: true };
}

/** Record an annual maintenance contract (Notion "AMC Contracts" DB). */
export async function createAmcContract(contract: AmcContract): Promise<{ id: string; persisted: boolean }> {
  if (!CRM_CONNECTED || !process.env.NOTION_AMC_DB) {
    console.info("[crm:stub] createAmcContract", contract);
    return { id: `stub_amc_${Date.now()}`, persisted: false };
  }

  const db = process.env.NOTION_AMC_DB;
  const args = {
    parent: { database_id: db },
    properties: {
      Name: { title: text(contract.name || "AMC Customer") },
      Phone: { phone_number: contract.phone },
      Plan: { select: { name: contract.plan } },
      Amount: { number: contract.amount },
      Locality: { select: { name: contract.locality } },
      "Start Date": { date: { start: contract.startDate } },
      "Renewal Date": { date: { start: contract.renewalDate } },
      Status: { select: { name: contract.status } },
      ...(contract.acCount ? { "AC Units": { number: contract.acCount } } : {}),
    },
  } as CreatePageArgs;

  const page = await notion().pages.create(args);
  return { id: page.id, persisted: true };
}

/** Shape of the Notion property values we read back for renewals (typed, no `any`). */
type ReadProps = Record<
  string,
  {
    title?: { plain_text: string }[];
    phone_number?: string | null;
    select?: { name: string } | null;
    date?: { start: string } | null;
    number?: number | null;
    checkbox?: boolean;
    rich_text?: { plain_text: string }[];
  }
>;
type PageLike = { id: string; properties?: ReadProps };

/**
 * Contracts whose renewal date falls within `withinDays` and are still Active.
 * Best-effort: if the Notion query API rejects (e.g. API-version differences) it
 * fails safe with an empty list so the Care batch never crashes.
 *
 * Notion API 2025-09-03 moved querying onto data sources, so we resolve the
 * database's (single) data source first, then query it.
 */
export async function findRenewalsDue(withinDays = 30): Promise<AmcRenewalTarget[]> {
  if (!CRM_CONNECTED || !process.env.NOTION_AMC_DB) return [];

  const today = new Date();
  const until = new Date(today.getTime() + withinDays * 86_400_000);
  const iso = (d: Date) => d.toISOString().split("T")[0];

  try {
    const db = await notion().databases.retrieve({ database_id: process.env.NOTION_AMC_DB });
    const dataSourceId = (db as { data_sources?: { id: string }[] }).data_sources?.[0]?.id;
    if (!dataSourceId) return [];

    const res = await notion().dataSources.query({
      data_source_id: dataSourceId,
      filter: {
        and: [
          { property: "Status", select: { equals: "Active" } },
          { property: "Renewal Date", date: { on_or_after: iso(today) } },
          { property: "Renewal Date", date: { on_or_before: iso(until) } },
        ],
      },
    });

    return (res.results as PageLike[])
      .map((page) => {
        const p = page.properties;
        const phone = p?.["Phone"]?.phone_number ?? "";
        if (!phone) return null;
        return {
          name: p?.["Name"]?.title?.map((t) => t.plain_text).join("") || "there",
          phone,
          plan: p?.["Plan"]?.select?.name ?? "your plan",
          renewalDate: p?.["Renewal Date"]?.date?.start ?? "",
        } satisfies AmcRenewalTarget;
      })
      .filter((t): t is AmcRenewalTarget => t !== null);
  } catch (err) {
    console.error("[crm] findRenewalsDue query failed (returning none):", err);
    return [];
  }
}

/** Look up open slots for a locality/date. Queries existing bookings to avoid double-booking. */
export async function checkAvailability(date: string, locality: Locality): Promise<AvailabilitySlot[]> {
  const allSlots: AvailabilitySlot[] = [
    { date, time: "morning", technician: "Asad Khan" },
    { date, time: "afternoon", technician: "Ravi S." },
    { date, time: "evening", technician: "Mohan K." },
  ];

  if (!CRM_CONNECTED || !process.env.NOTION_APPOINTMENTS_DB) {
    if (!CRM_CONNECTED) console.info("[crm:stub] checkAvailability", { date, locality });
    return allSlots;
  }

  // Query Notion for existing bookings on this date to show what's still available
  try {
    const db = await notion().databases.retrieve({ database_id: process.env.NOTION_APPOINTMENTS_DB });
    const dataSourceId = (db as { data_sources?: { id: string }[] }).data_sources?.[0]?.id;
    if (!dataSourceId) return allSlots;

    const res = await notion().dataSources.query({
      data_source_id: dataSourceId,
      filter: {
        and: [
          { property: "Slot", date: { equals: date } },
          { property: "Status", select: { does_not_equal: "No-show" } },
        ],
      },
    });

    const bookedWindows = new Set(
      (res.results as PageLike[]).map((page) => {
        const name = page.properties?.["Name"]?.title?.map((t) => t.plain_text).join("") || "";
        // Name format: "phone — timeWindow"
        const parts = name.split("—");
        return parts[1]?.trim()?.toLowerCase() || "";
      }).filter(Boolean)
    );

    // Remove slots that are already booked
    return allSlots.filter((s) => !bookedWindows.has(s.time));
  } catch (err) {
    console.error("[crm] checkAvailability query failed (returning all slots):", err);
    return allSlots;
  }
}

/** Reserve a slot (Notion "Appointments" DB), linked to the lead by phone. */
export async function bookSlot(appointment: Appointment): Promise<{ id: string; persisted: boolean }> {
  if (!CRM_CONNECTED) {
    console.info("[crm:stub] bookSlot", appointment);
    return { id: `stub_appt_${Date.now()}`, persisted: false };
  }

  const db = requireDb(process.env.NOTION_APPOINTMENTS_DB, "NOTION_APPOINTMENTS_DB");
  
  // slotDateTime is usually "YYYY-MM-DD timeWindow" (e.g. "2026-07-20 morning")
  const [datePart, timeWindow] = appointment.slotDateTime.split(" ");

  const args = {
    parent: { database_id: db },
    properties: {
      Name: { title: text(`${appointment.leadPhone} — ${timeWindow || "Any time"}`) },
      Phone: { phone_number: appointment.leadPhone },
      Slot: { date: { start: datePart } }, // Maps to Notion's Date property for Notion Calendar
      Locality: { select: { name: appointment.locality } },
      Status: { select: { name: appointment.status } },
      ...(appointment.technician ? { Technician: { rich_text: text(appointment.technician) } } : {}),
    },
  } as CreatePageArgs;

  const page = await notion().pages.create(args);
  return { id: page.id, persisted: true };
}

// ── CARE QUERIES ──────────────────────────────────────────────────────────

/** Leads whose status is "Serviced" and were updated yesterday → review request targets. */
export async function findRecentlyServiced(): Promise<{ name: string; phone: string }[]> {
  if (!CRM_CONNECTED) return [];

  const dbId = process.env.NOTION_LEADS_DB;
  if (!dbId) return [];

  try {
    const db = await notion().databases.retrieve({ database_id: dbId });
    const dataSourceId = (db as { data_sources?: { id: string }[] }).data_sources?.[0]?.id;
    if (!dataSourceId) return [];

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const iso = yesterday.toISOString().split("T")[0];

    const res = await notion().dataSources.query({
      data_source_id: dataSourceId,
      filter: {
        and: [
          { property: "Status", select: { equals: "Serviced" } },
        ],
      },
      page_size: 20,
    });

    return (res.results as PageLike[])
      .filter((page) => {
        // Filter for "recently" serviced (last-updated check via page last_edited_time)
        const edited = (page as { last_edited_time?: string }).last_edited_time;
        if (!edited) return false;
        const editedDate = edited.split("T")[0];
        return editedDate === iso;
      })
      .map((page) => {
        const p = page.properties;
        const phone = p?.["Phone"]?.phone_number ?? "";
        if (!phone) return null;
        return {
          name: p?.["Name"]?.title?.map((t) => t.plain_text).join("") || "there",
          phone,
        };
      })
      .filter((t): t is { name: string; phone: string } => t !== null);
  } catch (err) {
    console.error("[crm] findRecentlyServiced query failed:", err);
    return [];
  }
}

/** Leads stuck at "New" for 48+ hours → re-engagement targets. */
export async function findStaleLeads(): Promise<{ name: string; phone: string }[]> {
  if (!CRM_CONNECTED) return [];

  const dbId = process.env.NOTION_LEADS_DB;
  if (!dbId) return [];

  try {
    const db = await notion().databases.retrieve({ database_id: dbId });
    const dataSourceId = (db as { data_sources?: { id: string }[] }).data_sources?.[0]?.id;
    if (!dataSourceId) return [];

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 2);
    const isoCutoff = cutoff.toISOString().split("T")[0];

    const res = await notion().dataSources.query({
      data_source_id: dataSourceId,
      filter: {
        and: [
          { property: "Status", select: { equals: "New" } },
        ],
      },
      page_size: 20,
    });

    return (res.results as PageLike[])
      .filter((page) => {
        const edited = (page as { last_edited_time?: string }).last_edited_time;
        if (!edited) return false;
        const editedDate = edited.split("T")[0];
        return editedDate <= isoCutoff;
      })
      .map((page) => {
        const p = page.properties;
        const phone = p?.["Phone"]?.phone_number ?? "";
        if (!phone) return null;
        return {
          name: p?.["Name"]?.title?.map((t) => t.plain_text).join("") || "there",
          phone,
        };
      })
      .filter((t): t is { name: string; phone: string } => t !== null);
  } catch (err) {
    console.error("[crm] findStaleLeads query failed:", err);
    return [];
  }
}

/** Update a lead's status and append a note to its transcript. */
export async function updateLeadStatus(
  phone: string,
  newStatus: string,
  note?: string,
): Promise<{ updated: boolean }> {
  if (!CRM_CONNECTED) return { updated: false };

  const dbId = process.env.NOTION_LEADS_DB;
  if (!dbId) return { updated: false };

  try {
    const db = await notion().databases.retrieve({ database_id: dbId });
    const dataSourceId = (db as { data_sources?: { id: string }[] }).data_sources?.[0]?.id;
    if (!dataSourceId) return { updated: false };

    const res = await notion().dataSources.query({
      data_source_id: dataSourceId,
      filter: { property: "Phone", phone_number: { equals: phone } },
      page_size: 1,
    });

    if (res.results.length === 0) return { updated: false };
    const pageId = res.results[0].id;

    // Read existing transcript
    const existing = (res.results[0] as PageLike).properties?.["Transcript"]?.rich_text
      ?.map((t) => t.plain_text).join("") || "";

    const newTranscript = note
      ? `${existing}\n[${new Date().toISOString().split("T")[0]}] ${note}`.trim()
      : existing;

    await notion().pages.update({
      page_id: pageId,
      properties: {
        Status: { select: { name: newStatus } },
        ...(note ? { Transcript: { rich_text: text(newTranscript) } } : {}),
      },
    });

    return { updated: true };
  } catch (err) {
    console.error("[crm] updateLeadStatus failed:", err);
    return { updated: false };
  }
}

/** Save chat satisfaction feedback to the most recent lead for this phone. */
export async function saveChatFeedback(
  phone: string,
  rating: "yes" | "no",
): Promise<{ saved: boolean }> {
  if (!CRM_CONNECTED) {
    console.info("[crm:stub] saveChatFeedback", { phone, rating });
    return { saved: false };
  }

  const dbId = process.env.NOTION_LEADS_DB;
  if (!dbId) return { saved: false };

  try {
    const db = await notion().databases.retrieve({ database_id: dbId });
    const dataSourceId = (db as { data_sources?: { id: string }[] }).data_sources?.[0]?.id;
    if (!dataSourceId) return { saved: false };

    const res = await notion().dataSources.query({
      data_source_id: dataSourceId,
      filter: { property: "Phone", phone_number: { equals: phone } },
      page_size: 1,
      sorts: [{ timestamp: "last_edited_time", direction: "descending" }],
    });

    if (res.results.length === 0) return { saved: false };
    const pageId = res.results[0].id;

    const existing = (res.results[0] as PageLike).properties?.["Transcript"]?.rich_text
      ?.map((t) => t.plain_text).join("") || "";

    const feedbackNote = `[${new Date().toISOString().split("T")[0]}] Chat satisfaction: ${rating === "yes" ? "Satisfied" : "Not satisfied"}`;
    const newTranscript = `${existing}\n${feedbackNote}`.trim();

    await notion().pages.update({
      page_id: pageId,
      properties: {
        Transcript: { rich_text: text(newTranscript) },
      },
    });

    return { saved: true };
  } catch (err) {
    console.error("[crm] saveChatFeedback failed:", err);
    return { saved: false };
  }
}

// ── B2B LEADS ───────────────────────────────────────────────────────────

/** Write a commercial B2B enquiry into its own Notion "B2B Leads" database. */
export async function createB2bLead(lead: B2bLead): Promise<{ id: string; persisted: boolean }> {
  if (!CRM_CONNECTED || !process.env.NOTION_B2B_LEADS_DB) {
    console.info("[crm:stub] createB2bLead", { ...lead });
    return { id: `stub_b2b_${Date.now()}`, persisted: false };
  }

  const db = process.env.NOTION_B2B_LEADS_DB;
  const args = {
    parent: { database_id: db },
    properties: {
      "Company Name": { title: text(lead.companyName) },
      "Contact Person": { rich_text: text(lead.contactName) },
      "Phone": { phone_number: lead.phone },
      "Email": { email: lead.email },
      "Business Type": { select: { name: lead.businessType } },
      "AC Units": { number: lead.acUnits },
      "Source": { select: { name: lead.source } },
      "Status": { select: { name: lead.status } },
      ...(lead.message ? { "Message": { rich_text: text(lead.message) } } : {}),
    },
  } as CreatePageArgs;

  const page = await notion().pages.create(args);
  return { id: page.id, persisted: true };
}
