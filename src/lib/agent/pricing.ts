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
  keywords: string[];
}

export const PRICE_LIST: PriceItem[] = [
  { key: "basic-service", service: "AC Basic Service", price: "₹499", includes: "Filter clean, coil check, performance test", keywords: ["service", "clean", "basic", "filter", "not cooling", "maintenance"] },
  { key: "full-service", service: "AC Full Service", price: "₹699", includes: "Indoor + outdoor unit, fin clean, capacitor check", keywords: ["full", "deep service", "outdoor", "thorough"] },
  { key: "wet-clean", service: "Wet Deep Clean", price: "₹899", includes: "High-pressure wash, anti-bacterial, drain flush", keywords: ["wet", "deep clean", "smell", "mould", "mold", "bacteria", "jet"] },
  { key: "installation", service: "AC Installation", price: "₹1,499", includes: "Mounting, piping (3m), wiring, gas charge, trial run", keywords: ["install", "installation", "new ac", "fit", "mount"] },
  { key: "uninstallation", service: "AC Uninstallation", price: "₹699", includes: "Gas recovery, dismount, cap & seal", keywords: ["uninstall", "remove", "removal", "dismount", "shifting", "relocate"] },
  { key: "inspection", service: "Inspection Visit", price: "₹350 (waived if work done)", includes: "Fault diagnosis + written quote", keywords: ["inspection", "diagnose", "check", "not sure", "quote"] },
];

export const ADDONS = [
  { name: "Gas top-up (1–2 ton)", price: "₹1,200–₹1,800" },
  { name: "Capacitor replacement", price: "₹749" },
  { name: "Copper pipe (per metre)", price: "₹899" },
  { name: "Drain pipe cleaning", price: "₹399" },
  { name: "Emergency same-day surcharge", price: "+₹299" },
];

export const AMC_PLANS = [
  { name: "Chill Basic", price: "₹1,499/year", summary: "2 visits, 10% off repairs" },
  { name: "Bengaluru Cool", price: "₹2,999/year", summary: "3 visits, gas check, 20% off repairs" },
  { name: "Villa Plan", price: "₹1,999/AC/year", summary: "All ACs covered, 3 visits each" },
];

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
