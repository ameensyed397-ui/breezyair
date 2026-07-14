import { mockLeads } from "@/lib/db/mock";
import { LeadInbox } from "@/components/leads/lead-inbox";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const leads = mockLeads;

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Lead inbox</h1>
        <p className="text-sm text-muted-foreground">
          Every lead, every channel, one queue. Work top-down by the SLA timer.
        </p>
      </header>
      <LeadInbox leads={leads as any} />
    </div>
  );
}
