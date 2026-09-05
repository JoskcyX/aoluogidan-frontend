import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/api";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata = { title: "Our Team" };

export default async function TeamPage() {
  const { lawyers: team } = await api.getLawyers().catch(() => ({ lawyers: [] }));

  return (
    <>
      <section className="border-b border-line bg-surface py-20">
        <Container>
          <SectionHeading eyebrow="Our Team" title="Legal Professionals" description="Meet the lawyers behind our firm's work." />
        </Container>
      </section>

      <Container className="py-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((lawyer: any) => (
            <Link key={lawyer.id} href={`/team/${lawyer.slug}`} className="group">
              <div className="aspect-[4/5] overflow-hidden bg-surface">
                {lawyer.photoUrl ? (
                  <Image
                    src={lawyer.photoUrl}
                    alt={lawyer.name}
                    width={400}
                    height={500}
                    unoptimized
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate">
                    No photo
                  </div>
                )}
              </div>
              <h3 className="mt-4 font-display text-lg text-ink">{lawyer.name}</h3>
              <p className="text-sm text-brass-deep">{lawyer.position}</p>
            </Link>
          ))}
        </div>
      </Container>
    </>
  );
}
