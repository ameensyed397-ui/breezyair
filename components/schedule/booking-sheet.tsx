"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type { MockAppointment, MockCustomer, MockTechnician } from "@/lib/db/mock";

export function BookingSheet({
  open,
  onOpenChange,
  date,
  customers,
  technicians,
  existing,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  date: Date;
  customers: MockCustomer[];
  technicians: MockTechnician[];
  existing: MockAppointment[];
  onCreate: (appt: MockAppointment) => void;
}) {
  const [customerId, setCustomerId] = useState<string>("");
  const [technicianId, setTechnicianId] = useState<string>(technicians[0]?.id ?? "");
  const [service, setService] = useState("");
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("11:00");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function reset() {
    setCustomerId("");
    setService("");
    setStartTime("10:00");
    setEndTime("11:00");
    setErrors({});
  }

  function toDateTime(time: string) {
    const [h, m] = time.split(":").map(Number);
    const d = new Date(date);
    d.setHours(h, m, 0, 0);
    return d;
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!customerId) errs.customer = "Please select a customer.";
    if (!service.trim()) errs.service = "Please enter a service.";
    if (!/^\d{2}:\d{2}$/.test(startTime)) errs.startTime = "Invalid time format (HH:MM).";
    if (!/^\d{2}:\d{2}$/.test(endTime)) errs.endTime = "Invalid time format (HH:MM).";
    const startAt = toDateTime(startTime);
    const endAt = toDateTime(endTime);
    if (!errs.startTime && !errs.endTime && endAt <= startAt) errs.endTime = "End time must be after start time.";
    const conflict = existing.find(
      (a) =>
        a.technicianId === technicianId &&
        a.status !== "cancelled" &&
        new Date(a.startAt) < endAt &&
        new Date(a.endAt) > startAt
    );
    if (conflict) {
      errs.conflict = `Conflict: ${conflict.technicianName ?? "This technician"} is already booked ${new Date(
        conflict.startAt
      ).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}–${new Date(
        conflict.endAt
      ).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} for ${conflict.customerName}.`;
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;

    setSubmitting(true);

    const startAt = toDateTime(startTime);
    const endAt = toDateTime(endTime);
    const customer = customers.find((c) => c.id === customerId);
    const technician = technicians.find((t) => t.id === technicianId);

    onCreate({
      id: `local-${Date.now()}`,
      jobId: null,
      customerId,
      siteId: customer?.sites?.[0]?.id ?? null,
      technicianId,
      localityId: null,
      serviceName: service.trim(),
      startAt,
      endAt,
      status: "scheduled",
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      customerName: customer?.name ?? "Unknown",
      locality: customer?.locality,
      technicianName: technician?.fullName,
    });
    toast.success("Appointment booked.");
    reset();
    setSubmitting(false);
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>New appointment</SheetTitle>
          <SheetDescription>
            {date.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-1.5">
            <Label>Customer</Label>
            <Select value={customerId} onValueChange={(v) => { setCustomerId(v); setErrors((e) => { const { customer, ...rest } = e; return rest; }); }}>
              <SelectTrigger className="w-full" aria-invalid={!!errors.customer}>
                <SelectValue placeholder="Select a customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name} {c.locality ? `— ${c.locality}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.customer && <p className="text-xs text-destructive">{errors.customer}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Service</Label>
            <Input
              placeholder="e.g. AC gas top-up"
              value={service}
              onChange={(e) => { setService(e.target.value); setErrors((er) => { const { service: _, ...rest } = er; return rest; }); }}
              aria-invalid={!!errors.service}
            />
            {errors.service && <p className="text-xs text-destructive">{errors.service}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Technician</Label>
            <Select value={technicianId} onValueChange={setTechnicianId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a technician" />
              </SelectTrigger>
              <SelectContent>
                {technicians.map((t) => (
                  <SelectItem key={t.id} value={t.id}>{t.fullName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Start time</Label>
              <Input type="time" value={startTime} onChange={(e) => { setStartTime(e.target.value); setErrors((er) => { const { startTime: _, ...rest } = er; return rest; }); }} aria-invalid={!!errors.startTime} />
              {errors.startTime && <p className="text-xs text-destructive">{errors.startTime}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>End time</Label>
              <Input type="time" value={endTime} onChange={(e) => { setEndTime(e.target.value); setErrors((er) => { const { endTime: _, ...rest } = er; return rest; }); }} aria-invalid={!!errors.endTime} />
              {errors.endTime && <p className="text-xs text-destructive">{errors.endTime}</p>}
            </div>
          </div>

          {errors.conflict && <p className="text-xs text-destructive">{errors.conflict}</p>}
        </div>

        <SheetFooter>
          <Button className="w-full" disabled={submitting} onClick={handleSubmit}>
            {submitting ? "Booking…" : "Book appointment"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
