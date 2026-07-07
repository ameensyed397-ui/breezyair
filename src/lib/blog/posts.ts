/**
 * Blog content source.
 *
 * Posts are data-driven (no CMS yet). Each post's `body` is an ordered list of
 * simple blocks the article template knows how to render. To add a post, append
 * an entry here — it will appear on /blog and get its own static /blog/[slug] page.
 */

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "quote"; text: string };

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  /** ISO date, e.g. "2026-06-18" */
  date: string;
  author: string;
  category: string;
  /** Rough read time label, e.g. "5 min read" */
  readTime: string;
  /** Emoji used as the cover motif in the mascot design */
  emoji: string;
  body: Block[];
}

export const POSTS: Post[] = [
  {
    slug: "ac-not-cooling-bengaluru-checklist",
    title: "AC not cooling? A 6-point checklist before you call anyone",
    excerpt:
      "Before you book a service, run through these six quick checks. Half the 'AC not cooling' calls we get in Bengaluru are fixed in five minutes — for free.",
    date: "2026-06-24",
    author: "Asad Khan",
    category: "AC Repair",
    readTime: "5 min read",
    emoji: "❄️",
    body: [
      { type: "p", text: "Bengaluru summers are getting longer, and the most common call we get at Breezyair is simple: 'My AC is running but not cooling.' Before you spend money on a technician, run through this quick checklist — you might save yourself a service charge." },
      { type: "h2", text: "1. Check the mode and temperature" },
      { type: "p", text: "It sounds obvious, but nine times out of ten a remote got bumped into 'Fan' or 'Dry' mode, or the setpoint is at 26°C. Set it to 'Cool' and drop it to 18–20°C to test." },
      { type: "h2", text: "2. Clean the filters" },
      { type: "p", text: "Clogged filters are the number-one cause of weak cooling. Pop open the indoor unit, slide out the mesh filters, and rinse them under a tap. Let them dry fully before refitting. Do this every 15 days during summer." },
      { type: "h2", text: "3. Look at the outdoor unit" },
      { type: "ul", items: [
        "Is the fan spinning? If not, that's an electrical fault — call us.",
        "Is it caked in dust or leaves? Airflow blockage kills efficiency.",
        "Is it in direct afternoon sun with no ventilation? That alone can cut cooling by 20%.",
      ] },
      { type: "h2", text: "4. Feel the airflow" },
      { type: "p", text: "Weak airflow points to a filter or fan problem. Strong airflow that just isn't cold usually means low refrigerant (gas) or a compressor issue — that needs a professional." },
      { type: "h2", text: "5. Check for ice" },
      { type: "p", text: "Ice on the copper pipes or indoor coil means restricted airflow or low gas. Switch the AC off, let it fully defrost, and if it ices up again after cleaning the filters, book a service." },
      { type: "h2", text: "6. Listen and smell" },
      { type: "p", text: "Rattling, buzzing, or a musty smell are all signs the unit needs attention. A musty smell in particular means mould — that's a wet deep clean, not a repair." },
      { type: "quote", text: "If you've done all six and it's still not cooling, it's almost always gas or the compressor. That's our job — and we'll quote you before we touch anything." },
      { type: "p", text: "Still stuck? Book a Breezyair inspection and we'll diagnose it honestly. The ₹350 inspection fee is waived if you get the work done with us." },
    ],
  },
  {
    slug: "how-often-service-ac-bengaluru",
    title: "How often should you service your AC in Bengaluru?",
    excerpt:
      "Bengaluru's dust and long summers mean the 'once a year' rule doesn't apply here. Here's a realistic servicing schedule that actually protects your unit.",
    date: "2026-06-10",
    author: "Asad Khan",
    category: "Maintenance",
    readTime: "4 min read",
    emoji: "🗓️",
    body: [
      { type: "p", text: "Most manufacturers say 'service once a year.' That advice is written for temperate climates — not for a dusty, warm city where ACs run eight months of the year. Here's what we actually recommend for Bengaluru homes." },
      { type: "h2", text: "The Breezyair schedule" },
      { type: "ul", items: [
        "Filter clean: every 15 days in summer (you can do this yourself)",
        "Basic service: twice a year — once before summer (Feb–Mar), once after monsoon",
        "Deep wet clean: once a year, ideally in February before peak heat",
        "Gas check: annually, or whenever cooling drops",
      ] },
      { type: "h2", text: "Why twice a year matters here" },
      { type: "p", text: "Bengaluru's air carries a lot of fine construction dust. It settles on the evaporator coil and outdoor condenser, and within six months of heavy use, cooling efficiency drops noticeably — you feel it as higher electricity bills before you feel it as weak cooling." },
      { type: "h2", text: "The AMC maths" },
      { type: "p", text: "Two paid basic services cost around ₹1,000/year. Our Chill Basic AMC is ₹1,499/year and includes both visits, a health check, priority booking, and 10% off any repairs. For most single-AC homes, the AMC pays for itself the first time something needs fixing." },
      { type: "quote", text: "The cheapest AC repair is the one you never need. Regular servicing genuinely doubles the life of a unit — we see 12-year-old ACs running like new because the owner serviced them on schedule." },
      { type: "p", text: "Want us to remember for you? Our AMC plans include reminder calls so you never miss a service window." },
    ],
  },
  {
    slug: "split-vs-window-ac-2026",
    title: "Split vs window AC in 2026: which should a Bengaluru home buy?",
    excerpt:
      "Thinking of a new AC? Here's an honest, installer's-eye comparison of split and window units for Bengaluru flats and independent homes.",
    date: "2026-05-28",
    author: "Asad Khan",
    category: "Buying Guide",
    readTime: "6 min read",
    emoji: "🌬️",
    body: [
      { type: "p", text: "We install both, so we have no reason to push one over the other. Here's how we'd advise a friend choosing between a split and a window AC for a Bengaluru home in 2026." },
      { type: "h2", text: "Go with a split AC if..." },
      { type: "ul", items: [
        "You want quiet cooling (the compressor is outside)",
        "You care how the room looks — splits are sleeker",
        "You have a wall that faces outside for the outdoor unit",
        "You're cooling a bedroom or living room you use daily",
      ] },
      { type: "h2", text: "Go with a window AC if..." },
      { type: "ul", items: [
        "You're on a tight budget — window units cost less upfront and to install",
        "You have a window or slot that fits the standard size",
        "It's for a rental or a room you use occasionally",
        "You want the simplest possible servicing",
      ] },
      { type: "h2", text: "The star rating matters more than the type" },
      { type: "p", text: "In Bengaluru, where the AC runs for months, a 5-star inverter split will save more on electricity than the price difference over three summers. If you can stretch the budget, the star rating is where the money goes furthest — not fancy features." },
      { type: "h2", text: "Sizing: don't guess" },
      { type: "p", text: "A common mistake is buying too small a unit to save money, then running it at max all day. As a rough guide: up to 120 sq ft → 1 ton, 120–190 sq ft → 1.5 ton, above that → 2 ton. Top floors and west-facing rooms should size up." },
      { type: "quote", text: "Buy the right size and the right star rating, and installation done properly — that combination matters more than the brand on the box." },
      { type: "p", text: "Breezyair does brand-agnostic installations with proper copper piping and a trial run. Book an installation and we'll help you size it right before you buy." },
    ],
  },
];

export function getAllPosts(): Post[] {
  return [...POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}
