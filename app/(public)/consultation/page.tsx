import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ConsultationForm } from "./consultation-form";

export const metadata = { title: "Request a Consultation" };

export default function ConsultationPage() {
  return (
    <>
      <section className="border-b border-line bg-surface py-20">
        <Container>
          <SectionHeading
            eyebrow="Get Started"
            title="Request a Consultation"
            description="Tell us a little about your situation and we'll get back to you to schedule a time to talk. Please don't include highly sensitive documents in this form — we'll set up a secure channel if needed."
          />
        </Container>
      </section>

      <Container className="max-w-2xl py-20">
        <ConsultationForm />
      </Container>
    </>
  );
}
