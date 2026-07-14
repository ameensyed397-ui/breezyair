"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Wrench, MapPin, User, Calendar, Shield, CheckCircle, XCircle, Camera } from "lucide-react";
import { toast } from "sonner";
import type { MockJob } from "@/lib/db/mock";
import { formatDate } from "@/lib/format";

function formatTime(d?: Date | null) {
  if (!d) return "";
  return new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  scheduled: "outline",
  dispatched: "secondary",
  in_progress: "default",
  completed: "default",
  cancelled: "destructive",
};

export function JobDetailSheet({
  job,
  onOpenChange,
}: {
  job: MockJob | null;
  onOpenChange: (open: boolean) => void;
}) {
  const [jobStatus, setJobStatus] = useState<MockJob["status"] | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const effectiveStatus = jobStatus ?? job?.status ?? "scheduled";

  return (
    <Sheet open={!!job} onOpenChange={(open) => {
      if (!open) { setJobStatus(null); setIsUpdating(false); }
      onOpenChange(open);
    }}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        {job && (
          <>
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-muted-foreground" />
                {job.customerName}
                <Badge variant={statusVariant[effectiveStatus]} className="text-[10px]">
                  {effectiveStatus.replace(/_/g, " ")}
                </Badge>
              </SheetTitle>
              <SheetDescription>{job.serviceName}</SheetDescription>
            </SheetHeader>

            <Tabs defaultValue="overview" className="mt-4">
              <TabsList className="w-full">
                <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
                <TabsTrigger value="checklist" className="flex-1">Checklist</TabsTrigger>
                <TabsTrigger value="photos" className="flex-1">Photos</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-3">
                  <InfoCard icon={Calendar} label="Scheduled" value={`${formatDate(job.scheduledAt)} ${formatTime(job.scheduledAt)}`} />
                  <InfoCard icon={MapPin} label="Site" value={job.siteAddress ?? "—"} />
                  <InfoCard icon={User} label="Technician" value={job.technicianName ?? "—"} />
                  {job.warrantyUntil && (
                    <InfoCard icon={Shield} label="Warranty until" value={formatDate(job.warrantyUntil)} />
                  )}
                </div>
                {job.summary && (
                  <div>
                    <div className="mb-1 text-xs font-medium uppercase text-muted-foreground">Summary</div>
                    <p className="rounded-md bg-secondary/60 p-3 text-sm">{job.summary}</p>
                  </div>
                )}
                {(effectiveStatus === "scheduled" || effectiveStatus === "dispatched") && (
                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      disabled={isUpdating}
                      onClick={() => {
                        setIsUpdating(true);
                        setTimeout(() => {
                          setJobStatus("in_progress");
                          setIsUpdating(false);
                          toast.success("Job started — technician en route.");
                        }, 500);
                      }}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" /> Start job
                    </Button>
                    <Button variant="ghost" className="text-muted-foreground" onClick={() => toast("Job cancelled.")}>
                      <XCircle className="mr-2 h-4 w-4" /> Cancel
                    </Button>
                  </div>
                )}
                {effectiveStatus === "in_progress" && (
                  <Button
                    className="w-full"
                    disabled={isUpdating}
                    onClick={() => {
                      setIsUpdating(true);
                      setTimeout(() => {
                        setJobStatus("completed");
                        setIsUpdating(false);
                        toast.success("Job completed — draft invoice created.");
                      }, 500);
                    }}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" /> Mark complete
                  </Button>
                )}
              </TabsContent>

              <TabsContent value="checklist" className="pt-4">
                <div className="rounded-lg border border-dashed py-10 text-center text-sm text-muted-foreground">
                  No checklist items yet. Checklist templates coming soon.
                </div>
              </TabsContent>

              <TabsContent value="photos" className="pt-4">
                <div className="rounded-lg border border-dashed py-10 text-center text-sm text-muted-foreground">
                  <Camera className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
                  No photos yet. Photos are captured during the job visit.
                </div>
              </TabsContent>
            </Tabs>
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
