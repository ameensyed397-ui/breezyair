"use client";

import { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";

interface PaymentButtonProps {
  amount: number;
  description: string;
  onSuccess: (paymentId: string, orderId: string) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: { contact?: string; email?: string };
  theme?: { color?: string };
  modal?: { ondismiss?: () => void };
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, handler: (response: { error: { description: string } }) => void) => void;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function PaymentButton({ amount, description, onSuccess, onError, disabled }: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Failed to load payment gateway. Please check your internet connection.");
      }

      // Create order on server
      const orderRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, description }),
      });

      if (!orderRes.ok) {
        const err = await orderRes.json();
        throw new Error(err.error || "Failed to create payment order");
      }

      const { orderId, amount: orderAmount, currency, keyId } = await orderRes.json();

      // Open Razorpay checkout
      const options: RazorpayOptions = {
        key: keyId,
        amount: orderAmount,
        currency,
        name: "Breezyair",
        description,
        order_id: orderId,
        handler: async (response: RazorpayResponse) => {
          try {
            // Verify payment on server
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });

            if (!verifyRes.ok) {
              throw new Error("Payment verification failed");
            }

            const { verified } = await verifyRes.json();
            if (verified) {
              onSuccess(response.razorpay_payment_id, response.razorpay_order_id);
            } else {
              throw new Error("Payment could not be verified");
            }
          } catch {
            throw new Error("Payment was made but verification failed. Contact us with your payment ID: " + response.razorpay_payment_id);
          }
        },
        theme: { color: "#4fc3f7" },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        setLoading(false);
        onError?.(response.error.description || "Payment failed");
      });
      rzp.open();
    } catch (err) {
      setLoading(false);
      onError?.(err instanceof Error ? err.message : "Payment failed");
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={disabled || loading}
      className="btn-lift w-full flex items-center justify-center gap-2 bg-[#4fc3f7] text-black font-bold text-sm uppercase tracking-wider py-4 border-2 border-black disabled:opacity-50 disabled:pointer-events-none"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Processing…
        </>
      ) : (
        <>
          <CreditCard className="w-4 h-4" />
          Pay ₹{amount.toLocaleString("en-IN")}
        </>
      )}
    </button>
  );
}
