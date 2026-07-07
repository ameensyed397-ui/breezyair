/**
 * Scheduled entry point for Agent 2 (Breezy Care). Meant to be hit by a daily
 * cron (e.g. Vercel Cron). Protected by CRON_SECRET.
 *
 * Add to vercel.ts / vercel.json crons:
 *   { "path": "/api/agent/care/run", "schedule": "0 4 * * *" }   // 9:30am IST-ish
 */

import { runBreezyCareBatch } from "@/lib/agent/care/breezy-care";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const summary = await runBreezyCareBatch();
  return Response.json({ ok: true, summary });
}
