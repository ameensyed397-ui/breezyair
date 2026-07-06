"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ChevronRight, ArrowLeft } from "lucide-react";

const SERVICES = [
  { value: "basic-service", label: "AC Basic Service", price: "₹499", icon: "🌬️" },
  { value: "full-service", label: "AC Full Service", price: "₹699", icon: "🔧" },
  { value: "wet-clean", label: "Wet Deep Clean", price: "₹899", icon: "🫧" },
  { value: "installation", label: "AC Installation", price: "₹1,499", icon: "⚡" },
  { value: "uninstallation", label: "AC Uninstallation", price: "₹699", icon: "🔩" },
  { value: "inspection", label: "Inspection Visit", price: "₹350*", icon: "🔍" },
];

const LOCALITIES = [
  { value: "koramangala", label: "Koramangala" },
  { value: "hsr-layout", label: "HSR Layout" },
  { value: "indiranagar", label: "Indiranagar" },
  { value: "whitefield", label: "Whitefield" },
  { value: "bellandur", label: "Bellandur" },
];

const STEPS = ["Service", "Locality", "Date & Time", "Your Details"];

function BookingForm() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [service, setService] = useState("");
  const [locality, setLocality] = useState("");
  const [slot, setSlot] = useState({ date: "", time: "" });
  const [form, setForm] = useState({ name: "", phone: "", address: "", problem: "", urgent: false });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const s = searchParams.get("service");
    const l = searchParams.get("locality");
    if (s) { setService(s); setStep(l ? 3 : 2); }
    if (l) setLocality(l);
  }, [searchParams]);

  const selectedService = SERVICES.find((s) => s.value === service);
  const selectedLocality = LOCALITIES.find((l) => l.value === locality);

  const waLink = () => {
    const svc = selectedService?.label ?? service;
    const loc = selectedLocality?.label ?? locality;
    const dateStr = slot.date ? `+on+${slot.date}` : "";
    const timeStr = slot.time ? `+(${slot.time})` : "";
    return `https://wa.me/918660174569?text=Hi+Asad,+I+booked+${encodeURIComponent(svc)}+in+${encodeURIComponent(loc)}${dateStr}${timeStr}`;
  };

  if (submitted) {
    return (
      <div className="border-2 border-black bg-white brutal-shadow p-8 md:p-10 text-center max-w-lg mx-auto">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 border-2 border-black bg-[#a7ffeb] flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-[#111111]" aria-hidden="true" />
          </div>
        </div>
        <h2 className="font-display text-3xl font-bold text-[#111111] mb-2">Booking received! 🎉</h2>
        <p className="text-sm text-gray-500 mb-6">
          Asad will call you at <strong className="text-[#111111]">{form.phone}</strong> within 30 minutes to confirm.
        </p>
        <div className="border-2 border-black bg-[#f5f7fa] p-4 text-left mb-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Your booking summary</p>
          <p className="text-sm text-gray-500">Service: <span className="text-[#111111] font-bold">{selectedService?.label}</span></p>
          <p className="text-sm text-gray-500">Area: <span className="text-[#111111] font-bold">{selectedLocality?.label}</span></p>
          {slot.date && <p className="text-sm text-gray-500">Date: <span className="text-[#111111] font-bold">{slot.date} ({slot.time})</span></p>}
          <p className="text-sm text-gray-500">Name: <span className="text-[#111111] font-bold">{form.name}</span></p>
          {form.urgent && <p className="text-sm font-bold mt-2 text-[#ef4444]">⚡ Marked urgent — Asad will prioritise your slot.</p>}
        </div>
        <a
          href={waLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-lift block w-full bg-[#4fc3f7] text-black font-bold text-sm uppercase tracking-wider py-4 border-2 border-black mb-3"
          aria-label="Confirm on WhatsApp"
        >
          💬 Confirm on WhatsApp
        </a>
        <Link
          href="/"
          className="btn-lift block w-full bg-white text-black font-bold text-sm uppercase tracking-wider py-3 border-2 border-black"
          aria-label="Back to home"
        >
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Step indicator */}
      <div className="flex items-center mb-10 overflow-x-auto pb-2">
        {STEPS.map((label, i) => {
          const num = i + 1;
          const active = step === num;
          const done = step > num;
          return (
            <div key={label} className="flex items-center flex-shrink-0">
              <div className="flex flex-col items-center">
                <div
                  className="w-10 h-10 flex items-center justify-center font-bold text-sm border-2 border-black"
                  style={{
                    background: done ? "#a7ffeb" : active ? "#4fc3f7" : "#f5f7fa",
                    color: "#111111",
                    boxShadow: active ? "3px 3px 0 #000000" : undefined,
                  }}
                >
                  {done ? <CheckCircle2 className="w-4 h-4" /> : num}
                </div>
                <span className="text-[10px] mt-1 font-bold uppercase tracking-wide whitespace-nowrap" style={{ color: active ? "#111111" : "#9ca3af" }}>{label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <ChevronRight className="w-5 h-5 mx-2 flex-shrink-0 text-gray-300" style={{ marginBottom: "18px" }} aria-hidden="true" />
              )}
            </div>
          );
        })}
      </div>

      {/* Step 1 — Service picker */}
      {step === 1 && (
        <div>
          <h2 className="font-display text-3xl font-bold text-[#111111] mb-6">What do you need?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SERVICES.map((s) => (
              <button
                key={s.value}
                onClick={() => { setService(s.value); setStep(2); }}
                className="card-lift bg-white p-5 text-left"
                style={service === s.value ? { boxShadow: "4px 4px 0 #4fc3f7" } : {}}
                aria-label={`Select ${s.label}`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-2xl">{s.icon}</span>
                  <span className="bg-[#ffb74d] text-black text-xs font-bold border-2 border-black px-2 py-0.5">{s.price}</span>
                </div>
                <h3 className="font-bold text-base mt-3 text-[#111111]">{s.label}</h3>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2 — Locality */}
      {step === 2 && (
        <div>
          <h2 className="font-display text-3xl font-bold text-[#111111] mb-6">Which area are you in?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {LOCALITIES.map((l) => (
              <button
                key={l.value}
                onClick={() => { setLocality(l.value); setStep(3); }}
                className="card-lift bg-white p-5 text-left font-bold text-lg text-[#111111]"
                style={locality === l.value ? { boxShadow: "4px 4px 0 #4fc3f7" } : {}}
                aria-label={`Select ${l.label}`}
              >
                📍 {l.label}
              </button>
            ))}
          </div>
          <button onClick={() => setStep(1)} className="mt-6 text-sm font-bold text-gray-500 inline-flex items-center gap-1 hover:text-[#4fc3f7]">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>
      )}

      {/* Step 3 — Date & time */}
      {step === 3 && (
        <div>
          <h2 className="font-display text-3xl font-bold text-[#111111] mb-2">Pick a date &amp; time</h2>
          <p className="text-sm text-gray-500 mb-6">
            Booking: <strong className="text-[#111111]">{selectedService?.label}</strong> in <strong className="text-[#111111]">{selectedLocality?.label}</strong>
          </p>
          <div className="border-2 border-black bg-white brutal-shadow p-6 flex flex-col gap-6">
            <div>
              <label htmlFor="preferred-date" className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Preferred date</label>
              <input
                id="preferred-date"
                type="date"
                value={slot.date}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setSlot({ ...slot, date: e.target.value })}
                className="h-11 w-full border-2 border-black bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4fc3f7]"
                aria-label="Preferred service date"
              />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Preferred time slot</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { value: "morning", label: "Morning", sub: "8 AM – 12 PM" },
                  { value: "afternoon", label: "Afternoon", sub: "12 PM – 4 PM" },
                  { value: "evening", label: "Evening", sub: "4 PM – 8 PM" },
                ].map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setSlot({ ...slot, time: t.value })}
                    className="card-lift bg-white p-4 text-left"
                    style={slot.time === t.value ? { background: "#e8f4fd", boxShadow: "4px 4px 0 #4fc3f7" } : {}}
                    aria-pressed={slot.time === t.value}
                    aria-label={`Select ${t.label} slot`}
                  >
                    <p className="font-bold text-base" style={{ color: slot.time === t.value ? "#0d47a1" : "#111111" }}>{t.label}</p>
                    <p className="text-xs text-gray-400 mt-1">{t.sub}</p>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 border-2 border-black bg-[#ffb74d]">
              <span className="text-lg">⚡</span>
              <p className="text-sm font-semibold text-[#111111]">
                Asad will confirm your exact time within 30 minutes of booking. Same-day slots available on most days.
              </p>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-4">
            <button onClick={() => setStep(2)} className="text-sm font-bold text-gray-500 inline-flex items-center gap-1 hover:text-[#4fc3f7]">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={() => setStep(4)}
              disabled={!slot.date || !slot.time}
              className="btn-lift bg-[#4fc3f7] text-black font-bold text-sm uppercase tracking-wider px-8 py-3 border-2 border-black ml-auto disabled:opacity-50 disabled:pointer-events-none"
              aria-label="Continue to your details"
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* Step 4 — Contact details */}
      {step === 4 && (
        <div>
          <h2 className="font-display text-3xl font-bold text-[#111111] mb-6">Your details</h2>
          <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="border-2 border-black bg-white brutal-shadow p-6 flex flex-col gap-5">
            <div>
              <label htmlFor="name" className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Full name *</label>
              <input id="name" type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="h-11 w-full border-2 border-black bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4fc3f7]" placeholder="Your name" />
            </div>
            <div>
              <label htmlFor="phone" className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Phone number *</label>
              <input id="phone" type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="h-11 w-full border-2 border-black bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4fc3f7]" placeholder="+91 00000 00000" />
            </div>
            <div>
              <label htmlFor="address" className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Full address *</label>
              <input id="address" type="text" required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="h-11 w-full border-2 border-black bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4fc3f7]" placeholder="Flat, building, street, area" />
            </div>
            <div>
              <label htmlFor="problem" className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Describe the problem (optional)</label>
              <textarea id="problem" value={form.problem} onChange={(e) => setForm({ ...form, problem: e.target.value })}
                className="w-full border-2 border-black bg-white px-3 py-2.5 text-sm min-h-[90px] resize-none focus:outline-none focus:ring-2 focus:ring-[#4fc3f7]"
                placeholder="E.g. not cooling, making noise, leaking water..." rows={3} />
            </div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={form.urgent} onChange={(e) => setForm({ ...form, urgent: e.target.checked })}
                className="mt-1 w-4 h-4 cursor-pointer accent-[#4fc3f7]" />
              <div>
                <span className="font-bold text-sm text-[#111111]">⚡ This is urgent</span>
                <p className="text-xs text-gray-400">Asad will prioritise your slot and call within 15 minutes.</p>
              </div>
            </label>
            <div className="flex items-center gap-4 mt-1">
              <button type="button" onClick={() => setStep(3)} className="text-sm font-bold text-gray-500 inline-flex items-center gap-1 hover:text-[#4fc3f7]">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button type="submit" className="btn-lift bg-[#4fc3f7] text-black font-bold text-sm uppercase tracking-wider px-10 py-3 border-2 border-black ml-auto">
                Confirm booking →
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default function BookPage() {
  return (
    <section className="py-12 md:py-16 min-h-screen bg-[#f5f7fa]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 border-2 border-black bg-[#4fc3f7] text-black text-xs font-bold uppercase tracking-wide w-fit mx-auto brutal-shadow-sm">
            Book a service
          </div>
          <h1 className="mt-4 flex flex-col gap-1 items-center">
            <span className="font-sans font-black text-4xl sm:text-5xl text-[#111111] leading-[1.05]">Let&apos;s get your</span>
            <span className="font-display font-bold text-4xl sm:text-5xl leading-[1.1]">
              <span style={{ background: "linear-gradient(transparent 50%, #4fc3f7 50%)", paddingBottom: "4px" }}>AC sorted.</span>
            </span>
          </h1>
          <p className="mt-4 text-sm text-gray-500">Four quick steps. Asad confirms within 30 minutes.</p>
        </div>
        <Suspense fallback={<div className="border-2 border-black bg-white brutal-shadow p-10 text-center">Loading booking form...</div>}>
          <BookingForm />
        </Suspense>
      </div>
    </section>
  );
}
