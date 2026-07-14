"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import type { MockAppointment } from "@/lib/db/mock";

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  scheduled: "default",
  rescheduled: "secondary",
  done: "secondary",
  no_show: "destructive",
  cancelled: "outline",
};

function initials(name?: string) {
  if (!name) return "?";
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

function timeRange(start: Date, end: Date) {
  const fmt = (d: Date) => new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  return `${fmt(start)} – ${fmt(end)}`;
}

export function DayView({ appointments, loading }: { appointments: MockAppointment[]; loading: boolean }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="rounded-lg border border-dashed py-16 text-center text-sm text-muted-foreground">
        No appointments today.
      </div>
    );
  }

  const sorted = [...appointments].sort(
    (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
  );

  const dayStart = new Date(now);
  dayStart.setHours(8, 0, 0, 0);
  const dayEnd = new Date(now);
  dayEnd.setHours(20, 0, 0, 0);
  const totalMs = dayEnd.getTime() - dayStart.getTime();
  const nowMs = now.getTime() - dayStart.getTime();
  const progress = Math.max(0, Math.min(1, nowMs / totalMs));
  const showIndicator = nowMs >= 0 && nowMs <= totalMs;

  return (
    <div className="relative">
      {showIndicator && (
        <div
          className="pointer-events-none absolute left-0 right-0 z-10 border-t-2 border-red-500"
          style={{ top: `${progress * 100}%` }}
          aria-hidden="true"
        >
          <span className="absolute -top-1.5 left-0 h-3 w-3 rounded-full bg-red-500" />
        </div>
      )}
      <ul className="space-y-2">
        {sorted.map((a) => (
          <li key={a.id}>
            <Card className="flex items-center gap-4 p-3">
              <div className="w-28 shrink-0 text-xs font-medium text-muted-foreground">
                {timeRange(a.startAt, a.endAt)}
              </div>
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="text-xs">{initials(a.technicianName)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-medium">{a.customerName}</span>
                  <Badge variant={statusVariant[a.status] ?? "default"} className="text-[10px]">
                    {a.status.replaceAll("_", " ")}
                  </Badge>
                </div>
                <p className="truncate text-xs text-muted-foreground">{a.serviceName}</p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">{a.locality ?? "—"}</span>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
