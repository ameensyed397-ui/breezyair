import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <section className="min-h-[70vh] flex flex-col items-center justify-center px-4 md:px-8 text-center">
      <div className="relative w-32 h-32 mb-6">
        <Image
          src="/hero-mascot.png"
          alt="Breezyair mascot"
          fill
          className="object-contain"
          priority
        />
      </div>
      <h1 className="font-sans font-black text-6xl sm:text-7xl text-[#111111] leading-[1.05]">
        404
      </h1>
      <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#4fc3f7] mt-2 mb-4">
        This page went chilling.
      </h2>
      <p className="text-sm text-gray-500 max-w-md mb-8">
        Looks like this page doesn&apos;t exist — maybe it was moved, or maybe you
        mistyped the URL. Either way, we&apos;ve got you covered.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link href="/">
          <button className="btn-lift bg-[#4fc3f7] text-black font-bold text-sm uppercase tracking-wider px-8 py-3 border-2 border-black">
            Back to Home
          </button>
        </Link>
        <Link href="/book">
          <button className="btn-lift bg-white text-black font-bold text-sm uppercase tracking-wider px-8 py-3 border-2 border-black">
            Book a Service
          </button>
        </Link>
      </div>
    </section>
  );
}
