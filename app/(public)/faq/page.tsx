import { api } from "@/lib/api";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata = { title: "Frequently Asked Questions" };

export default async function FaqPage() {
  const { faqs: allFaqs = [] } = await api.getFaqs().catch(() => ({ faqs: [] }));

  const grouped = (allFaqs as any[]).reduce<Record<string, any[]>>((acc, f) => {
    const key = f.category ?? "General";
    acc[key] = acc[key] ? [...acc[key], f] : [f];
    return acc;
  }, {});

  return (
    <>
      <section className="border-b border-line bg-surface py-20">
        <Container>
          <SectionHeading eyebrow="FAQ" title="Frequently Asked Questions" description="Answers to common questions about working with our firm." />
        </Container>
      </section>

      <Container className="max-w-3xl py-20">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="mb-12">
            <h2 className="font-display text-xl text-ink">{category}</h2>
            <div className="mt-4 divide-y divide-line border-y border-line">
              {items.map((f) => (
                <details key={f.id} className="group py-5">
                  <summary className="cursor-pointer list-none font-medium text-ink marker:content-none">
                    {f.question}
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-slate">{f.answer}</p>
                </details>
              ))}
            </div>
          </div>
        ))}
      </Container>
    </>
  );
}
