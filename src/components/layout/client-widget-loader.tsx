"use client";

import dynamic from "next/dynamic";

const BreezyWidget = dynamic(
  () => import("@/components/agent/breezy-widget").then((m) => ({ default: m.BreezyWidget })),
  { ssr: false }
);

export function ClientWidgetLoader() {
  return <BreezyWidget />;
}
