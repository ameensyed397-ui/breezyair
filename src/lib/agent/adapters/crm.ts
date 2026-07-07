/**
 * ┌───────────────────────────────────────────────────────────────────────────┐
 * │  CRM ADAPTER — OPEN INTEGRATION NODE (Notion CRM)                          │
 * ├───────────────────────────────────────────────────────────────────────────┤
 * │  This is the seam between the agent and your data. Right now it is a STUB   │
 * │  that logs and returns mock data so the agent works end-to-end locally.     │
 * │                                                                             │
 * │  TO CONNECT NOTION:                                                          │
 * │   1. npm i @notionhq/client                                                 │
 * │   2. set NOTION_TOKEN, NOTION_LEADS_DB, NOTION_APPOINTMENTS_DB,             │
 * │      NOTION_TECHNICIANS_DB in .env.local                                     │
 * │   3. implement the three functions below against the Notion API — the       │
 * │      Lead / Appointment / AvailabilitySlot shapes already match the schema. │
 * │  Nothing else in the agent needs to change.                                 │
 * └───────────────────────────────────────────────────────────────────────────┘
 */

import type { Lead, AvailabilitySlot, Appointment, Locality } from "@/lib/agent/types";

export const CRM_CONNECTED = Boolean(process.env.NOTION_TOKEN);

/** Write a fully-captured lead into the CRM (Notion "Leads" DB). */
export async function createLead(lead: Lead): Promise<{ id: string; persisted: boolean }> {
  if (!CRM_CONNECTED) {
    console.info("[crm:stub] createLead", { ...lead, transcript: lead.transcript ? "<omitted>" : undefined });
    return { id: `stub_${Date.now()}`, persisted: false };
  }
  // TODO(connect-notion): notion.pages.create({ parent: { database_id: NOTION_LEADS_DB }, properties: mapLead(lead) })
  throw new Error("Notion CRM configured but createLead not yet implemented — see adapters/crm.ts");
}

/** Look up open slots for a locality/date (Notion "Technicians"/"Appointments"). */
export async function checkAvailability(date: string, locality: Locality): Promise<AvailabilitySlot[]> {
  if (!CRM_CONNECTED) {
    console.info("[crm:stub] checkAvailability", { date, locality });
    return [
      { date, time: "morning", technician: "Asad Khan" },
      { date, time: "afternoon", technician: "Ravi S." },
      { date, time: "evening", technician: "Mohan K." },
    ];
  }
  // TODO(connect-notion): query Technicians where Currently Available = true, cross-check Appointments
  throw new Error("Notion CRM configured but checkAvailability not yet implemented — see adapters/crm.ts");
}

/** Reserve a slot (Notion "Appointments" DB), linked to the lead. */
export async function bookSlot(appointment: Appointment): Promise<{ id: string; persisted: boolean }> {
  if (!CRM_CONNECTED) {
    console.info("[crm:stub] bookSlot", appointment);
    return { id: `stub_appt_${Date.now()}`, persisted: false };
  }
  // TODO(connect-notion): notion.pages.create({ parent: { database_id: NOTION_APPOINTMENTS_DB }, properties: mapAppointment(appointment) })
  throw new Error("Notion CRM configured but bookSlot not yet implemented — see adapters/crm.ts");
}
