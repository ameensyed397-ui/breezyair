import type { Metadata } from "next";
import { BookingForm } from "@/components/ui/booking-form";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export const metadata: Metadata = {
  title: "Book AC Service in Bengaluru",
  description:
    "Book same-day AC repair, maintenance or installation in Bengaluru. 4 quick steps — Asad confirms within 30 minutes. No hidden costs.",
  alternates: { canonical: "https://breezyair.co/book" },
  openGraph: {
    title: "Book AC Service | Breezyair Bengaluru",
    description: "Book AC service in 4 steps. Same-day availability, transparent pricing, certified technicians.",
    url: "https://breezyair.co/book",
  },
};

export default function BookPage() {
  return (
    <div className="w-full min-h-screen bg-[#f5f7fa] px-4 py-12 md:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center mb-2">
        <Breadcrumbs items={[{ label: "Book a Service" }]} />
      </div>
      <h1 className="font-display text-4xl md:text-5xl font-bold text-center text-[#111111] mb-3">
        Book your service
      </h1>
      <p className="text-center text-gray-500 text-sm mb-10 max-w-md mx-auto">
        4 quick steps. Asad will call to confirm within 30 minutes.
      </p>
      <BookingForm />
    </div>
  );
}
