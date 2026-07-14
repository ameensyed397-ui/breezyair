"use client";

import { useRef, useEffect, useState, type ReactNode } from "react";

interface AnimateInProps {
  children: ReactNode;
  className?: string;
  animation?: "fade-in-up" | "fade-in" | "pop-in" | "slide-in-right";
  delay?: number;
  once?: boolean;
}

const ANIMATION_MAP: Record<string, string> = {
  "fade-in-up": "fade-in-up 0.5s ease-out both",
  "fade-in": "fade-in 0.4s ease-out both",
  "pop-in": "pop-in 0.4s ease-out both",
  "slide-in-right": "slide-in-right 0.5s ease-out both",
};

/**
 * Wrapper that triggers a CSS animation when the element scrolls into view.
 * Uses IntersectionObserver — zero dependencies, respects prefers-reduced-motion.
 */
export function AnimateIn({
  children,
  className = "",
  animation = "fade-in-up",
  delay = 0,
  once = true,
}: AnimateInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  const animStyle = visible
    ? { animation: `${ANIMATION_MAP[animation]} ${delay ? `${delay}s` : ""}`.trim() }
    : { opacity: 0 };

  return (
    <div ref={ref} className={className} style={animStyle}>
      {children}
    </div>
  );
}
