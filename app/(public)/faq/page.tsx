import { api } from "@/lib/api";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/layout/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { ChevronDown } from "lucide-react";

export const metadata = {
  title: "Frequently Asked Questions",
  description: "Answers to common questions about working with our firm, our practice areas, and what to expect from a consultation.",
};

export default async function FaqPage() {
  const [{ faqs: allFaqs = [] }, { settings }, { pageHeroes }] = await Promise.all([
    api.getFaqs().catch(() => ({ faqs: [] })),
    api.getSiteSettings().catch(() => ({ settings: null })),
    api.getPageHeroes().catch(() => ({ pageHeroes: {} })),
  ]);

  const grouped = (allFaqs as any[]).reduce<Record<string, any[]>>((acc, f) => {
    const key = f.category ?? "General";
    acc[key] = acc[key] ? [...acc[key], f] : [f];
    return acc;
  }, {});

  // FAQPage structured data so Google can show these as expandable rich
  // results directly in search, instead of a plain blue link.
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: (allFaqs as any[]).map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <>
      {allFaqs.length > 0 && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <PageHero
        eyebrow="FAQ"
        title="Frequently Asked Questions"
        description="Answers to common questions about working with our firm."
        image={pageHeroes?.faq ?? settings?.heroImageUrl}
      />

      <Container className="max-w-3xl py-20">
        {Object.entries(grouped).map(([category, items], gi) => (
          <Reveal key={category} delay={gi * 80} className="mb-12">
            <h2 className="font-display text-xl text-ink">{category}</h2>
            <div className="mt-4 divide-y divide-line border-y border-line">
              {items.map((f) => (
                <details key={f.id} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-ink marker:content-none">
                    {f.question}
                    <ChevronDown className="faq-chevron shrink-0 text-brass-deep" size={18} />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-slate">{f.answer}</p>
                </details>
              ))}
            </div>
          </Reveal>
        ))}
      </Container>
    </>
  );
}
