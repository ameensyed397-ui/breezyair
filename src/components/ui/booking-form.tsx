"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ChevronRight, ArrowLeft, CreditCard, SkipForward } from "lucide-react";
import { PaymentButton } from "./payment-button";

const SERVICES = [
  { value: "basic-service", label: "AC Basic Service", price: 499, display: "₹499", icon: "🌬️", perAc: false, visits: null as string | null, features: ["Filter clean & coil check", "Performance test", "Cooling output check"] },
  { value: "full-service", label: "AC Full Service", price: 699, display: "₹699", icon: "🔧", perAc: false, visits: null, features: ["Indoor + outdoor unit service", "Fin straightening & coil wash", "Capacitor health check"] },
  { value: "wet-clean", label: "Wet Deep Clean", price: 899, display: "₹899", icon: "🫧", perAc: false, visits: null, features: ["High-pressure water jet wash", "Anti-bacterial foam treatment", "Drain line flush", "Coil & fin deep clean"] },
  { value: "installation", label: "AC Installation", price: 1499, display: "₹1,499", icon: "⚡", perAc: false, visits: null, features: ["Wall mounting & bracket", "Piping up to 3m", "Wiring & gas charge", "Trial run & handover"] },
  { value: "uninstallation", label: "AC Uninstallation", price: 699, display: "₹699", icon: "🔩", perAc: false, visits: null, features: ["Gas recovery", "Dismount & pack", "Cap & seal outdoor unit"] },
  { value: "inspection", label: "Inspection Visit", price: 350, display: "₹350*", icon: "🔍", perAc: false, visits: null, features: ["10-minute on-site diagnosis", "Written quote for repair", "*Waived if you approve the work"] },
  { value: "amc-chill-basic", label: "AMC — Chill Basic", price: 1499, display: "₹1,499/yr", icon: "❄️", perAc: false, visits: "2 scheduled visits/year", features: ["Filter clean each visit", "Basic health check", "10% off all repairs", "Priority booking"] },
  { value: "amc-bengaluru-cool", label: "AMC — Bengaluru Cool", price: 2999, display: "₹2,999/yr", icon: "🌟", perAc: false, visits: "3 scheduled visits/year", features: ["Full service each visit", "Gas pressure check", "20% off all repairs", "Priority same-day booking"] },
  { value: "amc-villa-plan", label: "AMC — Villa Plan", price: 1999, display: "₹1,999/AC/yr", icon: "🏡", perAc: true, visits: "3 visits per AC/year", features: ["All ACs covered", "Full service each visit", "20% off all repairs", "Dedicated technician"] },
];

const LOCALITIES = [
  { value: "koramangala", label: "Koramangala" },
  { value: "hsr-layout", label: "HSR Layout" },
  { value: "indiranagar", label: "Indiranagar" },
  { value: "whitefield", label: "Whitefield" },
  { value: "bellandur", label: "Bellandur" },
  { value: "other", label: "Other" },
];

const STEPS = ["Service", "Locality", "Date & Time", "Your Details", "Payment"];

function BookingAnchor({
  selectedService,
  isPerAc,
  acCount,
  selectedLocality,
  slot,
  form,
  totalCost,
  step
}: any) {
  if (step < 3) return null;
  return (
    <div className="border-2 border-black bg-[#e8f4fd] p-4 mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 brutal-shadow-sm">
      <div>
        <h3 className="font-bold text-[#111111] text-lg leading-tight">{selectedService?.label}</h3>
        <div className="flex flex-wrap items-center gap-2 mt-2">
          {isPerAc && <span className="text-[11px] font-bold text-[#111111] bg-white border border-black px-2 py-0.5 shadow-[2px_2px_0_0_#000]">{acCount} AC{acCount > 1 ? "s" : ""}</span>}
          {step >= 3 && selectedLocality && <span className="text-[11px] font-bold text-[#111111] bg-white border border-black px-2 py-0.5 shadow-[2px_2px_0_0_#000]">{selectedLocality.label}</span>}
          {step >= 4 && slot.date && <span className="text-[11px] font-bold text-[#111111] bg-white border border-black px-2 py-0.5 shadow-[2px_2px_0_0_#000]">{slot.date} {slot.time && `(${slot.time})`}</span>}
          {step >= 5 && form.name && <span className="text-[11px] font-bold text-[#111111] bg-white border border-black px-2 py-0.5 shadow-[2px_2px_0_0_#000]">{form.name}</span>}
        </div>
      </div>
      <div className="sm:text-right shrink-0">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-0.5">Total Price</p>
        <p className="font-display text-2xl font-bold text-[#0d47a1]">₹{totalCost.toLocaleString("en-IN")}{isPerAc ? <span className="text-xs text-gray-500">/yr</span> : ""}</p>
      </div>
    </div>
  );
}

function BookingFormInner() {
  const searchParams = useSearchParams();
  const initialService = searchParams.get("service") ?? "";
  const initialLocality = searchParams.get("locality") ?? "";
  const initialAcCount = Math.min(10, Math.max(1, parseInt(searchParams.get("acCount") ?? "1", 10) || 1));
  const [step, setStep] = useState(initialService ? (initialLocality ? 3 : 2) : 1);
  const [service, setService] = useState(initialService);
  const [locality, setLocality] = useState(initialLocality);
  const [acCount, setAcCount] = useState(initialAcCount);
  const [slot, setSlot] = useState({ date: "", time: "" });
  const [form, setForm] = useState({ name: "", phone: "", address: "", problem: "", urgent: false });
  const [honeyPot, setHoneyPot] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [minDate, setMinDate] = useState("");

  useEffect(() => {
    setMinDate(new Date().toISOString().split("T")[0]);
  }, []);

  const selectedService = SERVICES.find((s) => s.value === service);
  const selectedLocality = LOCALITIES.find((l) => l.value === locality);

  const isPerAc = selectedService?.perAc ?? false;
  const isOneOff = !selectedService?.value.startsWith("amc-") && selectedService?.value !== "installation" && selectedService?.value !== "uninstallation" && selectedService?.value !== "inspection";
  const showAcCount = isPerAc || isOneOff;

  const BUNDLES: Record<number, { savings: number; perAc?: number }> = {
    1: { savings: 0 },
    2: { savings: 99 },
    3: { savings: 298 },
  };

  let totalCost: number;
  if (isPerAc) {
    totalCost = (selectedService?.price ?? 0) * acCount;
  } else if (isOneOff && acCount >= 4) {
    totalCost = 449 * acCount;
  } else if (isOneOff && acCount >= 2) {
    const bundle = BUNDLES[acCount] ?? { savings: 0 };
    totalCost = (selectedService?.price ?? 0) * acCount - bundle.savings;
  } else {
    totalCost = (selectedService?.price ?? 0) * (acCount > 0 ? 1 : 1);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");

    const pricingNote = isPerAc
      ? `${selectedService?.display} x ${acCount} ACs = ₹${totalCost.toLocaleString("en-IN")}/yr`
      : isOneOff && acCount > 1
      ? `${selectedService?.display} x ${acCount} ACs = ₹${totalCost.toLocaleString("en-IN")}`
      : selectedService?.display;

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "booking",
          name: form.name,
          phone: form.phone,
          locality,
          issueType: `AC Booking: ${selectedService?.label} (${pricingNote}) — ${form.problem || "No description"}`,
          urgency: form.urgent ? "Urgent" : "Normal",
          address: form.address,
          slotDate: slot.date,
          slotTime: slot.time,
          service: selectedService?.value,
          amount: totalCost,
          acCount: showAcCount ? acCount : 1,
          honeyPot,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to submit booking.");
      }

      // Move to payment step
      setStep(5);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const waLink = () => {
    const svc = selectedService?.label ?? service;
    const loc = selectedLocality?.label ?? locality;
    const costStr = isPerAc ? `${acCount}+ACs+₹${totalCost.toLocaleString("en-IN")}` : selectedService?.display;
    const dateStr = slot.date ? `+on+${slot.date}` : "";
    const timeStr = slot.time ? `+(${slot.time})` : "";
    const payStr = paymentId ? `+✅+Paid+online+(${paymentId.slice(0, 12)}…)` : "";
    return `https://wa.me/918660174569?text=Hi+Asad,+I+booked+${encodeURIComponent(svc)}+(${costStr})+in+${encodeURIComponent(loc)}${dateStr}${timeStr}${payStr}`;
  };

  if (submitted) {
    return (
      <div className="border-2 border-black bg-white brutal-shadow p-8 md:p-10 text-center max-w-lg mx-auto">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 border-2 border-black bg-[#a7ffeb] flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-[#111111]" aria-hidden="true" />
          </div>
        </div>
        <h2 className="font-display text-3xl font-bold text-[#111111] mb-2">Booking received!</h2>
        <p className="text-sm text-gray-500 mb-6">
          Asad will call you at <strong className="text-[#111111]">{form.phone}</strong> within 30 minutes to confirm.
        </p>
        <div className="border-2 border-black bg-[#f5f7fa] p-4 text-left mb-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Your booking summary</p>
          <p className="text-sm text-gray-500">Service: <span className="text-[#111111] font-bold">{selectedService?.label}</span></p>
          {showAcCount && acCount > 1 && <p className="text-sm text-gray-500">ACs: <span className="text-[#111111] font-bold">{acCount} unit{acCount > 1 ? "s" : ""}</span></p>}
          <p className="text-sm text-gray-500">Total: <span className="text-[#0d47a1] font-bold font-display text-lg">₹{totalCost.toLocaleString("en-IN")}{isPerAc ? "/yr" : ""}</span></p>
          <p className="text-sm text-gray-500">Area: <span className="text-[#111111] font-bold">{selectedLocality?.label}</span></p>
          {slot.date && <p className="text-sm text-gray-500">Date: <span className="text-[#111111] font-bold">{slot.date} ({slot.time})</span></p>}
          <p className="text-sm text-gray-500">Name: <span className="text-[#111111] font-bold">{form.name}</span></p>
          {paymentId && (
            <div className="mt-3 pt-3 border-t-2 border-black">
              <p className="text-xs text-gray-500 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-[#4fc3f7] shrink-0" />
                <span>Paid online · ID: <span className="font-mono text-[#111111] break-all">{paymentId}</span></span>
              </p>
            </div>
          )}
          {!paymentId && (
            <div className="mt-3 pt-3 border-t-2 border-black">
              <p className="text-xs text-gray-500">Payment: <span className="font-bold text-[#111111]">Pay on-site</span></p>
            </div>
          )}
          {form.urgent && <p className="text-sm font-bold mt-2 text-[#ef4444]">This is urgent — Asad will prioritise your slot.</p>}
        </div>
        <a
          href={waLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-lift block w-full bg-[#4fc3f7] text-black font-bold text-sm uppercase tracking-wider py-4 border-2 border-black mb-3"
          aria-label="Confirm on WhatsApp"
        >
          Confirm on WhatsApp
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
      <div className="flex items-center justify-center mb-10 overflow-x-auto pb-2 scrollbar-hide">
        {STEPS.map((label, i) => {
          const num = i + 1;
          const active = step === num;
          const done = step > num;
          return (
            <div key={label} className="flex items-center flex-shrink-0">
              <button 
                type="button"
                onClick={() => { if (done) setStep(num); }}
                className={`flex flex-col items-center ${done ? "cursor-pointer hover:opacity-80 transition-opacity" : "cursor-default"}`}
                aria-label={done ? `Go back to ${label} step` : `${label} step`}
              >
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
              </button>
              {i < STEPS.length - 1 && (
                <ChevronRight className="w-5 h-5 mx-2 flex-shrink-0 text-gray-300" style={{ marginBottom: "18px" }} aria-hidden="true" />
              )}
            </div>
          );
        })}
      </div>

      {/* ── STEP 1: Service picker ───────────────────────── */}
      {step === 1 && (
        <div>
          <h2 className="font-display text-3xl font-bold text-[#111111] mb-2">What do you need?</h2>
          <p className="text-sm text-gray-500 mb-6">Select a service to see full pricing and what&apos;s included.</p>

          {/* One-off services */}
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">One-off services</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {SERVICES.filter((s) => !s.value.startsWith("amc-")).map((s) => (
              <button
                key={s.value}
                onClick={() => { setService(s.value); setStep(2); }}
                className="card-lift bg-white p-4 text-left"
                style={service === s.value ? { boxShadow: "4px 4px 0 #4fc3f7" } : {}}
                aria-label={`Select ${s.label}`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-xl">{s.icon}</span>
                  <div className="flex items-center gap-2">
                    {service === s.value && <CheckCircle2 className="w-4 h-4 text-[#4fc3f7]" aria-label="Selected" />}
                    <span className="bg-[#ffb74d] text-black text-xs font-bold border-2 border-black px-2 py-0.5">{s.display}</span>
                  </div>
                </div>
                <h3 className="font-bold text-sm mt-2 text-[#111111]">{s.label}</h3>
              </button>
            ))}
          </div>

          {/* AMC plans */}
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#4fc3f7] mb-3">Annual Maintenance Contracts</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SERVICES.filter((s) => s.value.startsWith("amc-")).map((s) => (
              <button
                key={s.value}
                onClick={() => { setService(s.value); setAcCount(s.perAc ? 1 : 1); setStep(2); }}
                className="card-lift bg-white p-4 text-left border-2 border-black relative"
                style={service === s.value ? { boxShadow: "4px 4px 0 #4fc3f7", borderColor: "#4fc3f7" } : {}}
                aria-label={`Select ${s.label}`}
              >
                {s.value === "amc-bengaluru-cool" && (
                  <div className="absolute -top-2.5 right-3 bg-[#0d47a1] text-white text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 border border-black">
                    Popular
                  </div>
                )}
                <span className="text-xl">{s.icon}</span>
                <h3 className="font-bold text-sm mt-2 text-[#111111]">{s.label.replace("AMC — ", "")}</h3>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="font-display text-2xl font-bold text-[#0d47a1]">{s.display}</span>
                </div>
                {s.visits && <p className="text-[10px] text-gray-500 mt-1">{s.visits}</p>}
                {s.perAc && (
                  <p className="text-[10px] font-bold text-[#4fc3f7] mt-1">Per-unit pricing — see total below</p>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── STEP 2: Locality + AC count for per-unit services ── */}
      {step === 2 && (
        <div>
          {/* Cost summary card */}
          <div className="border-2 border-black bg-white brutal-shadow p-5 mb-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Your service</p>
                <h3 className="font-bold text-lg text-[#111111]">{selectedService?.label}</h3>
                {selectedService?.visits && <p className="text-xs text-gray-500 mt-0.5">{selectedService.visits}</p>}
              </div>
              <div className="text-right shrink-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Price</p>
                <span className="bg-[#4fc3f7] text-black font-bold text-sm border-2 border-black px-3 py-1 inline-block">{selectedService?.display}</span>
              </div>
            </div>

            {/* Per-unit AC counter for Villa Plan */}
            {isPerAc && (
              <div className="mt-4 pt-4 border-t-2 border-black">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Number of AC units</p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setAcCount(Math.max(1, acCount - 1))}
                    className="w-11 h-11 border-2 border-black bg-white font-bold text-lg hover:bg-gray-50 flex items-center justify-center"
                    aria-label="Decrease AC count"
                  >
                    −
                  </button>
                  <span className="font-display text-3xl font-bold text-[#111111] w-12 text-center">{acCount}</span>
                  <button
                    onClick={() => setAcCount(Math.min(10, acCount + 1))}
                    className="w-11 h-11 border-2 border-black bg-white font-bold text-lg hover:bg-gray-50 flex items-center justify-center"
                    aria-label="Increase AC count"
                  >
                    +
                  </button>
                  <div className="ml-auto text-right">
                    <p className="text-xs text-gray-500">{acCount} × ₹1,999</p>
                    <p className="font-display text-2xl font-bold text-[#0d47a1]">₹{totalCost.toLocaleString("en-IN")}<span className="text-xs text-gray-500">/yr</span></p>
                  </div>
                </div>
              </div>
            )}

            {/* AC count for one-off services with bundle discount */}
            {isOneOff && (
              <div className="mt-4 pt-4 border-t-2 border-black">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Number of ACs</p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setAcCount(Math.max(1, acCount - 1))}
                    className="w-11 h-11 border-2 border-black bg-white font-bold text-lg hover:bg-gray-50 flex items-center justify-center"
                    aria-label="Decrease AC count"
                  >
                    −
                  </button>
                  <span className="font-display text-3xl font-bold text-[#111111] w-12 text-center">{acCount}</span>
                  <button
                    onClick={() => setAcCount(Math.min(6, acCount + 1))}
                    className="w-11 h-11 border-2 border-black bg-white font-bold text-lg hover:bg-gray-50 flex items-center justify-center"
                    aria-label="Increase AC count"
                  >
                    +
                  </button>
                  <div className="ml-auto text-right">
                    {acCount >= 4 ? (
                      <p className="text-xs text-gray-500">{acCount} × ₹449/AC</p>
                    ) : acCount >= 2 ? (
                      <p className="text-xs text-[#4fc3f7] font-bold">Save ₹{(BUNDLES[acCount]?.savings ?? 0).toLocaleString("en-IN")}</p>
                    ) : (
                      <p className="text-xs text-gray-500">Single unit</p>
                    )}
                    <p className="font-display text-2xl font-bold text-[#0d47a1]">₹{totalCost.toLocaleString("en-IN")}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Fixed-price total for non-per-unit, non-one-off (installation, uninstallation, inspection, AMC) */}
            {!isPerAc && !isOneOff && (
              <div className="mt-4 pt-4 border-t-2 border-black">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Total</p>
                    <p className="text-xs text-gray-500 mt-0.5">One-time service · no hidden charges</p>
                  </div>
                  <p className="font-display text-2xl font-bold text-[#0d47a1]">₹{totalCost.toLocaleString("en-IN")}</p>
                </div>
              </div>
            )}

            {/* What's included */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#4fc3f7] mb-2">What&apos;s included</p>
              <ul className="space-y-1">
                {selectedService?.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-[#111111]">
                    <CheckCircle2 className="w-3 h-3 text-[#4fc3f7] shrink-0" aria-hidden="true" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

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
                {l.label}
              </button>
            ))}
          </div>
          <button onClick={() => setStep(1)} className="mt-6 text-sm font-bold text-gray-500 inline-flex items-center gap-1 hover:text-[#4fc3f7]">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>
      )}

      {/* ── STEP 3: Date & time ──────────────────────────── */}
      {step === 3 && (
        <div>
          <h2 className="font-display text-3xl font-bold text-[#111111] mb-4">Pick a date &amp; time</h2>
          <BookingAnchor 
            selectedService={selectedService} isPerAc={isPerAc} acCount={acCount} 
            selectedLocality={selectedLocality} slot={slot} form={form} totalCost={totalCost} step={step} 
          />
          <div className="border-2 border-black bg-white brutal-shadow p-6 flex flex-col gap-6">
            <div>
              <label htmlFor="preferred-date" className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Preferred date</label>
              <input
                id="preferred-date"
                type="date"
                value={slot.date}
                min={minDate}
                onChange={(e) => setSlot({ ...slot, date: e.target.value })}
                className="h-11 w-full border-2 border-black bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4fc3f7] cursor-text"
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
                    <p className="text-xs text-gray-500 mt-1">{t.sub}</p>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 border-2 border-black bg-[#ffb74d]">
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
              Continue
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 4: Contact details ──────────────────────── */}
      {step === 4 && (
        <div>
          <h2 className="font-display text-3xl font-bold text-[#111111] mb-4">Your details</h2>
          <BookingAnchor 
            selectedService={selectedService} isPerAc={isPerAc} acCount={acCount} 
            selectedLocality={selectedLocality} slot={slot} form={form} totalCost={totalCost} step={step} 
          />
          <form onSubmit={handleSubmit} className="border-2 border-black bg-white brutal-shadow p-6 flex flex-col gap-5">
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
            <div>
              <label htmlFor="name" className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Full name *</label>
              <input id="name" type="text" required disabled={submitting} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="h-11 w-full border-2 border-black bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4fc3f7] disabled:opacity-60" placeholder="Your name" maxLength={100} />
            </div>
            <div>
              <label htmlFor="phone" className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Phone number *</label>
              <input id="phone" type="tel" required disabled={submitting} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="h-11 w-full border-2 border-black bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4fc3f7] disabled:opacity-60" placeholder="+91 00000 00000" maxLength={15} />
            </div>
            <div>
              <label htmlFor="address" className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Full address *</label>
              <input id="address" type="text" required disabled={submitting} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="h-11 w-full border-2 border-black bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4fc3f7] disabled:opacity-60" placeholder="Flat, building, street, area" maxLength={200} />
            </div>
            <div>
              <label htmlFor="problem" className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Describe the problem (optional)</label>
              <textarea id="problem" disabled={submitting} value={form.problem} onChange={(e) => setForm({ ...form, problem: e.target.value })}
                className="w-full border-2 border-black bg-white px-3 py-2.5 text-sm min-h-[90px] resize-none focus:outline-none focus:ring-2 focus:ring-[#4fc3f7] disabled:opacity-60"
                placeholder="E.g. not cooling, making noise, leaking water..." rows={3} maxLength={500} />
            </div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" disabled={submitting} checked={form.urgent} onChange={(e) => setForm({ ...form, urgent: e.target.checked })}
                className="mt-1 w-4 h-4 cursor-pointer accent-[#4fc3f7]" />
              <div>
                <span className="font-bold text-sm text-[#111111]">This is urgent</span>
                <p className="text-xs text-gray-500">Asad will prioritise your slot and call within 15 minutes.</p>
              </div>
            </label>
            {submitError && (
              <p className="text-sm font-semibold text-red-600 border-2 border-black bg-red-50 p-3 brutal-shadow-sm">
                {submitError}
              </p>
            )}
            <div className="flex items-center gap-4 mt-1">
              <button type="button" disabled={submitting} onClick={() => setStep(3)} className="text-sm font-bold text-gray-500 inline-flex items-center gap-1 hover:text-[#4fc3f7] disabled:opacity-50">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button type="submit" disabled={submitting} className="btn-lift bg-[#4fc3f7] text-black font-bold text-sm uppercase tracking-wider px-10 py-3 border-2 border-black ml-auto disabled:opacity-50">
                {submitting ? "Confirming..." : "Confirm booking"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── STEP 5: Payment ─────────────────────────────── */}
      {step === 5 && (
        <div className="max-w-lg mx-auto">
          <h2 className="font-display text-3xl font-bold text-[#111111] mb-2">Secure your slot</h2>
          <p className="text-sm text-gray-500 mb-6">
            Pay now to confirm your booking, or skip and pay Asad on-site.
          </p>

          <BookingAnchor 
            selectedService={selectedService} isPerAc={isPerAc} acCount={acCount} 
            selectedLocality={selectedLocality} slot={slot} form={form} totalCost={totalCost} step={step} 
          />

          {/* Payment button */}
          <div className="border-2 border-black bg-[#e8f4fd] p-5 mb-4">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-5 h-5 text-[#0d47a1]" aria-hidden="true" />
              <div>
                <p className="text-sm font-bold text-[#111111]">Pay online now</p>
                <p className="text-xs text-gray-500">Razorpay · UPI, cards, netbanking</p>
              </div>
            </div>
            <PaymentButton
              amount={totalCost}
              description={`${selectedService?.label} — ${selectedLocality?.label}`}
              onSuccess={(pid) => {
                setPaymentId(pid);
                setSubmitted(true);
              }}
              onError={(msg) => setPaymentError(msg)}
            />
          </div>

          {paymentError && (
            <p className="text-sm font-semibold text-red-600 border-2 border-black bg-red-50 p-3 mb-4 brutal-shadow-sm">
              {paymentError}
            </p>
          )}

          {/* Skip payment */}
          <button
            onClick={() => setSubmitted(true)}
            className="w-full flex items-center justify-center gap-2 bg-white text-gray-500 font-bold text-sm uppercase tracking-wider py-3 border-2 border-black hover:border-gray-400 transition-colors"
          >
            <SkipForward className="w-4 h-4" aria-hidden="true" />
            Skip — pay on-site
          </button>

          <button onClick={() => setStep(4)} className="mt-4 text-sm font-bold text-gray-500 inline-flex items-center gap-1 hover:text-[#4fc3f7]">
            <ArrowLeft className="w-4 h-4" /> Back to details
          </button>
        </div>
      )}
    </div>
  );
}

export function BookingForm() {
  return (
    <Suspense fallback={<div className="border-2 border-black bg-white brutal-shadow p-10 text-center">Loading booking form...</div>}>
      <BookingFormInner />
    </Suspense>
  );
}
