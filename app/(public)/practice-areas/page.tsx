import Link from "next/link";
import { api } from "@/lib/api";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/layout/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { ArrowRight } from "lucide-react";

export const metadata = { title: "Practice Areas" };

export default async function PracticeAreasPage() {
  const [{ practiceAreas: areas }, { settings }, { pageHeroes }] = await Promise.all([
    api.getPracticeAreas().catch(() => ({ practiceAreas: [] })),
    api.getSiteSettings().catch(() => ({ settings: null })),
    api.getPageHeroes().catch(() => ({ pageHeroes: {} })),
  ]);

  return (
    <>
      <PageHero
        eyebrow="What We Do"
        title="Practice Areas"
        description="We advise businesses and individuals across the following areas of law."
        image={pageHeroes?.["practice-areas"] ?? settings?.heroImageUrl}
      />

      <Container className="py-20">
        <div className="grid gap-px overflow-hidden rounded border border-line bg-line sm:grid-cols-2">
          {areas.map((area: any, i: number) => (
            <Reveal key={area.id} delay={i * 60}>
              <Link
                href={`/practice-areas/${area.slug}`}
                className="group block h-full bg-white p-10 transition-all duration-300 hover:-translate-y-1 hover:bg-surface hover:shadow-lg"
              >
                <h2 className="font-display text-2xl text-ink">{area.name}</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate">{area.shortDescription}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-brass-deep transition-transform duration-300 group-hover:translate-x-1">
                  Learn more <ArrowRight size={14} />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </>
  );
}
