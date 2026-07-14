/**
 * The single source of pricing truth for the agents. Kept in sync with the
 * /pricing page. The agent MUST quote from here via the get_pricing tool — it is
 * instructed never to invent a number.
 */

export interface PriceItem {
  key: string;
  service: string;
  price: string;
  includes: string;
  extra: string[];
  keywords: string[];
}

export const PRICE_LIST: PriceItem[] = [
  { key: "basic-service", service: "AC Basic Service", price: "₹499", includes: "Filter clean, coil check, performance test", extra: ["Capacitor replacement — ₹749", "Fan motor — from ₹1,200"], keywords: ["service", "clean", "basic", "filter", "not cooling", "maintenance"] },
  { key: "full-service", service: "AC Full Service", price: "₹699", includes: "Indoor + outdoor unit, fin clean, capacitor check", extra: ["Gas top-up (if low) — from ₹800", "Capacitor replacement — ₹749", "Drain flush — ₹399"], keywords: ["full", "deep service", "outdoor", "thorough"] },
  { key: "wet-clean", service: "Wet Deep Clean", price: "₹899", includes: "High-pressure wash, anti-bacterial, drain flush", extra: ["Gas top-up (if low) — from ₹800", "Copper pipe (if damaged) — ₹899/m"], keywords: ["wet", "deep clean", "smell", "mould", "mold", "bacteria", "jet"] },
  { key: "installation", service: "AC Installation", price: "₹1,499", includes: "Mounting, piping (3m), wiring, gas charge, trial run", extra: ["Extra piping — ₹899/m", "Outdoor mount bracket — from ₹500"], keywords: ["install", "installation", "new ac", "fit", "mount"] },
  { key: "uninstallation", service: "AC Uninstallation", price: "₹699", includes: "Gas recovery, dismount, cap & seal", extra: [], keywords: ["uninstall", "remove", "removal", "dismount", "shifting", "relocate"] },
  { key: "inspection", service: "Inspection Visit", price: "₹350 (waived if work done)", includes: "Fault diagnosis + written quote", extra: [], keywords: ["inspection", "diagnose", "check", "not sure", "quote"] },
];

export const ADDONS = [
  { name: "Gas top-up — 1 ton", price: "₹800" },
  { name: "Gas top-up — 1.5 ton", price: "₹1,000" },
  { name: "Gas top-up — 2 ton", price: "₹1,200" },
  { name: "Gas refill — full tank (1–1.5T)", price: "₹1,800–₹2,200" },
  { name: "Gas refill — full tank (2T+)", price: "₹2,500–₹3,000" },
  { name: "Capacitor replacement", price: "₹749" },
  { name: "Copper pipe (per metre)", price: "₹899" },
  { name: "Drain pipe cleaning", price: "₹399" },
  { name: "Fan motor — indoor/outdoor", price: "₹1,200–₹2,500 + ₹300 fitting" },
  { name: "PCB / control board repair", price: "₹1,500–₹4,000" },
  { name: "Multi-AC bundle — 2 ACs (full service)", price: "₹1,299" },
  { name: "Multi-AC bundle — 3 ACs (full service)", price: "₹1,799" },
  { name: "Multi-AC bundle — 4+ ACs (basic service per AC)", price: "₹449/AC" },
  { name: "Emergency same-day surcharge", price: "+₹299" },
];

export const AMC_PLANS = [
  { name: "Chill Basic", price: "₹1,499/year", summary: "2 visits, 10% off repairs" },
  { name: "Bengaluru Cool", price: "₹2,999/year", summary: "3 visits, gas check, 20% off repairs" },
  { name: "Villa Plan", price: "₹1,999/AC/year", summary: "All ACs covered, 3 visits each" },
];

/**
 * Commercial / B2B contract tiers. Mirrors the /b2b page. Prices are "Custom"
 * because commercial contracts are always priced per site after a free survey —
 * the agent gives an INDICATIVE per-unit range, never a firm commercial quote.
 */
export const B2B_TIERS = [
  { name: "Care", fit: "Small offices & retail", response: "48-hr", servicing: "Quarterly", includes: "10% off repairs, digital service log, single point of contact" },
  { name: "Pro", fit: "Multi-unit & restaurants", response: "12-hr", servicing: "Monthly", includes: "20% off repairs, dedicated technician, GST invoicing, quarterly reports" },
  { name: "Critical", fit: "Clinics, labs & server rooms", response: "2-hr", servicing: "Fortnightly + on-call", includes: "25% off repairs, 24/7 escalation, compliance reporting, standby planning" },
];

/** Rough per-AC/year band for an AMC-style commercial contract, used only to set expectations. */
export const B2B_INDICATIVE_RANGE = "₹1,800–₹3,500 per AC per year";

export interface BusinessProposal {
  recommendedTier: string;
  tierFit: string;
  responseSLA: string;
  servicing: string;
  includes: string;
  indicativeRange: string;
  unitCount?: number;
  nextStep: string;
}

/**
 * Suggest a commercial contract tier from facility type + unit count. Returns an
 * indicative proposal (never a firm price) plus the next step (free on-site survey).
 */
export function getBusinessProposal(facilityType: string, unitCount?: number): BusinessProposal {
  const f = facilityType.toLowerCase();
  const critical = /(clinic|lab|hospital|server|data|it room|pharma)/.test(f);
  const pro = /(restaurant|cafe|kitchen|retail|showroom|multi|hotel)/.test(f) || (unitCount ?? 0) >= 10;

  const tier = critical ? B2B_TIERS[2] : pro ? B2B_TIERS[1] : B2B_TIERS[0];
  return {
    recommendedTier: tier.name,
    tierFit: tier.fit,
    responseSLA: tier.response,
    servicing: tier.servicing,
    includes: tier.includes,
    indicativeRange: B2B_INDICATIVE_RANGE,
    unitCount,
    nextStep: "Free on-site survey, then a tailored written quote within 48 hours.",
  };
}

/**
 * Best-effort match of a free-text problem/service description to a ballpark
 * price. Returns candidates rather than a single number so the agent can offer
 * a range honestly.
 */
export function findPricing(query: string): PriceItem[] {
  const q = query.toLowerCase();
  const hits = PRICE_LIST.filter((p) => p.keywords.some((k) => q.includes(k)) || q.includes(p.service.toLowerCase()));
  return hits.length > 0 ? hits : PRICE_LIST;
}
