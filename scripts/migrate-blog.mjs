/**
 * Migration script: pushes the 3 hardcoded blog posts to Sanity CMS.
 *
 * Usage:  node scripts/migrate-blog.mjs
 *
 * Requires SANITY_WRITE_TOKEN and NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local
 */

import { readFileSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

// ── Load env vars from .env.local ──────────────────────────────────────
function loadEnv() {
  const raw = readFileSync(resolve(root, ".env.local"), "utf-8");
  const env = {};
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    // strip surrounding quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    env[key] = val;
  }
  return env;
}

const env = loadEnv();
const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = env.SANITY_WRITE_TOKEN || env.SANITY_API_READ_TOKEN;

if (!projectId || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_WRITE_TOKEN in .env.local");
  process.exit(1);
}

const API = `https://${projectId}.api.sanity.io/v${new Date().toISOString().slice(0, 10)}`;

// ── Sanity helpers ─────────────────────────────────────────────────────
async function sanityRequest(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Sanity API error ${res.status}: ${body}`);
  }
  return res.json();
}

async function uploadImage(filePath) {
  const blob = readFileSync(filePath);
  const ext = filePath.split(".").pop();
  const mime = ext === "png" ? "image/png" : ext === "jpg" || ext === "jpeg" ? "image/jpeg" : "image/webp";

  const res = await fetch(
    `https://${projectId}.api.sanity.io/v2021-06-07/assets/images/${dataset}`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": mime },
      body: blob,
    }
  );
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Image upload failed ${res.status}: ${body}`);
  }
  const data = await res.json();
  console.log(`  Uploaded: ${filePath.split("/").pop()} → ${data.document._id}`);
  return data.document._id;
}

// ── Blog post data (migrated from hardcoded posts.ts) ──────────────────
const posts = [
  {
    _type: "post",
    title: "AC not cooling? A 6-point checklist before you call anyone",
    slug: { _type: "slug", current: "ac-not-cooling-bengaluru-checklist" },
    excerpt: "Before you book a service, run through these six quick checks. Half the 'AC not cooling' calls we get in Bengaluru are fixed in five minutes — for free.",
    date: "2026-06-24",
    author: "Asad Khan",
    category: "AC Repair",
    readTime: "5 min read",
    coverImageFile: resolve(root, "public/blog/checklist.png"),
    body: [
      { _type: "blockP", text: "Bengaluru summers are getting longer, and the most common call we get at Breezyair is simple: 'My AC is running but not cooling.' Before you spend money on a technician, run through this quick checklist — you might save yourself a service charge." },
      { _type: "blockH2", text: "1. Check the mode and temperature" },
      { _type: "blockP", text: "It sounds obvious, but nine times out of ten a remote got bumped into 'Fan' or 'Dry' mode, or the setpoint is at 26°C. Set it to 'Cool' and drop it to 18–20°C to test." },
      { _type: "blockH2", text: "2. Clean the filters" },
      { _type: "blockImage", srcFile: resolve(root, "public/blog/cleaning.png"), alt: "Cleaning AC filters" },
      { _type: "blockP", text: "Clogged filters are the number-one cause of weak cooling. Pop open the indoor unit, slide out the mesh filters, and rinse them under a tap. Let them dry fully before refitting. Do this every 15 days during summer." },
      { _type: "blockH2", text: "3. Look at the outdoor unit" },
      { _type: "blockUl", items: [
        "Is the fan spinning? If not, that's an electrical fault — call us.",
        "Is it caked in dust or leaves? Airflow blockage kills efficiency.",
        "Is it in direct afternoon sun with no ventilation? That alone can cut cooling by 20%.",
      ] },
      { _type: "blockH2", text: "4. Feel the airflow" },
      { _type: "blockP", text: "Weak airflow points to a filter or fan problem. Strong airflow that just isn't cold usually means low refrigerant (gas) or a compressor issue — that needs a professional." },
      { _type: "blockH2", text: "5. Check for ice" },
      { _type: "blockP", text: "Ice on the copper pipes or indoor coil means restricted airflow or low gas. Switch the AC off, let it fully defrost, and if it ices up again after cleaning the filters, book a service." },
      { _type: "blockH2", text: "6. Listen and smell" },
      { _type: "blockP", text: "Rattling, buzzing, or a musty smell are all signs the unit needs attention. A musty smell in particular means mould — that's a wet deep clean, not a repair." },
      { _type: "blockQuote", text: "If you've done all six and it's still not cooling, it's almost always gas or the compressor. That's our job — and we'll quote you before we touch anything." },
      { _type: "blockP", text: "Still stuck? Book a Breezyair inspection and we'll diagnose it honestly. The ₹350 inspection fee is waived if you get the work done with us." },
    ],
  },
  {
    _type: "post",
    title: "How often should you service your AC in Bengaluru?",
    slug: { _type: "slug", current: "how-often-service-ac-bengaluru" },
    excerpt: "Bengaluru's dust and long summers mean the 'once a year' rule doesn't apply here. Here's a realistic servicing schedule that actually protects your unit.",
    date: "2026-06-10",
    author: "Asad Khan",
    category: "Maintenance",
    readTime: "4 min read",
    coverImageFile: resolve(root, "public/blog/calendar.png"),
    body: [
      { _type: "blockP", text: "Most manufacturers say 'service once a year.' That advice is written for temperate climates — not for a dusty, warm city where ACs run eight months of the year. Here's what we actually recommend for Bengaluru homes." },
      { _type: "blockH2", text: "The Breezyair schedule" },
      { _type: "blockUl", items: [
        "Filter clean: every 15 days in summer (you can do this yourself)",
        "Basic service: twice a year — once before summer (Feb–Mar), once after monsoon",
        "Deep wet clean: once a year, ideally in February before peak heat",
        "Gas check: annually, or whenever cooling drops",
      ] },
      { _type: "blockH2", text: "Why twice a year matters here" },
      { _type: "blockP", text: "Bengaluru's air carries a lot of fine construction dust. It settles on the evaporator coil and outdoor condenser, and within six months of heavy use, cooling efficiency drops noticeably — you feel it as higher electricity bills before you feel it as weak cooling." },
      { _type: "blockH2", text: "The AMC maths" },
      { _type: "blockImage", srcFile: resolve(root, "public/blog/savings.png"), alt: "Saving money on AC maintenance" },
      { _type: "blockP", text: "Two paid basic services cost around ₹1,000/year. Our Chill Basic AMC is ₹1,499/year and includes both visits, a health check, priority booking, and 10% off any repairs. For most single-AC homes, the AMC pays for itself the first time something needs fixing." },
      { _type: "blockQuote", text: "The cheapest AC repair is the one you never need. Regular servicing genuinely doubles the life of a unit — we see 12-year-old ACs running like new because the owner serviced them on schedule." },
      { _type: "blockP", text: "Want us to remember for you? Our AMC plans include reminder calls so you never miss a service window." },
    ],
  },
  {
    _type: "post",
    title: "Split vs window AC in 2026: which should a Bengaluru home buy?",
    slug: { _type: "slug", current: "split-vs-window-ac-2026" },
    excerpt: "Thinking of a new AC? Here's an honest, installer's-eye comparison of split and window units for Bengaluru flats and independent homes.",
    date: "2026-05-28",
    author: "Asad Khan",
    category: "Buying Guide",
    readTime: "6 min read",
    coverImageFile: resolve(root, "public/blog/split-vs-window.png"),
    body: [
      { _type: "blockP", text: "We install both, so we have no reason to push one over the other. Here's how we'd advise a friend choosing between a split and a window AC for a Bengaluru home in 2026." },
      { _type: "blockH2", text: "Go with a split AC if..." },
      { _type: "blockUl", items: [
        "You want quiet cooling (the compressor is outside)",
        "You care how the room looks — splits are sleeker",
        "You have a wall that faces outside for the outdoor unit",
        "You're cooling a bedroom or living room you use daily",
      ] },
      { _type: "blockH2", text: "Go with a window AC if..." },
      { _type: "blockUl", items: [
        "You're on a tight budget — window units cost less upfront and to install",
        "You have a window or slot that fits the standard size",
        "It's for a rental or a room you use occasionally",
        "You want the simplest possible servicing",
      ] },
      { _type: "blockH2", text: "The star rating matters more than the type" },
      { _type: "blockP", text: "In Bengaluru, where the AC runs for months, a 5-star inverter split will save more on electricity than the price difference over three summers. If you can stretch the budget, the star rating is where the money goes furthest — not fancy features." },
      { _type: "blockH2", text: "Sizing: don't guess" },
      { _type: "blockP", text: "A common mistake is buying too small a unit to save money, then running it at max all day. As a rough guide: up to 120 sq ft → 1 ton, 120–190 sq ft → 1.5 ton, above that → 2 ton. Top floors and west-facing rooms should size up." },
      { _type: "blockQuote", text: "Buy the right size and the right star rating, and installation done properly — that combination matters more than the brand on the box." },
      { _type: "blockP", text: "Breezyair does brand-agnostic installations with proper copper piping and a trial run. Book an installation and we'll help you size it right before you buy." },
    ],
  },
];

// ── Migrate ────────────────────────────────────────────────────────────
async function migrate() {
  console.log(`\nMigrating ${posts.length} blog posts to Sanity (${projectId}/${dataset})...\n`);

  // 1. Upload all images first, build a ref map
  const imageRefs = {};
  const imageFiles = new Set();
  for (const post of posts) {
    imageFiles.add(post.coverImageFile);
    for (const block of post.body) {
      if (block._type === "blockImage" && block.srcFile) {
        imageRefs[block.srcFile] = null; // placeholder
        imageFiles.add(block.srcFile);
      }
    }
  }

  console.log("Uploading images...");
  for (const filePath of imageFiles) {
    const assetId = await uploadImage(filePath);
    imageRefs[filePath] = { _type: "reference", _ref: assetId };
  }

  // 2. Create documents
  console.log("\nCreating blog post documents...");
  for (const post of posts) {
    const doc = {
      _type: post._type,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      date: post.date,
      author: post.author,
      category: post.category,
      readTime: post.readTime,
      coverImage: imageRefs[post.coverImageFile],
      body: post.body.map((block) => {
        if (block._type === "blockImage") {
          return { _type: "blockImage", src: imageRefs[block.srcFile], alt: block.alt };
        }
        const { srcFile, ...rest } = block;
        return rest;
      }),
    };

    const result = await sanityRequest(`/data/mutate/${dataset}`, {
      method: "POST",
      body: JSON.stringify({
        mutations: [{ createOrReplace: { _id: `post.${doc.slug.current}`, ...doc } }],
      }),
    });
    console.log(`  Created: ${doc.title} (${result.results.length} mutation)`);
  }

  console.log("\nDone! All 3 posts migrated to Sanity.\n");
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
