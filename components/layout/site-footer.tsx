import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Linkedin, Instagram, Twitter, Mail, Phone, MapPin, MessageCircle } from "lucide-react";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/practice-areas", label: "Practice Areas" },
  { href: "/team", label: "Our Team" },
  { href: "/insights", label: "Insights" },
  { href: "/faq", label: "FAQ" },
  { href: "/internship", label: "Internship" },
  { href: "/contact", label: "Contact" },
];

export function SiteFooter({
  settings,
}: {
  settings: Record<string, any>;
  practiceAreas: Array<Record<string, any>>;
}) {
  const socials = [
    { href: settings.socialLinkedin, label: "LinkedIn", Icon: Linkedin },
    { href: settings.socialInstagram, label: "Instagram", Icon: Instagram },
    { href: settings.socialX, label: "X", Icon: Twitter },
  ].filter((s) => s.href);

  return (
    <footer className="border-t border-line bg-ink text-white/80">
      <Container className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="font-display text-xl text-white">{settings.firmName}</p>
          {settings.footerDescription && (
            <p className="mt-4 max-w-xs text-sm leading-relaxed">{settings.footerDescription}</p>
          )}
          {socials.length > 0 && (
            <div className="mt-6 flex gap-3">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-brass hover:text-brass"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/50">Links</p>
          <ul className="space-y-2 text-sm">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-brass">{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/50">Contact</p>
          <ul className="space-y-3 text-sm">
            {settings.phone && (
              <li className="flex items-start gap-2">
                <Phone size={15} className="mt-0.5 shrink-0 text-white/50" />
                <a href={`tel:${settings.phone}`} className="hover:text-brass">{settings.phone}</a>
              </li>
            )}
            {settings.whatsapp && (
              <li className="flex items-start gap-2">
                <MessageCircle size={15} className="mt-0.5 shrink-0 text-white/50" />
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-brass"
                >
                  WhatsApp: {settings.whatsapp}
                </a>
              </li>
            )}
            {settings.email && (
              <li className="flex items-start gap-2">
                <Mail size={15} className="mt-0.5 shrink-0 text-white/50" />
                <a href={`mailto:${settings.email}`} className="hover:text-brass">{settings.email}</a>
              </li>
            )}
            {settings.address && (
              <li className="flex items-start gap-2">
                <MapPin size={15} className="mt-0.5 shrink-0 text-white/50" />
                <span className="whitespace-pre-line">{settings.address}</span>
              </li>
            )}
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-4 py-6 text-xs text-white/50 sm:flex-row">
          <p>{settings.copyrightText}</p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-brass">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-brass">Terms</Link>
            <Link href="/disclaimer" className="hover:text-brass">Disclaimer</Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
