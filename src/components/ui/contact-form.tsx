"use client";

import { useState } from "react";
import Image from "next/image";
import { Input } from "./input";

export function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("AC Basic Service");
  const [locality, setLocality] = useState("");
  const [message, setMessage] = useState("");
  const [urgent, setUrgent] = useState(false);
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
          type: "contact",
          name,
          phone,
          locality: locality || "Other",
          issueType: `${service}: ${message || "No description"}`,
          urgency: urgent ? "Urgent" : "Normal",
          honeyPot,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to send message.");
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
      <div className="border-2 border-black bg-white brutal-shadow p-8 text-center max-w-md mx-auto my-6">
        <h3 className="font-display text-3xl font-bold text-[#111111] mb-2">Message sent! 🎉</h3>
        <p className="text-sm text-gray-500 mb-4">
          Asad has received your request and will call you back at <strong>{phone}</strong> within 30 minutes.
        </p>
        <div className="border-2 border-black bg-[#f5f7fa] p-4 text-left">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Summary</p>
          <p className="text-sm">Service: <strong>{service}</strong></p>
          {urgent && <p className="text-sm text-[#ef4444] font-bold mt-1">⚡ Urgent priority escalation active</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="border-2 border-black bg-white brutal-shadow">
      {/* Form header with indoor doodle mascot */}
      <div className="border-b-2 border-black p-5 bg-[#e8f4fd] flex flex-col items-center gap-3 text-center">
        <div className="w-20 h-20">
          <Image
            src="/mascot-indoor.png"
            alt="Breezyair spinning-eyes AC mascot looking stressed"
            width={80}
            height={80}
            className="w-full h-full object-contain"
          />
        </div>
        <div>
          <h2 className="font-display text-2xl italic text-[#4fc3f7] font-bold leading-tight">
            Is your AC in this state?
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">We understand the frustration — we got you!</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-5 md:p-7 flex flex-col gap-4" aria-label="AC service booking form">
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
            <label htmlFor="contact-name" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Your Name</label>
            <Input
              id="contact-name"
              placeholder="e.g. Suresh Kumar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              maxLength={100}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="contact-phone" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Phone Number</label>
            <Input
              id="contact-phone"
              type="tel"
              placeholder="+91 00000 00000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={loading}
              maxLength={15}
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-service" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Service Needed</label>
          <select
            id="contact-service"
            value={service}
            onChange={(e) => setService(e.target.value)}
            disabled={loading}
            className="h-11 w-full border-2 border-black bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4fc3f7] disabled:opacity-60"
          >
            <option>AC Basic Service</option>
            <option>AC Full Service</option>
            <option>Wet Deep Clean</option>
            <option>AC Installation</option>
            <option>AC Repair</option>
            <option>Annual Maintenance Plan</option>
            <option>Emergency Repair</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-locality" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Your Area</label>
          <select
            id="contact-locality"
            value={locality}
            onChange={(e) => setLocality(e.target.value)}
            disabled={loading}
            className="h-11 w-full border-2 border-black bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4fc3f7] disabled:opacity-60"
          >
            <option value="">Select your area</option>
            <option>Koramangala</option>
            <option>HSR Layout</option>
            <option>Indiranagar</option>
            <option>Whitefield</option>
            <option>Bellandur</option>
            <option>Marathahalli</option>
            <option>Other</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-message" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Describe the Problem</label>
          <textarea
            id="contact-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={loading}
            maxLength={500}
            className="w-full border-2 border-black bg-white px-3 py-2.5 text-sm min-h-[110px] resize-none focus:outline-none focus:ring-2 focus:ring-[#4fc3f7] disabled:opacity-60"
            placeholder="AC not cooling, making noise, leaking water..."
          />
        </div>

        <div className="flex items-center gap-2.5">
          <input
            type="checkbox"
            id="urgent-contact"
            checked={urgent}
            onChange={(e) => setUrgent(e.target.checked)}
            disabled={loading}
            className="w-4 h-4 cursor-pointer accent-[#4fc3f7]"
          />
          <label htmlFor="urgent-contact" className="text-sm font-semibold text-[#4fc3f7] cursor-pointer">
            This is an urgent repair!
          </label>
        </div>

        {error && <p className="text-xs text-red-600 font-semibold">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="btn-lift w-full bg-[#4fc3f7] text-black font-bold text-sm uppercase tracking-wider py-4 border-2 border-black mt-1 disabled:opacity-50"
        >
          {loading ? "SENDING..." : "SEND MESSAGE"}
        </button>

        <p className="text-center font-display italic text-xs text-gray-400 mt-1">
          Asad usually replies within 30 Mins
        </p>
      </form>
    </div>
  );
}
