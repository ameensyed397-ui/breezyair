"use client";

import { useState } from "react";
import Image from "next/image";
import { Snowflake, Wind, Thermometer, Zap, AlertTriangle, CheckCircle2 } from "lucide-react";

interface AcType {
  id: string;
  name: string;
  icon: React.ElementType;
  image: string;
  imageAlt: string;
  capacity: string;
  found: string;
  service: string[];
  sla: string;
}

const acTypes: AcType[] = [
  {
    id: "split",
    name: "Split AC",
    icon: Snowflake,
    image: "/ac-split.png",
    imageAlt: "Split AC wall-mounted unit",
    capacity: "0.8T – 2T per unit",
    found: "Small offices, clinic cabins, restaurant staff areas, retail stockrooms",
    service: [
      "Filter clean & sanitize",
      "Condenser & evaporator coil inspection",
      "Drain flush & anti-bacterial treatment",
      "Gas pressure check",
      "Electrical safety check",
      "Cooling performance test",
    ],
    sla: "All tiers (Care / Pro / Critical)",
  },
  {
    id: "cassette",
    name: "Cassette AC",
    icon: Wind,
    image: "/ac-cassette.png",
    imageAlt: "Cassette AC ceiling-mounted unit",
    capacity: "1T – 5T per unit",
    found: "Open-plan offices, co-working floors, salons, restaurant dining areas, retail showrooms",
    service: [
      "Ceiling panel filter removal & clean",
      "Coil foam wash",
      "4-way louver check & calibration",
      "Drain pump inspection",
      "Airflow balancing across all 4 directions",
    ],
    sla: "All tiers — 2-person team for 3T+ units",
  },
  {
    id: "ducted",
    name: "Ductable / Ducted AC",
    icon: Thermometer,
    image: "/ac-ducted.png",
    imageAlt: "Ductable AC outdoor unit with ductwork",
    capacity: "2T – 15T per system",
    found: "Large restaurants (hall), gyms, open-plan offices 2,000+ sq ft, hospitality back-of-house",
    service: [
      "AHU coil clean",
      "Filter bank service (all stages)",
      "Duct condition check for leaks",
      "Damper operation test & calibration",
      "Drain pan treatment",
      "Blower motor check & lubrication",
    ],
    sla: "Care and Pro tiers. Critical by arrangement.",
  },
  {
    id: "vrf",
    name: "VRF / VRV System",
    icon: Zap,
    image: "/ac-vrf.png",
    imageAlt: "Technician servicing a VRF multi-zone system",
    capacity: "3T – 60T+ per system (multiple indoor units, one outdoor unit)",
    found: "Large IT offices, boutique hotels, multi-floor commercial buildings, high-end co-working",
    service: [
      "Each indoor unit serviced individually",
      "Outdoor unit system diagnostic",
      "Refnet joint condition check",
      "Refrigerant pressure audit",
      "Control board firmware review",
      "Zone balancing & optimization",
    ],
    sla: "Pro and Critical tiers only. Specialist tools required.",
  },
  {
    id: "precision",
    name: "Precision AC (PAC)",
    icon: AlertTriangle,
    image: "/ac-pac.png",
    imageAlt: "Precision AC for server room environments",
    capacity: "1T – 20T per unit",
    found: "Server rooms, data centres, diagnostic labs, pharma storage",
    service: [
      "Humidity control verification",
      "Redundancy unit tested under load",
      "Manufacturer-certified partner-assisted service",
      "Temperature logging & compliance report",
      "Filter replacement (HEPA where applicable)",
    ],
    sla: "Critical tier only. Partner-assisted service.",
  },
];

export function AcTypesTabs() {
  const [active, setActive] = useState(0);
  const current = acTypes[active];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 lg:gap-8 items-start">
      {/* ── Left Column: Interactive Menu ── */}
      <div className="relative lg:static">
        <div className="flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0">
          {acTypes.map((ac, i) => {
            const Icon = ac.icon;
            const isActive = i === active;
            return (
              <button
                key={ac.id}
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)} // Instant hover effect on desktop
                className={`group flex items-center gap-3 p-4 border-2 border-black text-left transition-all shrink-0 lg:shrink-auto w-fit lg:w-full ${
                  isActive
                    ? "bg-[#4fc3f7] lg:translate-x-3 shadow-[4px_4px_0_0_#000] lg:shadow-[[-4px_4px_0_0_#000]] z-10"
                    : "bg-white hover:bg-[#e8f4fd] hover:translate-y-[-2px] hover:shadow-[4px_4px_0_0_#000]"
                }`}
                aria-pressed={isActive}
              >
                <div className={`w-8 h-8 flex items-center justify-center border-2 border-black bg-white shrink-0 ${isActive ? "bg-black text-white" : "text-black"}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`font-bold text-sm whitespace-nowrap lg:whitespace-normal ${isActive ? "text-black" : "text-gray-600"}`}>
                  {ac.name}
                </span>
                {isActive && (
                  <div className="ml-auto hidden lg:block w-3 h-3 bg-black rounded-full" />
                )}
              </button>
            );
          })}
        </div>
        {/* Mobile gradient fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-white to-transparent lg:hidden" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-white to-transparent lg:hidden" />
      </div>

      {/* ── Right Column: Dynamic Showcase ── */}
      <div className="border-2 border-black bg-white brutal-shadow overflow-hidden flex flex-col md:flex-row relative min-h-[450px]">
        
        {/* Detail text section */}
        <div className="flex-1 p-6 md:p-8 flex flex-col gap-6 order-2 md:order-1 transition-opacity duration-300 ease-in-out" key={`text-${current.id}`}>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-[#4fc3f7] border-2 border-black p-1">
                <current.icon className="w-6 h-6 text-black" />
              </div>
              <h3 className="font-display text-3xl font-bold text-[#111111]">{current.name}</h3>
            </div>
            <p className="text-sm font-bold text-[#0d47a1] bg-[#e8f4fd] inline-block px-2 py-1 border border-[#0d47a1] mb-4">
              Capacity: {current.capacity}
            </p>
            <p className="text-sm text-gray-600 leading-relaxed"><span className="font-bold text-black">Commonly found in:</span> {current.found}</p>
          </div>

          <div className="flex flex-col gap-3 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-black border-b-2 border-black pb-1">Included in Contract</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 mt-2">
              {current.service.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-[#111111]">
                  <CheckCircle2 className="w-4 h-4 text-[#4fc3f7] shrink-0 mt-0.5" />
                  <span className="leading-tight">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 bg-[#f5f7fa] border-2 border-black p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Supported SLA</p>
              <p className="text-sm font-bold text-[#111111] mt-0.5">{current.sla}</p>
            </div>
            <a href="#enquiry" className="btn-lift bg-[#ffb74d] text-black font-bold text-xs uppercase tracking-wider px-5 py-3 border-2 border-black shrink-0 text-center">
              Request Quote
            </a>
          </div>
        </div>

        {/* Image section */}
        <div className="w-full md:w-2/5 min-h-[250px] md:min-h-full bg-[#0d47a1] border-b-2 md:border-b-0 md:border-l-2 border-black p-6 flex items-center justify-center relative order-1 md:order-2 overflow-hidden">
          {/* Decorative background grid */}
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#fff 2px, transparent 2px)', backgroundSize: '20px 20px' }}></div>
          
          <div className="relative z-10 transform transition-transform duration-500 hover:scale-105" key={`img-${current.id}`}>
            <Image
              src={current.image}
              alt={current.imageAlt}
              width={400}
              height={400}
              className="object-contain w-full max-w-[280px] drop-shadow-2xl"
              priority
            />
          </div>
        </div>

      </div>
    </div>
  );
}
