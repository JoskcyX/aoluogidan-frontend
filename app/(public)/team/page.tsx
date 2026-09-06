import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/api";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/layout/page-hero";
import { Reveal } from "@/components/ui/reveal";

export const metadata = { title: "Our Team" };

export default async function TeamPage() {
  const [{ lawyers: team }, { settings }, { pageHeroes }] = await Promise.all([
    api.getLawyers().catch(() => ({ lawyers: [] })),
    api.getSiteSettings().catch(() => ({ settings: null })),
    api.getPageHeroes().catch(() => ({ pageHeroes: {} })),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Our Team"
        title="Legal Professionals"
        description="Meet the lawyers behind our firm's work."
        image={pageHeroes?.team ?? settings?.heroImageUrl ?? "/law-firm-bg.jpg"}
      />

      {/* Team Section */}
      <Container className="py-20">
        <div className="flex flex-wrap justify-center gap-6">
          {team.map((lawyer: any, i: number) => (
            <Reveal key={lawyer.id} delay={i * 60} className="w-32 sm:w-36">
              <Link href={`/team/${lawyer.slug}`} className="group block">
                <div className="aspect-square overflow-hidden rounded-2xl bg-surface shadow-sm transition-shadow duration-300 group-hover:shadow-lg">
                  {lawyer.photoUrl ? (
                    <Image
                      src={lawyer.photoUrl}
                      alt={lawyer.name}
                      width={144}
                      height={144}
                      unoptimized
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-slate">
                      No photo
                    </div>
                  )}
                </div>

                <h3 className="mt-3 text-center font-display text-sm text-ink transition-colors group-hover:text-brass-deep">
                  {lawyer.name}
                </h3>

                <p className="text-center text-xs text-brass-deep">
                  {lawyer.position}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </>
  );
}
