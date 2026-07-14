/**
 * Scheduled entry point for Agent 2 (Breezy Care). Meant to be hit by a daily
 * cron (e.g. Vercel Cron). Protected by CRON_SECRET.
 *
 * Add to vercel.json crons:
 *   { "path": "/api/agent/care/run", "schedule": "0 4 * * *" }   // 9:30am IST-ish
 */

import { runBreezyCareBatch } from "@/lib/agent/care/breezy-care";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  
  // Enforce CRON_SECRET presence in production
  if (!secret) {
    console.error("[cron-error] CRON_SECRET is not configured in the environment variables.");
    return Response.json(
      { error: "Configuration Error: CRON_SECRET is not set." },
      { status: 500 }
    );
  }

  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${secret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const summary = await runBreezyCareBatch();
    return Response.json({ ok: true, summary });
  } catch (error) {
    console.error("Cron execution failed:", error);
    const message = error instanceof Error ? error.message : "Internal Cron Error";
    return Response.json({ error: message }, { status: 500 });
  }
}

// Fallback to support manual testing or webhook triggers via POST
export async function POST(req: Request) {
  return GET(req);
}
