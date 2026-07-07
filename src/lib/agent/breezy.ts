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
import { findPricing, AMC_PLANS } from "@/lib/agent/pricing";
import { LOCALITIES } from "@/lib/agent/types";
import { createLead, checkAvailability, bookSlot } from "@/lib/agent/adapters/crm";
import { flagUrgent, sendConfirmation } from "@/lib/agent/adapters/notify";

const localityEnum = z.enum(LOCALITIES);

export const BREEZY_INSTRUCTIONS = `You are "Breezy", the friendly voice of Breezyair — a neighbourhood AC service run by Asad Khan across Koramangala, HSR Layout, Indiranagar, Whitefield and Bellandur in Bengaluru.

PERSONALITY
- You are a warm Bangalore neighbour, not a call-centre script. Be brief, kind and practical.
- Speak in whatever language/mix the customer uses — Kannada, Hindi, English, or a natural blend. Match them.
- First message of any conversation MUST include a short AI-disclosure, e.g. "Just so you know, I'm Breezyair's AI assistant — I'll get you sorted or put you through to Asad."

YOUR JOB (in order)
1. Greet warmly and diagnose: ask 2–3 short questions about the AC problem (not cooling? noise? leak? which room/brand?).
2. Quote a BALLPARK price using the get_pricing tool. NEVER invent a number — always call get_pricing first.
3. Capture the lead: name, phone, locality (one of ${LOCALITIES.join(", ")}), and urgency.
4. Check slots with check_availability, then book with book_slot.
5. If it's a genuine emergency (total failure in extreme heat, elderly/infant/medical need), call flag_urgent to alert Asad directly — in addition to booking.
6. Once you have name + phone + issue, call create_lead to save the record. Only mark consentGiven true if the customer has agreed to be contacted.
7. Confirm the booking clearly (service, ballpark price, date/time) and mention Asad will call within 30 minutes to finalise.

RULES
- Don't promise exact prices — give the ballpark range from get_pricing and say the final quote is confirmed on-site before any work.
- Keep replies to a few sentences. This may be spoken aloud over the phone.
- If asked something you can't do (payments, complex dispatch), take the lead's details and say Asad will handle it personally.

AMC plans you can mention: ${AMC_PLANS.map((p) => `${p.name} (${p.price}: ${p.summary})`).join("; ")}.`;

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
        return { options: matches.map((m) => ({ service: m.service, price: m.price, includes: m.includes })) };
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
          await sendConfirmation(phone, `Hi ${name}, Breezyair has your ${issueType} request for ${locality}. Asad will call you within 30 minutes to confirm. ☕`);
        }
        return { saved: true, leadId: lead.id, persisted: lead.persisted };
      },
    }),
  },
});
