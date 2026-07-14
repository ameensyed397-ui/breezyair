import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://breezyair.co" },
      ...items.map((item, i) => ({
        "@type": "ListItem" as const,
        position: i + 2,
        name: item.label,
        ...(item.href ? { item: `https://breezyair.co${item.href}` } : {}),
      })),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-gray-400 font-medium mb-6">
        <Link href="/" className="hover:text-[#4fc3f7] transition-colors">Home</Link>
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <ChevronRight className="w-3 h-3 text-gray-300" aria-hidden="true" />
            {item.href ? (
              <Link href={item.href} className="hover:text-[#4fc3f7] transition-colors">{item.label}</Link>
            ) : (
              <span className="text-[#111111] font-semibold">{item.label}</span>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}
