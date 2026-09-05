import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/api";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/layout/page-hero";
import { Reveal } from "@/components/ui/reveal";

export const metadata = { title: "Our Team" };

export default async function TeamPage() {
  const [{ lawyers: team }, { settings }] = await Promise.all([
    api.getLawyers().catch(() => ({ lawyers: [] })),
    api.getSiteSettings().catch(() => ({ settings: null })),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Our Team"
        title="Legal Professionals"
        description="Meet the lawyers behind our firm's work."
        image={settings?.heroImageUrl ?? "/law-firm-bg.jpg"}
      />

      {/* Team Section */}
      <Container className="py-20">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:justify-items-center">
          {team.map((lawyer: any, i: number) => (
            <Reveal key={lawyer.id} delay={i * 60} className="w-full max-w-[260px]">
              <Link href={`/team/${lawyer.slug}`} className="group block">
                <div className="aspect-[4/5] overflow-hidden bg-surface">
                  {lawyer.photoUrl ? (
                    <Image
                      src={lawyer.photoUrl}
                      alt={lawyer.name}
                      width={320}
                      height={400}
                      unoptimized
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate">
                      No photo
                    </div>
                  )}
                </div>

                <h3 className="mt-4 font-display text-lg text-ink transition-colors group-hover:text-brass-deep">
                  {lawyer.name}
                </h3>

                <p className="text-sm text-brass-deep">
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