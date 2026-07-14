"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function BookError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="w-full min-h-screen bg-[#f5f7fa] px-4 py-12 md:px-6 lg:px-8">
      <div className="max-w-lg mx-auto border-2 border-black bg-white brutal-shadow p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 border-2 border-black bg-red-50 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-500" aria-hidden="true" />
          </div>
        </div>
        <h2 className="font-display text-3xl font-bold text-[#111111] mb-2">Something went wrong</h2>
        <p className="text-sm text-gray-500 mb-6">
          The booking form hit an unexpected error. You can try again or call Asad directly.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={reset}
            className="btn-lift w-full bg-[#4fc3f7] text-black font-bold text-sm uppercase tracking-wider py-4 border-2 border-black"
          >
            Try again
          </button>
          <a
            href="tel:+918660174569"
            className="btn-lift w-full bg-white text-black font-bold text-sm uppercase tracking-wider py-3 border-2 border-black"
          >
            Call Asad: +91 8660174569
          </a>
          <Link
            href="/"
            className="w-full text-center text-sm font-bold text-gray-500 hover:text-[#4fc3f7] py-2"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
