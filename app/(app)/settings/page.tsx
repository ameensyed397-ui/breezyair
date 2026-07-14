import { SettingsPanel } from "@/components/settings/settings-panel";

export const dynamic = "force-dynamic";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Users, catalog, localities, integrations, and audit trail.
        </p>
      </header>
      <SettingsPanel />
    </div>
  );
}
