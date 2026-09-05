import Link from "next/link";
import { api } from "@/lib/api";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/layout/page-hero";
import { Reveal } from "@/components/ui/reveal";

export const metadata = { title: "About Us" };

export default async function AboutPage() {
  const [{ about, values = [] }, { settings }] = await Promise.all([
    api.getAboutContent().catch(() => ({ about: null, values: [] })),
    api.getSiteSettings().catch(() => ({ settings: null })),
  ]);

  if (!about) return null;

  return (
    <>
      {/* `about.heroImageUrl` will be used automatically once your CMS exposes
          an image field for this page; until then it falls back to the hero
          photo already set in Site Settings. */}
      <PageHero
        eyebrow="About Us"
        title={about.introHeading}
        description={about.introText ?? undefined}
        image={about.heroImageUrl ?? settings?.heroImageUrl}
      />

      <Container className="grid gap-16 py-20 lg:grid-cols-3">
        <div className="space-y-12 lg:col-span-2">
          {[
            ["Our History", about.historyText],
            ["Mission", about.missionText],
            ["Vision", about.visionText],
            ["Our Approach", about.approachText],
            ["Why Clients Choose Us", about.whyClientsText],
          ].map(([heading, text], i) =>
            text ? (
              <Reveal key={heading} delay={i * 60}>
                <h2 className="font-display text-2xl text-ink">{heading}</h2>
                <p className="mt-3 leading-relaxed text-slate">{text}</p>
              </Reveal>
            ) : null
          )}
        </div>

        <Reveal delay={120}>
          <aside className="border border-line p-8 transition-shadow duration-300 hover:shadow-lg">
            <h3 className="font-display text-xl text-ink">Core Values</h3>
            <ul className="mt-5 space-y-5">
              {values.map((v: any) => (
                <li key={v.id}>
                  <p className="font-medium text-ink">{v.title}</p>
                  <p className="mt-1 text-sm text-slate">{v.description}</p>
                </li>
              ))}
            </ul>
            <Link href={about.ctaLink} className="mt-8 block">
              <Button className="w-full transition-transform duration-200 hover:scale-[1.02]">{about.ctaText}</Button>
            </Link>
          </aside>
        </Reveal>
      </Container>
    </>
  );
}
