import { api } from "@/lib/api";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ContactForm } from "./contact-form";

export const metadata = { title: "Contact Us" };

export default async function ContactPage() {
  const { settings } = await api.getSiteSettings().catch(() => ({ settings: null }));

  return (
    <>
      <section className="border-b border-line bg-surface py-20">
        <Container>
          <SectionHeading eyebrow="Get in Touch" title="Contact Us" />
        </Container>
      </section>

      <Container className="grid gap-16 py-20 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <h2 className="font-display text-xl text-ink">Office</h2>
          {settings?.address && <p className="mt-2 whitespace-pre-line text-sm text-slate">{settings.address}</p>}

          <div className="mt-6 space-y-2 text-sm">
            {settings?.phone && <p><a href={`tel:${settings.phone}`} className="text-ink hover:text-brass-deep">{settings.phone}</a></p>}
            {settings?.email && <p><a href={`mailto:${settings.email}`} className="text-ink hover:text-brass-deep">{settings.email}</a></p>}
            {settings?.whatsapp && <p><a href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}`} className="text-ink hover:text-brass-deep">WhatsApp: {settings.whatsapp}</a></p>}
          </div>

          {settings?.workingHours && (
            <div className="mt-6">
              <h3 className="font-display text-lg text-ink">Working Hours</h3>
              <p className="mt-2 whitespace-pre-line text-sm text-slate">{settings.workingHours}</p>
            </div>
          )}

          {settings?.address && (
            <div className="mt-8 aspect-video overflow-hidden border border-line">
              <iframe
                title="Office location"
                className="h-full w-full"
                loading="lazy"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(settings.address)}&output=embed`}
              />
            </div>
          )}
        </div>

        <div className="lg:col-span-3">
          <ContactForm />
        </div>
      </Container>
    </>
  );
}
