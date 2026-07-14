import { NextRequest, NextResponse } from "next/server";
import { saveChatFeedback } from "@/lib/agent/adapters/crm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const phone = String(body.phone || "").trim();
    const rating = body.rating as "yes" | "no";

    if (!phone || !rating || !["yes", "no"].includes(rating)) {
      return NextResponse.json({ error: "phone and rating (yes|no) required" }, { status: 400 });
    }

    const { saved } = await saveChatFeedback(phone, rating);
    return NextResponse.json({ saved });
  } catch {
    return NextResponse.json({ error: "feedback save failed" }, { status: 500 });
  }
}
