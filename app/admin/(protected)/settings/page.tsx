import { adminFetchJson } from "@/lib/api";
import { Container } from "@/components/ui/container";
import { SettingsForm } from "./settings-form";

export default async function AdminSettingsPage() {
  const { settings } = await adminFetchJson("/api/admin/settings").catch(() => ({ settings: null }));

  return (
    <Container className="max-w-3xl px-0">
      <h1 className="font-display text-2xl text-ink">Website Settings</h1>
      <p className="mt-1 text-sm text-slate">Update your firm&apos;s contact details, homepage content, and SEO defaults.</p>
      <div className="mt-8">{settings && <SettingsForm settings={settings} />}</div>
    </Container>
  );
}
