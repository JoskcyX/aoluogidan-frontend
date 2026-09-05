import Link from "next/link";
import { api } from "@/lib/api";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ArrowRight } from "lucide-react";

export const metadata = { title: "Practice Areas" };

export default async function PracticeAreasPage() {
  const { practiceAreas: areas } = await api.getPracticeAreas().catch(() => ({ practiceAreas: [] }));

  return (
    <>
      <section className="border-b border-line bg-surface py-20">
        <Container>
          <SectionHeading
            eyebrow="What We Do"
            title="Practice Areas"
            description="We advise businesses and individuals across the following areas of law."
          />
        </Container>
      </section>

      <Container className="py-20">
        <div className="grid gap-px overflow-hidden rounded border border-line bg-line sm:grid-cols-2">
          {areas.map((area: any) => (
            <Link key={area.id} href={`/practice-areas/${area.slug}`} className="group bg-white p-10 hover:bg-surface">
              <h2 className="font-display text-2xl text-ink">{area.name}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate">{area.shortDescription}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-brass-deep">
                Learn more <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </>
  );
}
