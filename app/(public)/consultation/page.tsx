import { api } from "@/lib/api";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/layout/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { ConsultationForm } from "./consultation-form";

export const metadata = {
  title: "Request a Consultation",
  description: "Book a consultation with one of our lawyers to discuss your legal matter.",
};

export default async function ConsultationPage() {
  const [{ settings }, { pageHeroes }] = await Promise.all([
    api.getSiteSettings().catch(() => ({ settings: null })),
    api.getPageHeroes().catch(() => ({ pageHeroes: {} })),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Get Started"
        title="Request a Consultation"
        description="Tell us a little about your situation and we'll get back to you to schedule a time to talk. Please don't include highly sensitive documents in this form — we'll set up a secure channel if needed."
        image={pageHeroes?.consultation ?? settings?.heroImageUrl}
      />

      <Container className="max-w-2xl py-20">
        <Reveal>
          <ConsultationForm />
        </Reveal>
      </Container>
    </>
  );
}
