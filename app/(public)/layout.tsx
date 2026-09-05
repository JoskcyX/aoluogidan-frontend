import { api } from "@/lib/api";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

// Content is served live from the backend on every request, so a page
// published from the admin dashboard shows up immediately here. If you
// later want the performance benefit of static generation for a
// high-traffic page, switch that page to `export const revalidate = <n>`
// instead so it revalidates on a timer rather than staying dynamic forever.
export const dynamic = "force-dynamic";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [{ settings }, { practiceAreas: areas }] = await Promise.all([
    api.getSiteSettings().catch(() => ({ settings: null })),
    api.getPracticeAreas().catch(() => ({ practiceAreas: [] })),
  ]);

  return (
    <>
      <SiteHeader firmName={settings?.firmName ?? "Law Firm"} logoUrl={settings?.logoUrl} />
      <main>{children}</main>
      {settings && <SiteFooter settings={settings} practiceAreas={areas} />}
    </>
  );
}
