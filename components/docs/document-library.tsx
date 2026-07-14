"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Image, BookOpen, Calendar, Receipt, FileSignature, BarChart3, File } from "lucide-react";
import { DocumentDetailSheet } from "./document-detail-sheet";
import type { MockDocument } from "@/lib/db/mock";
import { formatDate } from "@/lib/format";

type D = MockDocument;
type M = { id: string; customerId: string | null; jobId: string | null; category: string; storagePath: string | null; createdBy: string | null; createdAt: Date | null; updatedAt: Date | null; customerName?: string };

const typeVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  invoice: "default",
  quote: "outline",
  contract: "secondary",
  sop: "outline",
  report: "secondary",
  other: "secondary",
};

function iconFor(type: string) {
  switch (type) {
    case "invoice": return <Receipt className="h-4 w-4" />;
    case "contract": return <FileSignature className="h-4 w-4" />;
    case "quote": return <FileText className="h-4 w-4" />;
    case "sop": return <BookOpen className="h-4 w-4" />;
    case "report": return <BarChart3 className="h-4 w-4" />;
    default: return <File className="h-4 w-4" />;
  }
}

function iconForMedia() {
  return <Image className="h-4 w-4" />;
}

type CombinedItem = {
  id: string;
  name: string;
  type: string;
  customerName?: string;
  storagePath: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  category?: string;
  source: "doc" | "media";
  doc?: D;
  media?: M;
};

export function DocumentLibrary({ documents, media }: { documents: D[]; media: M[] }) {
  const [tab, setTab] = useState<"all" | "docs" | "photos">("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<CombinedItem | null>(null);

  const items: CombinedItem[] = useMemo(() => {
    const docs: CombinedItem[] = documents.map((d) => ({
      id: d.id, name: d.name, type: d.type, customerName: d.customerName,
      storagePath: d.storagePath, createdAt: d.createdAt, updatedAt: d.updatedAt,
      source: "doc" as const, doc: d,
    }));
    const photos: CombinedItem[] = media.map((m) => ({
      id: m.id, name: m.storagePath?.split("/").pop() ?? "Photo",
      type: "photo", customerName: m.customerName,
      storagePath: m.storagePath, createdAt: m.createdAt, updatedAt: m.updatedAt,
      category: m.category, source: "media" as const, media: m,
    }));
    return [...docs, ...photos];
  }, [documents, media]);

  const filtered = useMemo(() => {
    return items
      .filter((item) => {
        if (tab === "docs") return item.source === "doc";
        if (tab === "photos") return item.source === "media";
        return true;
      })
      .filter((item) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.customerName?.toLowerCase().includes(q) ||
          item.type.toLowerCase().includes(q) ||
          item.category?.toLowerCase().includes(q)
        );
      });
  }, [items, tab, search]);

  const stats = useMemo(() => ({
    total: items.length,
    docs: items.filter((i) => i.source === "doc").length,
    photos: items.filter((i) => i.source === "media").length,
  }), [items]);

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
          <TabsList>
            <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
            <TabsTrigger value="docs">Documents ({stats.docs})</TabsTrigger>
            <TabsTrigger value="photos">Photos ({stats.photos})</TabsTrigger>
          </TabsList>
        </Tabs>
        <input
          type="text"
          placeholder="Search name, customer, type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring sm:w-64"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed py-16 text-center text-sm text-muted-foreground">
          {search ? "No files match your search." : "No documents or photos yet — files auto-appear from jobs and invoices."}
        </div>
      ) : (
        <ul className="divide-y rounded-lg border bg-card">
          {filtered.map((item) => (
            <li key={`${item.source}-${item.id}`}>
              <button
                onClick={() => setSelected(item)}
                className="flex w-full items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-secondary/60"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                  {item.source === "media" ? iconForMedia() : iconFor(item.type)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-medium">{item.name}</span>
                    <Badge variant={typeVariant[item.type] ?? "secondary"} className="text-[10px]">
                      {item.type}
                    </Badge>
                    {item.category && (
                      <Badge variant="outline" className="text-[10px]">{item.category}</Badge>
                    )}
                  </div>
                  <p className="truncate text-sm text-muted-foreground">
                    {item.customerName ?? "General"}
                  </p>
                </div>
                <div className="hidden shrink-0 flex-col items-end gap-1 sm:flex">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />{formatDate(item.createdAt)}
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      <DocumentDetailSheet
        item={selected}
        onOpenChange={(o) => !o && setSelected(null)}
      />
    </>
  );
}
