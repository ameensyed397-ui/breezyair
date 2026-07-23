import { NextRequest, NextResponse } from "next/server";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import Razorpay from "razorpay";

export const runtime = "nodejs";

const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

export async function POST(req: NextRequest) {
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    return NextResponse.json(
      { error: "Payment gateway is not configured yet. Please contact Breezyair support." },
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

    // Razorpay expects amount in paise
    const amountPaise = Math.round(amount * 100);

    if (!amount || typeof amount !== "number" || amountPaise < 100) {
      return NextResponse.json({ error: "Valid amount required (minimum 100 paise)" }, { status: 400 });
    }

    const razorpay = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amountPaise,
      currency,
      receipt: receipt || `breezy_${Date.now()}`,
      notes: { description: description || "Breezyair AC Service" },
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: RAZORPAY_KEY_ID,
    });
  } catch (err: any) {
    console.error("[payment] create-order error:", err);
    if (err.statusCode === 401) {
      return NextResponse.json({ error: "Unauthorized payment gateway access" }, { status: 401 });
    }
    return NextResponse.json({ error: err.error?.description || "Failed to create order" }, { status: 500 });
  }
}
