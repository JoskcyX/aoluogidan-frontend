import { api } from "@/lib/api";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

// Content is served live from the backend on every request, so a page
// published from the admin dashboard shows up immediately here. If you
// later want the performance benefit of static generation for a
// high-traffic page, switch that page to `export const revalidate = <n>`
// instead so it revalidates on a timer rather than staying dynamic forever.
export const dynamic = "force-dynamic";

const SITE_URL = process.env.SITE_URL ?? "https://your-site.netlify.app";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [{ settings }, { practiceAreas: areas }] = await Promise.all([
    api.getSiteSettings().catch(() => ({ settings: null })),
    api.getPracticeAreas().catch(() => ({ practiceAreas: [] })),
  ]);

  // LegalService structured data, built from your Settings page fields.
  // This is what lets Google understand you're a law firm with a real
  // address/phone rather than a generic website, and it's a prerequisite
  // for showing up richly in local/map results.
  const sameAs = [
    settings?.socialLinkedin,
    settings?.socialFacebook,
    settings?.socialInstagram,
    settings?.socialX,
    settings?.socialYoutube,
  ].filter(Boolean);

  const legalServiceSchema = settings
    ? {
        "@context": "https://schema.org",
        "@type": "LegalService",
        name: settings.firmName,
        url: SITE_URL,
        logo: settings.logoUrl ?? undefined,
        image: settings.logoUrl ?? undefined,
        description: settings.siteDescription ?? settings.description ?? undefined,
        telephone: settings.phone ?? undefined,
        email: settings.email ?? undefined,
        address: settings.address
          ? { "@type": "PostalAddress", streetAddress: settings.address }
          : undefined,
        sameAs: sameAs.length > 0 ? sameAs : undefined,
        areaServed: areas.map((a: any) => a.name),
      }
    : null;

  return (
    <>
      {legalServiceSchema && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(legalServiceSchema) }}
        />
      )}
      <SiteHeader firmName={settings?.firmName ?? "Law Firm"} logoUrl={settings?.logoUrl} />
      <main>{children}</main>
      {settings && <SiteFooter settings={settings} practiceAreas={areas} />}
    </>
  );
}
