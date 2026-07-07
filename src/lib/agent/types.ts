/**
 * Shared types for the Breezyair agents. These mirror the Notion CRM schema so
 * the CRM adapter can map straight onto Notion databases (or any future DB).
 */

export const LOCALITIES = ["Koramangala", "HSR Layout", "Indiranagar", "Whitefield", "Bellandur", "Other"] as const;

export type Locality = (typeof LOCALITIES)[number];

export type Urgency = "Normal" | "Urgent";

/** How the lead reached us — same brain, different doors. */
export type LeadSource = "Website" | "Call-In" | "Missed-Call" | "WhatsApp";

export type LeadStatus = "New" | "Contacted" | "Booked" | "Serviced" | "Closed";

/** Mirrors the Notion "Leads" database. */
export interface Lead {
  name: string;
  phone: string;
  locality: Locality;
  issueType: string;
  urgency: Urgency;
  source: LeadSource;
  status: LeadStatus;
  transcript?: string;
  consentGiven: boolean;
  createdAt?: string;
}

/** Mirrors the Notion "Appointments" database. */
export interface Appointment {
  leadPhone: string;
  slotDateTime: string;
  technician?: string;
  locality: Locality;
  status: "Scheduled" | "En Route" | "Done" | "No-show";
}

export interface AvailabilitySlot {
  date: string;
  time: string;
  technician: string;
}
