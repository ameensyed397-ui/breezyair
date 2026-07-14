import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

export async function POST(req: NextRequest) {
  if (!RAZORPAY_KEY_SECRET) {
    return NextResponse.json({ error: "Payment gateway not configured." }, { status: 503 });
  }

  // Rate limit: cap signature-verification attempts to slow brute-force probing.
  const rl = rateLimit(`payment:verify:${clientIp(req)}`, 12, 60_000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait a moment." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    );
  }

  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing payment verification fields." }, { status: 400 });
    }

    // Verify HMAC-SHA256 signature
    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const verified = expectedSignature === razorpay_signature;

    if (!verified) {
      console.error("[payment] Signature mismatch for order:", razorpay_order_id);
      return NextResponse.json({ verified: false, error: "Payment signature verification failed." }, { status: 400 });
    }

    return NextResponse.json({ verified: true, paymentId: razorpay_payment_id, orderId: razorpay_order_id });
  } catch (err) {
    console.error("[payment] verify error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
