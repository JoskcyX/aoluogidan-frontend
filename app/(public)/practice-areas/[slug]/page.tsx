import Link from "next/link";
import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/layout/page-hero";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { area } = await api.getPracticeArea(params.slug).catch(() => ({ area: null }));
  if (!area) return {};
  const description = area.seoDescription ?? area.shortDescription;
  return {
    title: area.seoTitle ?? area.name,
    description,
    openGraph: {
      title: area.seoTitle ?? area.name,
      description,
      images: area.imageUrl ? [{ url: area.imageUrl }] : undefined,
    },
  };
}

export default async function PracticeAreaDetailPage({ params }: { params: { slug: string } }) {
  const [
    { area, services = [], relatedLawyers = [], relatedFaqs = [] },
    { settings },
  ] = await Promise.all([
    api
      .getPracticeArea(params.slug)
      .catch(() => ({ area: null, services: [], relatedLawyers: [], relatedFaqs: [] })),
    api.getSiteSettings().catch(() => ({ settings: null })),
  ]);

  if (!area) notFound();

  return (
    <>
      <PageHero
        eyebrow="Practice Area"
        title={area.name}
        description={area.shortDescription}
        image={area.imageUrl ?? settings?.heroImageUrl}
      />

      <Container className="grid gap-16 py-20 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {area.fullDescription && (
            <p className="mb-10 max-w-2xl leading-relaxed text-slate">{area.fullDescription}</p>
          )}

          {services.length > 0 && (
            <>
              <h2 className="font-display text-2xl text-ink">Our Services</h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {services.map((s: any) => (
                  <li key={s.id} className="rounded-xl border border-line px-5 py-4 text-sm text-ink">
                    {s.name}
                  </li>
                ))}
              </ul>
            </>
          )}

          {relatedFaqs.length > 0 && (
            <div className="mt-16">
              <h2 className="font-display text-2xl text-ink">Frequently Asked Questions</h2>
              <div className="mt-6 divide-y divide-line border-y border-line">
                {relatedFaqs.map((f: any) => (
                  <details key={f.id} className="group py-4">
                    <summary className="cursor-pointer list-none font-medium text-ink">{f.question}</summary>
                    <div
                      className="prose-legal mt-2 max-w-none text-sm text-slate [&_p]:mb-2 last:[&_p]:mb-0"
                      dangerouslySetInnerHTML={{ __html: f.answer }}
                    />
                  </details>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-8">
          {relatedLawyers.length > 0 && (
            <div className="rounded-2xl border border-line p-6">
              <h3 className="font-display text-lg text-ink">Related Lawyers</h3>
              <ul className="mt-4 space-y-4">
                {relatedLawyers.map((l: any) => (
                  <li key={l.id}>
                    <Link href={`/team/${l.slug}`} className="text-sm font-medium text-ink hover:text-brass-deep">
                      {l.name}
                    </Link>
                    <p className="text-xs text-slate">{l.position}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-2xl border border-line bg-surface p-6 text-center">
            <p className="font-display text-lg text-ink">Speak With Our {area.name.split(" ")[0]} Team</p>
            <Link href="/consultation" className="mt-4 block">
              <Button className="w-full">Request a Consultation</Button>
            </Link>
          </div>
        </aside>
      </Container>
    </>
  );
}
