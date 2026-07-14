"use client";

import { useState } from "react";
import { Input } from "./input";

export function HomeCallbackForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [issue, setIssue] = useState("");
  const [honeyPot, setHoneyPot] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      setError("Please enter your phone number.");
      setLoading(false);
      return;
    }
    const phoneClean = phone.replace(/[\s\-()]/g, "");
    if (!/^(\+?91)?[6-9]\d{9}$/.test(phoneClean)) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "callback",
          name,
          phone,
          issueType: issue || "General AC Callback",
          honeyPot,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to submit request.");
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="border-2 border-black bg-[#a7ffeb] brutal-shadow p-6 md:p-8 text-center w-full max-w-2xl">
        <h3 className="font-display text-2xl font-bold text-[#111111] mb-2">🎉 Request Received!</h3>
        <p className="text-sm text-gray-700">
          Asad will call you back at <strong>{phone}</strong> within 30 minutes.
        </p>
      </div>
    );
  }

  return (
    <div className="border-2 border-black bg-white brutal-shadow text-left w-full max-w-2xl p-6 md:p-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" aria-label="AC service request form">
        <div style={{ display: "none" }} aria-hidden="true">
          <input
            type="text"
            name="honeyPot"
            value={honeyPot}
            onChange={(e) => setHoneyPot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="cta-name" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Your Name</label>
            <Input
              id="cta-name"
              placeholder="e.g. Suresh Kumar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              maxLength={100}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="cta-phone" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Phone Number</label>
            <Input
              id="cta-phone"
              type="tel"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={loading}
              maxLength={15}
              required
            />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cta-issue" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">What&apos;s wrong?</label>
          <textarea
            id="cta-issue"
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            disabled={loading}
            maxLength={500}
            className="w-full border-2 border-black bg-white px-3 py-2.5 text-sm min-h-[90px] resize-none focus:outline-none focus:ring-2 focus:ring-[#4fc3f7] disabled:opacity-60"
            placeholder="AC not cooling, making noise, leaking water..."
          />
        </div>
        {error && <p className="text-xs text-red-600 font-semibold">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="btn-lift w-full py-4 bg-[#4fc3f7] text-black font-bold text-sm uppercase tracking-wider border-2 border-black disabled:opacity-50"
        >
          {loading ? "SENDING..." : "GET CALLBACK NOW"}
        </button>
        <p className="text-center font-display italic text-xs text-gray-400">Asad usually replies within 30 minutes</p>
      </form>
    </div>
  );
}
