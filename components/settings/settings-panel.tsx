"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Users, Package, MapPin, Plug, ClipboardList, Save, X, Pencil } from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/format";

const mockUsers = [
  { id: "u1", name: "Asad Khan", email: "asad@breezyair.com", role: "admin", active: true },
  { id: "u2", name: "Ravi T.", email: "ravi@breezyair.com", role: "technician", active: true },
  { id: "u3", name: "Priya M.", email: "priya@breezyair.com", role: "ops", active: true },
  { id: "u4", name: "Deepak S.", email: "deepak@breezyair.com", role: "finance", active: true },
];

const mockCatalog = [
  { id: "sc1", name: "AC Basic Service", segment: "b2c", price: 499, cost: 150, active: true, group: "Services" },
  { id: "sc2", name: "AC Full Service", segment: "b2c", price: 699, cost: 200, active: true, group: "Services" },
  { id: "sc3", name: "Wet Deep Clean", segment: "b2c", price: 899, cost: 280, active: true, group: "Services" },
  { id: "sc4", name: "AC Installation", segment: "b2c", price: 1499, cost: 450, active: true, group: "Services" },
  { id: "sc5", name: "AC Uninstallation", segment: "b2c", price: 699, cost: 200, active: true, group: "Services" },
  { id: "sc6", name: "Inspection Visit", segment: "b2c", price: 350, cost: 100, active: true, group: "Services" },
  { id: "sc7", name: "Gas top-up — 1 ton", segment: "b2c", price: 1200, cost: 400, active: true, group: "Add-ons & parts" },
  { id: "sc8", name: "Gas top-up — 1.5 ton", segment: "b2c", price: 1500, cost: 500, active: true, group: "Add-ons & parts" },
  { id: "sc9", name: "Gas top-up — 2 ton", segment: "b2c", price: 1800, cost: 600, active: true, group: "Add-ons & parts" },
  { id: "sc10", name: "Capacitor replacement", segment: "b2c", price: 749, cost: 250, active: true, group: "Add-ons & parts" },
  { id: "sc11", name: "Copper pipe (per metre)", segment: "b2c", price: 899, cost: 350, active: true, group: "Add-ons & parts" },
  { id: "sc12", name: "Drain pipe cleaning", segment: "b2c", price: 399, cost: 100, active: true, group: "Add-ons & parts" },
  { id: "sc13", name: "Emergency surcharge", segment: "b2c", price: 299, cost: 0, active: true, group: "Add-ons & parts" },
  { id: "sc14", name: "AMC — Chill Basic (2 visits/yr)", segment: "b2c", price: 1499, cost: 400, active: true, group: "AMC plans" },
  { id: "sc15", name: "AMC — Bengaluru Cool (3 visits/yr)", segment: "b2c", price: 2999, cost: 800, active: true, group: "AMC plans" },
  { id: "sc16", name: "AMC — Villa Plan (per AC/yr)", segment: "b2c", price: 1999, cost: 550, active: true, group: "AMC plans" },
  { id: "sc17", name: "VRF quarterly maintenance", segment: "b2b", price: 20000, cost: 6000, active: true, group: "B2B" },
];

const mockLocalities = [
  { id: "l1", name: "HSR Layout", active: true },
  { id: "l2", name: "Koramangala", active: true },
  { id: "l3", name: "Indiranagar", active: true },
  { id: "l4", name: "Whitefield", active: true },
  { id: "l5", name: "Bellandur", active: true },
];

const mockAudit = [
  { id: "a1", actor: "Asad Khan", action: "Created invoice BRZ-2026-005", entity: "invoice", time: "1h ago" },
  { id: "a2", actor: "Asad Khan", action: "Completed job j7 (Divya S.)", entity: "job", time: "2d ago" },
  { id: "a3", actor: "Asad Khan", action: "Qualified lead Meera N.", entity: "lead", time: "3d ago" },
  { id: "a4", actor: "Priya M.", action: "Updated service catalog pricing", entity: "catalog", time: "5d ago" },
  { id: "a5", actor: "Asad Khan", action: "Sent invoice BRZ-2026-003 to Anish M.", entity: "invoice", time: "5d ago" },
];

const roleVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  admin: "destructive",
  ops: "default",
  technician: "secondary",
  b2b_manager: "outline",
  finance: "outline",
  viewer: "secondary",
};

export function SettingsPanel() {
  const [catalogSearch, setCatalogSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [editCost, setEditCost] = useState("");

  const filteredCatalog = useMemo(() => {
    if (!catalogSearch) return mockCatalog;
    const q = catalogSearch.toLowerCase();
    return mockCatalog.filter((s) =>
      s.name.toLowerCase().includes(q) ||
      s.group.toLowerCase().includes(q)
    );
  }, [catalogSearch]);

  return (
    <Tabs defaultValue="catalog" className="w-full">
      <TabsList className="mb-4 w-full justify-start">
        <TabsTrigger value="catalog" className="gap-1.5"><Package className="h-3.5 w-3.5" />Catalog</TabsTrigger>
        <TabsTrigger value="users" className="gap-1.5"><Users className="h-3.5 w-3.5" />Users</TabsTrigger>
        <TabsTrigger value="localities" className="gap-1.5"><MapPin className="h-3.5 w-3.5" />Localities</TabsTrigger>
        <TabsTrigger value="integrations" className="gap-1.5"><Plug className="h-3.5 w-3.5" />Integrations</TabsTrigger>
        <TabsTrigger value="audit" className="gap-1.5"><ClipboardList className="h-3.5 w-3.5" />Audit</TabsTrigger>
      </TabsList>

      <TabsContent value="catalog">
        <Card className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium">Service catalog</h3>
              <p className="text-xs text-muted-foreground">Manage services, pricing, and cost margins.</p>
            </div>
            <Button size="sm" onClick={() => toast.success("Catalog saved.")}>
              <Save className="mr-1.5 h-3.5 w-3.5" />Save
            </Button>
          </div>
          <div className="mb-3">
            <Input
              placeholder="Search services..."
              value={catalogSearch}
              onChange={(e) => setCatalogSearch(e.target.value)}
              className="max-w-xs"
            />
          </div>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-secondary/40 text-left text-xs uppercase text-muted-foreground">
                  <th className="px-3 py-2 font-medium">Service</th>
                  <th className="px-3 py-2 font-medium">Group</th>
                  <th className="px-3 py-2 font-medium text-right">Price</th>
                  <th className="px-3 py-2 font-medium text-right">Cost</th>
                  <th className="px-3 py-2 font-medium text-right">Margin</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredCatalog.map((s) => {
                  const isEditing = editingId === s.id;
                  const currentPrice = isEditing ? Number(editPrice) || 0 : s.price;
                  const currentCost = isEditing ? Number(editCost) || 0 : s.cost;
                  const margin = currentPrice > 0 ? Math.round(((currentPrice - currentCost) / currentPrice) * 100) : 0;
                  return (
                    <tr key={s.id} className={isEditing ? "bg-secondary/20" : ""}>
                      <td className="px-3 py-2 font-medium">{s.name}</td>
                      <td className="px-3 py-2">
                        <Badge variant="outline" className="text-[10px]">{s.group}</Badge>
                      </td>
                      <td className="px-3 py-2 text-right">
                        {isEditing ? (
                          <Input
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            className="h-7 w-24 text-right text-xs"
                          />
                        ) : (
                          formatCurrency(s.price)
                        )}
                      </td>
                      <td className="px-3 py-2 text-right text-muted-foreground">
                        {isEditing ? (
                          <Input
                            type="number"
                            value={editCost}
                            onChange={(e) => setEditCost(e.target.value)}
                            className="h-7 w-24 text-right text-xs"
                          />
                        ) : (
                          formatCurrency(s.cost)
                        )}
                      </td>
                      <td className="px-3 py-2 text-right font-medium text-primary">
                        {margin}%
                      </td>
                      <td className="px-3 py-2">
                        <Badge variant={s.active ? "default" : "secondary"} className="text-[10px]">
                          {s.active ? "Active" : "Retired"}
                        </Badge>
                      </td>
                      <td className="px-3 py-2">
                        {isEditing ? (
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2 text-xs"
                              onClick={() => {
                                toast.success(`Updated pricing for ${s.name}.`);
                                setEditingId(null);
                              }}
                            >
                              <Save className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2 text-xs text-muted-foreground"
                              onClick={() => setEditingId(null)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2 text-xs"
                            onClick={() => {
                              setEditingId(s.id);
                              setEditPrice(String(s.price));
                              setEditCost(String(s.cost));
                            }}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="users">
        <Card className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium">Team members</h3>
              <p className="text-xs text-muted-foreground">Invite, assign roles, activate or deactivate.</p>
            </div>
            <Button size="sm" onClick={() => toast("Invite flow coming soon.")}>Invite user</Button>
          </div>
          <ul className="divide-y rounded-lg border">
            {mockUsers.map((u) => (
              <li key={u.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{u.name}</span>
                    <Badge variant={roleVariant[u.role]} className="text-[10px]">{u.role}</Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">{u.email}</span>
                </div>
                <Badge variant={u.active ? "default" : "secondary"} className="text-[10px]">
                  {u.active ? "Active" : "Inactive"}
                </Badge>
              </li>
            ))}
          </ul>
        </Card>
      </TabsContent>

      <TabsContent value="localities">
        <Card className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium">Service areas</h3>
              <p className="text-xs text-muted-foreground">The 5 localities Breezyair covers.</p>
            </div>
            <Button size="sm" onClick={() => toast("Add locality coming soon.")}>Add locality</Button>
          </div>
          <ul className="divide-y rounded-lg border">
            {mockLocalities.map((l) => (
              <li key={l.id} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{l.name}</span>
                </div>
                <Badge variant={l.active ? "default" : "secondary"} className="text-[10px]">
                  {l.active ? "Active" : "Inactive"}
                </Badge>
              </li>
            ))}
          </ul>
        </Card>
      </TabsContent>

      <TabsContent value="integrations">
        <Card className="p-4">
          <h3 className="mb-4 text-sm font-medium">Integrations</h3>
          <div className="space-y-3">
            <IntegrationRow name="Supabase" desc="Database, auth, storage" status="connected" />
            <IntegrationRow name="AiSensy" desc="WhatsApp Business API" status="not_configured" />
            <IntegrationRow name="Razorpay" desc="Payment gateway" status="not_configured" />
            <IntegrationRow name="Resend" desc="Transactional email" status="not_configured" />
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="audit">
        <Card className="p-4">
          <h3 className="mb-4 text-sm font-medium">Activity log</h3>
          <ul className="divide-y rounded-lg border">
            {mockAudit.map((a) => (
              <li key={a.id} className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm"><span className="font-medium">{a.actor}</span> {a.action}</span>
                  <span className="text-xs text-muted-foreground">{a.time}</span>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

function IntegrationRow({ name, desc, status }: { name: string; desc: string; status: "connected" | "not_configured" }) {
  return (
    <div className="flex items-center justify-between rounded-lg border px-4 py-3">
      <div>
        <div className="text-sm font-medium">{name}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
      <Badge variant={status === "connected" ? "default" : "secondary"} className="text-[10px]">
        {status === "connected" ? "Connected" : "Not configured"}
      </Badge>
    </div>
  );
}
