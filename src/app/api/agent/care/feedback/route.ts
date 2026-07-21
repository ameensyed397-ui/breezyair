import { NextRequest, NextResponse } from "next/server";
import { saveChatFeedback } from "@/lib/agent/adapters/crm";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const phone = String(body.phone || "").trim();
  const rating = body.rating as string;

  if (!phone || !rating || !["yes", "no"].includes(rating)) {
    return NextResponse.json({ error: "phone and rating (yes|no) required" }, { status: 400 });
  }

  try {
    const { saved } = await saveChatFeedback(phone, rating as "yes" | "no");
    return NextResponse.json({ saved });
  } catch (err) {
    console.error("[feedback] save failed:", err);
    return NextResponse.json({ error: "feedback save failed" }, { status: 500 });
  }
}
