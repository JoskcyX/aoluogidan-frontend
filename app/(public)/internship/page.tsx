import { api } from "@/lib/api";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/layout/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { InternshipForm } from "./internship-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Internship Programme",
  description:
    "Apply for the A. Olu Ogidan & Co. Internship Programme — practical legal exposure and mentorship for law students across our practice areas.",
  keywords: [
    "law internship Nigeria",
    "legal internship programme",
    "A. Olu Ogidan internship",
    "law firm internship application",
    "law student internship Nigeria",
  ],
  alternates: { canonical: "/internship" },
  openGraph: {
    title: "Internship Programme | A. Olu Ogidan & Co.",
    description:
      "Practical legal exposure and mentorship for law students, open year-round across our practice areas. Apply with your CV and Cover Letter.",
    url: "/internship",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Internship Programme | A. Olu Ogidan & Co.",
    description: "Apply for our year-round Internship Programme for law students.",
  },
};

export default async function InternshipPage() {
  const [{ settings }, { pageHeroes }] = await Promise.all([
    api.getSiteSettings().catch(() => ({ settings: null })),
    api.getPageHeroes().catch(() => ({ pageHeroes: {} })),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Internship Programme"
        image={pageHeroes?.internship ?? settings?.heroImageUrl}
      />

      <Container className="max-w-2xl py-20">
        <Reveal>
          <div className="space-y-5 text-sm leading-relaxed text-slate">
            <p>
              At A. Olu Ogidan & Co., we are committed to nurturing the next generation of legal
              professionals through meaningful practical exposure and mentorship. Our Internship
              Programme is open throughout the year to law students eager to learn and gain
              firsthand experience in a dynamic legal environment.
            </p>
            <p>
              Interns work closely with experienced lawyers across our practice areas, receiving
              guidance, constructive feedback, and practical insight through research, drafting,
              case analysis, and exposure to real-world legal matters.
            </p>
            <p>
              Interested applicants are invited to submit their CV and Cover Letter through our
              application portal.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100} className="mt-14">
          <InternshipForm />
        </Reveal>
      </Container>
    </>
  );
}
