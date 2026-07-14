"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { FileText, Image, BookOpen, Calendar, Download, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/format";

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
};

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
    case "sop": return <BookOpen className="h-4 w-4" />;
    case "photo": return <Image className="h-4 w-4" />;
    default: return <FileText className="h-4 w-4" />;
  }
}

export function DocumentDetailSheet({
  item,
  onOpenChange,
}: {
  item: CombinedItem | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet open={!!item} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        {item && (
          <>
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                {iconFor(item.type)}
                <span className="truncate">{item.name}</span>
                <Badge variant={typeVariant[item.type] ?? "secondary"} className="text-[10px]">
                  {item.type}
                </Badge>
                {item.category && (
                  <Badge variant="outline" className="text-[10px]">{item.category}</Badge>
                )}
              </SheetTitle>
              <SheetDescription>{item.customerName ?? "General document"}</SheetDescription>
            </SheetHeader>

            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-3">
                <InfoCard icon={FileText} label="Type" value={item.type} />
                <InfoCard icon={Calendar} label="Created" value={formatDate(item.createdAt)} />
                <InfoCard icon={Calendar} label="Updated" value={formatDate(item.updatedAt)} />
                {item.category && (
                  <InfoCard icon={Image} label="Category" value={item.category} />
                )}
              </div>

              {item.storagePath && (
                <div>
                  <div className="mb-1 text-xs font-medium uppercase text-muted-foreground">Storage</div>
                  <p className="rounded-md bg-secondary/60 p-3 text-xs text-muted-foreground">File stored securely</p>
                </div>
              )}

              <div className="flex gap-2">
                <Button className="flex-1" onClick={() => toast.success("Download started — this is a demo.")}>
                  <Download className="mr-2 h-4 w-4" /> Download
                </Button>
                <Button variant="ghost" className="text-muted-foreground" onClick={() => toast("Document deleted — this is a demo.")}>
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function InfoCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="rounded-md bg-secondary/40 p-3">
      <div className="mb-1 flex items-center gap-1.5 text-xs font-medium uppercase text-muted-foreground">
        <Icon className="h-3 w-3" />{label}
      </div>
      <div className="truncate text-sm">{value}</div>
    </div>
  );
}
