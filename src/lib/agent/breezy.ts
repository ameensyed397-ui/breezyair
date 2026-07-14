/**
 * AGENT 1 — "Breezy": Lead Capture & Booking.
 *
 * One brain, two doors: the website chat widget (/api/agent/breezy) and the
 * voice channel (/api/agent/voice) both run THIS agent. Keep it that way — the
 * ceiling is two agents (Breezy + Breezy Care), not more.
 */

import { ToolLoopAgent, tool } from "ai";
import { z } from "zod";
import { BREEZY_MODEL } from "@/lib/agent/model";
import { findPricing, AMC_PLANS, B2B_TIERS, getBusinessProposal } from "@/lib/agent/pricing";
import { LOCALITIES } from "@/lib/agent/types";
import { createLead, checkAvailability, bookSlot } from "@/lib/agent/adapters/crm";
import { flagUrgent, sendConfirmation } from "@/lib/agent/adapters/notify";

const localityEnum = z.enum(LOCALITIES);

/** Asad's direct line — the single human hand-off point for the whole business. */
const ASAD_PHONE = process.env.ASAD_ESCALATION_PHONE ?? "+918660174569";
const ASAD_WHATSAPP = `https://wa.me/${ASAD_PHONE.replace(/[^0-9]/g, "")}`;

export const BREEZY_INSTRUCTIONS = `You are "Breezy", the friendly voice of Breezyair — a neighbourhood AC service run by Asad Khan across Koramangala, HSR Layout, Indiranagar, Whitefield, Bellandur and Marathahalli in Bengaluru.

PERSONALITY
- You are a warm Bangalore neighbour, not a call-centre script. Be brief, kind and practical.
- Speak in whatever language/mix the customer uses — Kannada, Hindi, English, or a natural blend. Match them.
- First message of any conversation MUST include a short AI-disclosure, e.g. "Just so you know, I'm Breezyair's AI assistant — I'll get you sorted or put you through to Asad."

STEP 1 — READ THE SITUATION
Work out quickly whether this is a HOME customer or a BUSINESS (office, shop, restaurant, clinic, lab, server room, apartment association, or anyone mentioning multiple/bulk AC units, GST invoicing, a contract, or an AMC for a premises). Then follow the matching track.

HOME TRACK (in order)
1. Diagnose: ask 2–3 short questions about the AC problem (not cooling? noise? leak? which room/brand?).
2. Quote a BALLPARK price using get_pricing. NEVER invent a number — always call get_pricing first.
3. Capture the lead: name, phone, locality (one of ${LOCALITIES.join(", ")}), and urgency.
4. Check slots with check_availability, then book with book_slot.
5. Genuine emergency (total failure in extreme heat, elderly/infant/medical need)? Call flag_urgent in addition to booking.
6. Once you have name + phone + issue, call create_lead. Only set consentGiven true if the customer agreed to be contacted.
7. Confirm clearly (service, ballpark price, date/time) and say Asad will call within 30 minutes to finalise.

BUSINESS TRACK (in order)
1. Ask 2–3 quick scoping questions: facility type, roughly how many AC units, and what they need (repair, bulk servicing, or an annual maintenance contract).
2. Call get_business_proposal with the facility type and unit count. Present the recommended tier, what it includes, the INDICATIVE per-AC range, and the next step. Make clear commercial pricing is confirmed only after a free on-site survey — never quote a firm contract price.
3. Capture the lead with create_lead (put the company name + unit count + needs in issueType/transcript, locality "Other" if outside the core areas).
4. Then offer the human hand-off: use connect_to_human so they can reach Asad/sales directly, and tell them Asad will follow up within 2 business hours with a tailored written quote.

WHEN TO HAND OFF TO A HUMAN (either track)
- The customer explicitly asks for a person, a firm/commercial quote, payments, disputes, or anything you can't resolve.
- In those cases call connect_to_human, share Asad's number/WhatsApp, and still save the lead first so nothing is lost.

RULES
- **FORMATTING**: Use **bold** for ALL prices, key terms, and important information. Use short bullet points to make options or steps easy to read.
- **PRICING PRESENTATION**: When quoting a service, always present the base price first, then list what's included, then mention any common add-ons that may apply (from the 'extra' field). Say "If your AC needs X, that's an additional Y — I'll confirm on-site before doing anything."
- Don't promise exact prices — give the ballpark/indicative range and say the final quote is confirmed on-site before any work.
- Keep replies to a few sentences. This may be spoken aloud over the phone.
- Always capture the lead before ending, so Asad can follow up even if the chat drops.

AMC plans you can mention: ${AMC_PLANS.map((p) => `${p.name} (${p.price}: ${p.summary})`).join("; ")}.
Business contract tiers: ${B2B_TIERS.map((t) => `${t.name} (${t.fit})`).join("; ")}.`;

export const breezyAgent = new ToolLoopAgent({
  model: BREEZY_MODEL,
  instructions: BREEZY_INSTRUCTIONS,
  tools: {
    get_pricing: tool({
      description: "Get the ballpark Breezyair price(s) for a described AC problem or service. Always use this before quoting any price.",
      inputSchema: z.object({
        query: z.string().describe("The customer's described problem or the service they want, in their own words."),
      }),
      execute: async ({ query }) => {
        const matches = findPricing(query);
        return { options: matches.map((m) => ({ service: m.service, price: m.price, includes: m.includes, extra: m.extra })) };
      },
    }),

    check_availability: tool({
      description: "Check available technician slots for a date and locality before booking.",
      inputSchema: z.object({
        date: z.string().describe("Preferred date, ideally ISO like 2026-07-10, or 'today'/'tomorrow'."),
        locality: localityEnum,
      }),
      execute: async ({ date, locality }) => {
        const slots = await checkAvailability(date, locality);
        return { slots };
      },
    }),

    book_slot: tool({
      description: "Reserve a service slot for the customer once they've confirmed a time.",
      inputSchema: z.object({
        phone: z.string(),
        slotDateTime: z.string().describe("The agreed slot, e.g. '2026-07-10 morning'."),
        locality: localityEnum,
        technician: z.string().optional(),
      }),
      execute: async ({ phone, slotDateTime, locality, technician }) => {
        const result = await bookSlot({ leadPhone: phone, slotDateTime, locality, technician, status: "Scheduled" });
        return { booked: true, appointmentId: result.id, persisted: result.persisted };
      },
    }),

    flag_urgent: tool({
      description: "Escalate a genuine emergency to Asad directly (in addition to booking). Use sparingly.",
      inputSchema: z.object({
        summary: z.string().describe("One line: who, where, and why it's urgent."),
      }),
      execute: async ({ summary }) => {
        const result = await flagUrgent(summary);
        return { escalated: result.escalated };
      },
    }),

    get_business_proposal: tool({
      description: "For BUSINESS/commercial enquiries (offices, shops, restaurants, clinics, server rooms, bulk units or AMC contracts). Returns a recommended contract tier and an INDICATIVE range — never a firm commercial quote. Use before discussing commercial pricing.",
      inputSchema: z.object({
        facilityType: z.string().describe("The kind of premises, e.g. 'corporate office', 'restaurant', 'server room'."),
        unitCount: z.number().int().positive().optional().describe("Rough number of AC units, if known."),
      }),
      execute: async ({ facilityType, unitCount }) => {
        return getBusinessProposal(facilityType, unitCount);
      },
    }),

    connect_to_human: tool({
      description: "Hand the customer off to a real person (Asad / sales). Use when they ask for a human, want a firm/commercial quote, or need something you can't do. Save the lead first, then call this to share Asad's contact.",
      inputSchema: z.object({
        reason: z.string().describe("Short reason for the hand-off, e.g. 'wants a firm commercial quote'."),
        notifyNow: z.boolean().optional().describe("True if it's time-sensitive and Asad should be pinged immediately."),
      }),
      execute: async ({ reason, notifyNow }) => {
        if (notifyNow) await flagUrgent(`Hand-off requested: ${reason}`);
        return {
          handoff: true,
          phone: ASAD_PHONE,
          whatsapp: ASAD_WHATSAPP,
          message: `Asad will personally follow up. You can also reach him directly on ${ASAD_PHONE} or WhatsApp.`,
        };
      },
    }),

    create_lead: tool({
      description: "Save the captured lead to the CRM. Call once you have at least name, phone and the issue.",
      inputSchema: z.object({
        name: z.string(),
        phone: z.string(),
        locality: localityEnum,
        issueType: z.string(),
        urgency: z.enum(["Normal", "Urgent"]),
        consentGiven: z.boolean().describe("True only if the customer agreed to be contacted."),
        transcript: z.string().optional().describe("Short summary of the conversation."),
      }),
      execute: async ({ name, phone, locality, issueType, urgency, consentGiven, transcript }) => {
        const lead = await createLead({
          name, phone, locality, issueType, urgency, consentGiven, transcript,
          source: "Website", status: "New",
        });
        if (consentGiven) {
          await sendConfirmation(phone, `Hi ${name}, Breezyair has your ${issueType} request for ${locality}. Asad will call you within 30 minutes to confirm.`);
        }
        return { saved: true, leadId: lead.id, persisted: lead.persisted };
      },
    }),
  },
});
