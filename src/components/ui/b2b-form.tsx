"use client";

import { useState } from "react";
import { Input } from "./input";

export function B2bForm() {
  const [company, setCompany] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [businessType, setBusinessType] = useState("Corporate Office");
  const [units, setUnits] = useState("");
  const [requirements, setRequirements] = useState("");
  const [honeyPot, setHoneyPot] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    const phoneClean = phone.replace(/[\s\-()]/g, "");
    if (!/^(\+?91)?[6-9]\d{9}$/.test(phoneClean)) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "b2b",
          company,
          name: contactName,
          phone,
          email,
          locality: "Other",
          businessType,
          issueType: requirements,
          units: units || "1",
          honeyPot,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to submit B2B enquiry.");
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
      <div className="border-2 border-black bg-[#a7ffeb] brutal-shadow p-8 text-center w-full max-w-xl mx-auto my-6">
        <h3 className="font-display text-3xl font-bold text-[#111111] mb-2">Survey Request Received!</h3>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          Thank you for reaching out, <strong>{company}</strong>. Asad Khan will call you back at <strong>{phone}</strong> (or email <strong>{email}</strong>) within 2 hours to arrange a free on-site survey.
        </p>
      </div>
    );
  }

  return (
    <div className="border-2 border-black bg-white brutal-shadow p-6 md:p-8 w-full max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" aria-label="Commercial inquiry form">
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
        <div className="flex flex-col gap-1.5">
          <label htmlFor="company-name" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Business / Company Name *</label>
          <Input
            id="company-name"
            required
            disabled={loading}
            placeholder="e.g. Acme Corp India"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="contact-name" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Contact Person *</label>
            <Input
              id="contact-name"
              required
              disabled={loading}
              placeholder="e.g. Rahul Sharma"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="contact-phone" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Phone Number *</label>
            <Input
              id="contact-phone"
              type="tel"
              required
              disabled={loading}
              placeholder="e.g. +91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="contact-email" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Business Email *</label>
            <Input
              id="contact-email"
              type="email"
              required
              disabled={loading}
              placeholder="e.g. facilities@acme.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="business-type" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Facility Type</label>
            <select
              id="business-type"
              disabled={loading}
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              className="h-11 w-full border-2 border-black bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4fc3f7] disabled:opacity-60"
            >
              <option>Corporate Office</option>
              <option>Retail Store / Showroom</option>
              <option>Restaurant / Cafe</option>
              <option>Clinic / Lab</option>
              <option>Gym / Studio</option>
              <option>Server Room / Data Center</option>
              <option>Apartment Association</option>
              <option>Other Facility</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="ac-count" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Estimated number of AC units *</label>
          <Input
            id="ac-count"
            type="number"
            min="1"
            required
            disabled={loading}
            placeholder="e.g. 15"
            value={units}
            onChange={(e) => setUnits(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="requirements" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Requirements / Details</label>
          <textarea
            id="requirements"
            disabled={loading}
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            className="w-full border-2 border-black bg-white px-3 py-2.5 text-sm min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-[#4fc3f7] disabled:opacity-60"
            placeholder="E.g. Annual maintenance quote, bulk deep cleaning request, or emergency server room cooling repair..."
          />
        </div>

        {error && <p className="text-xs text-red-600 font-semibold">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="btn-lift w-full py-4 bg-[#4fc3f7] text-black font-bold text-sm uppercase tracking-wider border-2 border-black mt-1 disabled:opacity-50"
        >
          {loading ? "SENDING..." : "REQUEST FREE SURVEY"}
        </button>
        <p className="text-[10px] text-gray-400 font-medium text-center mt-1">We&apos;ll call you back within 2 hours &middot; Mon\u2013Sat 9am\u20137pm</p>
      </form>
    </div>
  );
}
