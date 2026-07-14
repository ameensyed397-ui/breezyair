"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Inbox, LayoutDashboard, Users, Calendar, Wrench, FileText, Settings, Wind, Kanban, Menu, X, FolderOpen } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { mockLeads } from "@/lib/db/mock";

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/leads", label: "Leads", icon: Inbox, getBadge: () => mockLeads.filter(l => l.status === "new").length || undefined },
  { href: "/pipeline", label: "Pipeline", icon: Kanban },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/schedule", label: "Schedule", icon: Calendar },
  { href: "/jobs", label: "Jobs", icon: Wrench },
  { href: "/invoices", label: "Invoices", icon: FileText },
  { href: "/documents", label: "Documents", icon: FolderOpen },
  { href: "/settings", label: "Settings", icon: Settings },
];

function NavLink({ href, label, icon: Icon, badge, active, onClick }: {
  href: string; label: string; icon: React.ComponentType<{ className?: string }>;
  badge?: number; active: boolean; onClick?: () => void;
}) {
  return (
    <Link href={href} onClick={onClick}
      className={`flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors ${
        active ? "bg-secondary text-foreground font-medium" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      }`}>
      <span className="flex items-center gap-3"><Icon className="h-4 w-4" />{label}</span>
      {badge && badge > 0 && <span className="rounded-full bg-primary px-2 text-xs font-medium text-primary-foreground">{badge}</span>}
    </Link>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r bg-card px-3 py-4 md:flex">
        <div className="mb-6 flex items-center gap-2 px-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Wind className="h-5 w-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight">Breezy<span className="text-primary">air</span></span>
        </div>
        <nav className="flex flex-col gap-1">
          {nav.map(({ href, label, icon, getBadge }) => (
            <NavLink key={href} href={href} label={label} icon={icon} badge={getBadge?.()} active={pathname === href} />
          ))}
        </nav>
        <div className="mt-auto px-3 text-xs text-muted-foreground">Asad Khan · Admin</div>
      </aside>

      {/* Mobile top bar + drawer */}
      <div className="flex flex-1 flex-col md:hidden">
        <header className="flex h-14 items-center border-b bg-card px-4">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open navigation menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-60 p-3">
              <div className="mb-6 flex items-center gap-2 px-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Wind className="h-5 w-5" />
                </span>
                <span className="text-lg font-semibold tracking-tight">Breezy<span className="text-primary">air</span></span>
              </div>
              <nav className="flex flex-col gap-1">
                {nav.map(({ href, label, icon, getBadge }) => (
                  <NavLink key={href} href={href} label={label} icon={icon} badge={getBadge?.()} active={pathname === href} onClick={() => setOpen(false)} />
                ))}
              </nav>
              <div className="mt-auto px-3 text-xs text-muted-foreground">Asad Khan · Admin</div>
            </SheetContent>
          </Sheet>
          <span className="ml-2 text-lg font-semibold tracking-tight">Breezy<span className="text-primary">air</span></span>
        </header>
        <main className="flex-1 bg-background">{children}</main>
      </div>

      {/* Desktop main */}
      <main className="hidden flex-1 bg-background md:block">{children}</main>
    </div>
  );
}
