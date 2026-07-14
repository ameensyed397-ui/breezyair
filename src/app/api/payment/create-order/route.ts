import { NextRequest, NextResponse } from "next/server";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

export async function POST(req: NextRequest) {
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    return NextResponse.json(
      { error: "Payment gateway not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET." },
      { status: 503 },
    );
  }

  // Rate limit: max 8 order-creation attempts per minute per IP.
  const rl = rateLimit(`payment:create:${clientIp(req)}`, 8, 60_000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many payment attempts. Please wait a moment." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    );
  }

  try {
    const body = await req.json();
    const { amount, currency = "INR", receipt, description } = body;

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json({ error: "Valid amount required (in INR)" }, { status: 400 });
    }

    // Razorpay expects amount in paise
    const amountPaise = Math.round(amount * 100);

    const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64");

    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: amountPaise,
        currency,
        receipt: receipt || `breezy_${Date.now()}`,
        notes: { description: description || "Breezyair AC Service" },
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error("[payment] Razorpay order creation failed:", err);
      return NextResponse.json({ error: err.error?.description || "Failed to create order" }, { status: 500 });
    }

    const order = await res.json();

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("[payment] create-order error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
