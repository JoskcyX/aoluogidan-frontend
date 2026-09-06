import { api } from "@/lib/api";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/layout/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { PracticeAreaCard } from "@/components/ui/practice-area-card";

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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((area: any, i: number) => (
            <Reveal key={area.id} delay={i * 60}>
              <PracticeAreaCard area={area} index={i} />
            </Reveal>
          ))}
        </div>
      </Container>
    </>
  );
}
