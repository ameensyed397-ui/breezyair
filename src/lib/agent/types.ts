/**
 * Shared types for the Breezyair agents. These mirror the Notion CRM schema so
 * the CRM adapter can map straight onto Notion databases (or any future DB).
 */

export const LOCALITIES = ["Koramangala", "HSR Layout", "Indiranagar", "Whitefield", "Bellandur", "Marathahalli", "Other"] as const;

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

export type AmcStatus = "Active" | "Expiring" | "Expired" | "Cancelled";

/** Mirrors the Notion "AMC Contracts" database — one row per annual plan sold. */
export interface AmcContract {
  name: string;
  phone: string;
  plan: string;          // human label, e.g. "Bengaluru Cool"
  amount: number;        // total annual amount in INR
  locality: Locality;
  startDate: string;     // ISO yyyy-mm-dd
  renewalDate: string;   // ISO yyyy-mm-dd (startDate + 1 year)
  acCount?: number;      // for per-AC plans (Villa)
  status: AmcStatus;
}

/** A contract due for renewal, returned to Breezy Care. */
export interface AmcRenewalTarget {
  name: string;
  phone: string;
  plan: string;
  renewalDate: string;
}

/** Mirrors the Notion "B2B Leads" database — dedicated capture for commercial enquiries. */
export interface B2bLead {
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  businessType: string;
  acUnits: number;
  message?: string;
  source: "Website" | "Call-In" | "Referral";
  status: "New" | "Survey Scheduled" | "Quoted" | "Contracted" | "Closed";
  createdAt?: string;
}
