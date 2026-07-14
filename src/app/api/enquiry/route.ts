import { createLead, bookSlot, createAmcContract, createB2bLead } from "@/lib/agent/adapters/crm";
import { flagUrgent } from "@/lib/agent/adapters/notify";
import type { Lead, Locality } from "@/lib/agent/types";
import { z } from "zod";

export const runtime = "nodejs";

// Simple in-memory tracker for rate limiting.
// Note: In serverless/Vercel functions, this map will be reset when the function instances recycle,
// which is a standard graceful-degradation pattern. It protects against automated rapid-fire bots.
const trackers = new Map<string, number[]>();

const enquirySchema = z.object({
  type: z.enum(["footer", "callback", "contact", "b2b", "booking"]),
  name: z.string().optional(),
  phone: z.string().min(8, "Phone number is too short").max(20, "Phone number is too long"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  locality: z.string().optional(),
  issueType: z.string().optional(),
  urgency: z.union([z.enum(["Urgent", "Normal"]), z.boolean()]).optional(),
  address: z.string().optional(),
  slotDate: z.string().optional(),
  slotTime: z.string().optional(),
  company: z.string().optional(),
  businessType: z.string().optional(),
  units: z.union([z.string(), z.number()]).optional(),
  service: z.string().optional(),
  amount: z.union([z.string(), z.number()]).optional(),
  acCount: z.union([z.string(), z.number()]).optional(),
  honeyPot: z.string().optional(),
});

/** "amc-bengaluru-cool" → "Bengaluru Cool" */
function amcPlanLabel(service: string): string {
  return service
    .replace(/^amc-/, "")
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** yyyy-mm-dd one year after the given (or today's) date. */
function oneYearLater(start: string): string {
  const d = start ? new Date(start) : new Date();
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().split("T")[0];
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";

  // ── RATE LIMITING ──────────────────────────────────────────
  const now = Date.now();
  const limit = 5; // max 5 submissions per minute per IP
  const windowMs = 60000;
  
  const timestamps = trackers.get(ip) || [];
  const activeTimestamps = timestamps.filter((time) => now - time < windowMs);
  
  if (activeTimestamps.length >= limit) {
    console.warn(`[rate-limit] IP ${ip} exceeded limit of ${limit} requests per minute.`);
    return Response.json(
      { error: "Too many requests. Please wait a minute and try again." },
      { status: 429 }
    );
  }
  
  activeTimestamps.push(now);
  trackers.set(ip, activeTimestamps);

  try {
    const body = await req.json();
    const parseResult = enquirySchema.safeParse(body);
    
    if (!parseResult.success) {
      const errorMessage = parseResult.error.issues[0]?.message || "Invalid input data.";
      return Response.json({ error: errorMessage }, { status: 400 });
    }

    const {
      type,
      name,
      phone,
      email,
      locality,
      issueType,
      urgency,
      address,
      slotDate,
      slotTime,
      company,
      businessType,
      units,
      service,
      amount,
      acCount,
      honeyPot,
    } = parseResult.data;

    // ── HONEYPOT BOT DETECTION ───────────────────────────────
    if (honeyPot && honeyPot.trim().length > 0) {
      console.warn(`[spam] Honeypot triggered from IP: ${ip}. Field value: ${honeyPot}`);
      // Return a simulated successful response so spam bots believe they succeeded and stop retrying.
      return Response.json({
        success: true,
        leadId: `stub_spam_${Date.now()}`,
        leadPersisted: false,
        bookingId: undefined,
        bookingPersisted: false,
      });
    }

    // Normalize locality to match the Locality type or default to "Other"
    const allowedLocalities = ["Koramangala", "HSR Layout", "Indiranagar", "Whitefield", "Bellandur", "Marathahalli", "Other"];
    let normalizedLocality: Locality = "Other";
    if (locality) {
      const match = allowedLocalities.find(
        (l) => l.toLowerCase() === locality.toLowerCase() || l.replace(" ", "-").toLowerCase() === locality.toLowerCase()
      );
      if (match) normalizedLocality = match as Locality;
    }

    // Create the CRM Lead object
    const leadData: Lead = {
      name: name || "Anonymous Customer",
      phone,
      locality: normalizedLocality,
      issueType: issueType || (type === "b2b" ? `B2B Enquiry: ${company} — ${businessType} (${units} units)` : "General Enquiry"),
      urgency: (urgency === "Urgent" || urgency === true) ? "Urgent" : "Normal",
      source: "Website",
      status: "New",
      consentGiven: true,
      transcript: type === "b2b" 
        ? `B2B Contract Request: Company: ${company}, Contact: ${name}, Email: ${email}, Type: ${businessType}, Units: ${units}, Msg: ${issueType}`
        : type === "footer"
        ? `Footer Callback requested for phone: ${phone}`
        : address 
        ? `Address: ${address}. Notes: ${issueType}` 
        : undefined,
    };

    // Save lead to CRM (Notion database or stub)
    const leadResult = await createLead(leadData);

    // B2B leads get written to their own dedicated database for sales pipeline tracking
    let b2bResult = null;
    if (type === "b2b") {
      const unitsNum = typeof units === "string" ? parseInt(units, 10) || 1 : units ?? 1;
      b2bResult = await createB2bLead({
        companyName: company || "Unknown",
        contactName: name || "Unknown",
        phone,
        email: email || "",
        businessType: businessType || "Other",
        acUnits: unitsNum,
        message: issueType,
        source: "Website",
        status: "New",
      });
    }

    // If it's a booking with slot details, book the slot in CRM
    let bookingResult = null;
    if (slotDate && slotTime) {
      const slotDateTime = `${slotDate} ${slotTime}`;
      bookingResult = await bookSlot({
        leadPhone: phone,
        slotDateTime,
        locality: normalizedLocality,
        status: "Scheduled",
      });
    }

    // If an Annual Maintenance Contract was selected, record it in the AMC Contracts DB
    // so it can be tracked and renewed (drives Breezy Care renewal reminders).
    let contractResult = null;
    if (service && service.startsWith("amc-")) {
      const amountNum = typeof amount === "string" ? parseInt(amount.replace(/[^0-9]/g, ""), 10) || 0 : amount ?? 0;
      const unitsNum = typeof acCount === "string" ? parseInt(acCount, 10) || 1 : acCount ?? 1;
      const startDate = slotDate || new Date().toISOString().split("T")[0];
      contractResult = await createAmcContract({
        name: leadData.name,
        phone,
        plan: amcPlanLabel(service),
        amount: amountNum,
        locality: normalizedLocality,
        startDate,
        renewalDate: oneYearLater(startDate),
        acCount: unitsNum,
        status: "Active",
      });
    }

    // If marked urgent, trigger notification/escalation to Asad
    if (leadData.urgency === "Urgent") {
      const urgentSummary = `${leadData.name} (${phone}) in ${leadData.locality} marked AC issue as URGENT!`;
      await flagUrgent(urgentSummary);
    }

    return Response.json({
      success: true,
      leadId: leadResult.id,
      leadPersisted: leadResult.persisted,
      b2bLeadId: b2bResult?.id,
      b2bLeadPersisted: b2bResult?.persisted,
      bookingId: bookingResult?.id,
      bookingPersisted: bookingResult?.persisted,
      contractId: contractResult?.id,
      contractPersisted: contractResult?.persisted,
    });
  } catch (error) {
    console.error("Enquiry API error:", error);
    const message = error instanceof Error ? error.message : "Something went wrong.";
    return Response.json({ error: message }, { status: 500 });
  }
}
