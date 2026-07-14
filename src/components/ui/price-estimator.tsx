"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

const SERVICES = [
  {
    id: "basic",
    name: "AC Basic Service",
    price: 499,
    display: "₹499",
    includes: ["Filter clean & coil check", "Performance test", "Cooling output check"],
    extras: [
      { name: "Capacitor replacement", price: 749 },
      { name: "Fan motor", price: 1200 },
    ],
  },
  {
    id: "full",
    name: "AC Full Service",
    price: 699,
    display: "₹699",
    includes: ["Indoor + outdoor unit service", "Fin straightening & coil wash", "Capacitor health check", "Electrical connection check"],
    extras: [
      { name: "Gas top-up (if low)", price: 800 },
      { name: "Capacitor replacement", price: 749 },
      { name: "Drain flush", price: 399 },
    ],
  },
  {
    id: "deep",
    name: "Wet Deep Clean",
    price: 899,
    display: "₹899",
    includes: ["High-pressure water jet wash", "Anti-bacterial foam treatment", "Drain line flush", "Coil & fin deep clean"],
    extras: [
      { name: "Gas top-up (if low)", price: 800 },
      { name: "Copper pipe (if damaged)", price: 899 },
    ],
  },
  {
    id: "install",
    name: "AC Installation",
    price: 1499,
    display: "₹1,499",
    includes: ["Wall mounting & bracket", "Piping up to 3m", "Wiring & gas charge", "Trial run & handover"],
    extras: [
      { name: "Extra piping (per m)", price: 899 },
    ],
  },
  {
    id: "uninstall",
    name: "AC Uninstallation",
    price: 699,
    display: "₹699",
    includes: ["Gas recovery", "Dismount & pack", "Cap & seal outdoor unit"],
    extras: [],
  },
];

const TONNAGE = [
  { label: "1T", value: 1, gasTopUp: 800 },
  { label: "1.5T", value: 1.5, gasTopUp: 1000 },
  { label: "2T", value: 2, gasTopUp: 1200 },
  { label: "2.5T", value: 2.5, gasTopUp: 1500 },
  { label: "3T", value: 3, gasTopUp: 1800 },
];

const BUNDLES = [
  { count: 1, label: "1 AC", savings: 0 },
  { count: 2, label: "2 ACs", savings: 99 },
  { count: 3, label: "3 ACs", savings: 298 },
  { count: 4, label: "4+ ACs", savings: 0, perAc: 449 },
];

export function PriceEstimator() {
  const [serviceIdx, setServiceIdx] = useState(1);
  const [tonnageIdx, setTonnageIdx] = useState(1);
  const [acCount, setAcCount] = useState(1);

  const service = SERVICES[serviceIdx];
  const tonnage = TONNAGE[tonnageIdx];
  const bundle = BUNDLES.find((b) => b.count === acCount) ?? BUNDLES[0];

  // Calculate estimated price
  let baseTotal: number;
  if (acCount >= 4) {
    baseTotal = 449 * acCount;
  } else if (acCount >= 2 && service.id !== "install") {
    baseTotal = service.price * acCount - (bundle.savings ?? 0);
  } else {
    baseTotal = service.price * acCount;
  }

  const gasEstimate = (service.id !== "install" && service.id !== "uninstall") ? tonnage.gasTopUp : 0;
  const worstCase = baseTotal + gasEstimate + (service.extras[0]?.price ?? 0);

  return (
    <div className="border-2 border-black bg-white brutal-shadow p-6 md:p-8 w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="font-display text-3xl sm:text-4xl font-bold text-[#111111]">Price Estimator</h3>
        <p className="text-xs text-gray-500 mt-1">Select your service — see an instant estimate.</p>
      </div>

      {/* Service selector */}
      <div className="mb-5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Service</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {SERVICES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setServiceIdx(i)}
              className={`p-3 border-2 border-black text-left transition-all ${
                i === serviceIdx
                  ? "bg-[#4fc3f7] brutal-shadow-sm"
                  : "bg-white hover:bg-gray-50"
              }`}
              aria-pressed={i === serviceIdx}
            >
              <span className="text-xs font-bold text-[#111111] block">{s.name}</span>
              <span className="font-display text-lg font-bold text-[#0d47a1]">{s.display}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tonnage slider */}
      {service.id !== "install" && service.id !== "uninstall" && (
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">AC Tonnage</p>
            <span className="text-sm font-bold text-[#0d47a1]">{TONNAGE[tonnageIdx].label}</span>
          </div>
          <input
            type="range"
            min={0}
            max={TONNAGE.length - 1}
            step={1}
            value={tonnageIdx}
            onChange={(e) => setTonnageIdx(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 border-2 border-black appearance-none cursor-pointer accent-[#4fc3f7]"
            aria-label="AC tonnage"
          />
          <div className="flex justify-between mt-1">
            {TONNAGE.map((t) => (
              <span key={t.label} className="text-[10px] text-gray-400 font-bold">{t.label}</span>
            ))}
          </div>
        </div>
      )}

      {/* AC count stepper */}
      {service.id !== "install" && (
        <div className="mb-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Number of ACs</p>
          <div className="flex items-center gap-3">
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
            {acCount >= 2 && (
              <span className="text-xs font-bold text-[#4fc3f7] ml-2">
                {bundle.perAc ? `₹${bundle.perAc}/AC` : `Save ₹${bundle.savings}`}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Estimate result */}
      <div className="border-2 border-black bg-[#f5f7fa] p-5 mb-5">
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Estimated price</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display text-4xl font-bold text-[#0d47a1]">₹{baseTotal.toLocaleString("en-IN")}</span>
              {acCount > 1 && <span className="text-xs text-gray-500">total</span>}
            </div>
          </div>
          {acCount >= 2 && !bundle.perAc && bundle.savings > 0 && (
            <span className="bg-[#a7ffeb] text-black text-xs font-bold border-2 border-black px-2 py-0.5">
              Save ₹{bundle.savings}
            </span>
          )}
        </div>

        {/* Included */}
        <div className="mb-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#4fc3f7] mb-1.5">Included</p>
          <ul className="space-y-1">
            {service.includes.map((item) => (
              <li key={item} className="flex items-center gap-2 text-xs text-[#111111]">
                <CheckCircle2 className="w-3 h-3 text-[#4fc3f7] shrink-0" aria-hidden="true" /> {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Potential extras */}
        <div className="border-t border-gray-200 pt-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">May also need (if applicable)</p>
          <ul className="space-y-1">
            {service.extras.map((ex) => (
              <li key={ex.name} className="flex items-center justify-between text-xs text-gray-500">
                <span>{ex.name}</span>
                <span className="font-bold">from ₹{ex.price}</span>
              </li>
            ))}
            {service.id !== "install" && service.id !== "uninstall" && (
              <li className="flex items-center justify-between text-xs text-gray-500">
                <span>Gas top-up ({tonnage.label})</span>
                <span className="font-bold">from ₹{tonnage.gasTopUp}</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Max estimate note */}
      <p className="text-[10px] text-gray-400 text-center mb-4">
        Worst case (with all common add-ons): ~₹{worstCase.toLocaleString("en-IN")} — always approved by you first.
      </p>

      {/* CTA */}
      <Link
        href={`/book?service=${service.id === "basic" ? "basic-service" : service.id === "full" ? "full-service" : service.id === "deep" ? "wet-clean" : service.id === "install" ? "installation" : service.id === "uninstall" ? "uninstallation" : service.id}${service.id !== "install" ? `&acCount=${acCount}` : ""}`}
        className="block"
      >
        <button className="btn-lift w-full bg-[#4fc3f7] text-black font-bold text-sm uppercase tracking-wider py-3 border-2 border-black inline-flex items-center justify-center gap-2">
          Book {service.name} <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </Link>
    </div>
  );
}
