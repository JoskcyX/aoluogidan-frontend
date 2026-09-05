import Link from "next/link";
import { api } from "@/lib/api";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata = { title: "About Us" };

export default async function AboutPage() {
  const { about, values = [] } = await api.getAboutContent().catch(() => ({ about: null, values: [] }));

  if (!about) return null;

  return (
    <>
      <section className="border-b border-line bg-surface py-20">
        <Container>
          <SectionHeading eyebrow="About Us" title={about.introHeading} description={about.introText ?? undefined} />
        </Container>
      </section>

      <Container className="grid gap-16 py-20 lg:grid-cols-3">
        <div className="space-y-12 lg:col-span-2">
          {about.historyText && (
            <div>
              <h2 className="font-display text-2xl text-ink">Our History</h2>
              <p className="mt-3 leading-relaxed text-slate">{about.historyText}</p>
            </div>
          )}
          {about.missionText && (
            <div>
              <h2 className="font-display text-2xl text-ink">Mission</h2>
              <p className="mt-3 leading-relaxed text-slate">{about.missionText}</p>
            </div>
          )}
          {about.visionText && (
            <div>
              <h2 className="font-display text-2xl text-ink">Vision</h2>
              <p className="mt-3 leading-relaxed text-slate">{about.visionText}</p>
            </div>
          )}
          {about.approachText && (
            <div>
              <h2 className="font-display text-2xl text-ink">Our Approach</h2>
              <p className="mt-3 leading-relaxed text-slate">{about.approachText}</p>
            </div>
          )}
          {about.whyClientsText && (
            <div>
              <h2 className="font-display text-2xl text-ink">Why Clients Choose Us</h2>
              <p className="mt-3 leading-relaxed text-slate">{about.whyClientsText}</p>
            </div>
          )}
        </div>

        <aside>
          <div className="border border-line p-8">
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
              <Button className="w-full">{about.ctaText}</Button>
            </Link>
          </div>
        </aside>
      </Container>
    </>
  );
}
