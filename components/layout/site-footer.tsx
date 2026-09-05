import Link from "next/link";
import { Container } from "@/components/ui/container";

export function SiteFooter({
  settings,
  practiceAreas,
}: {
  settings: Record<string, any>;
  practiceAreas: Array<Record<string, any>>;
}) {
  return (
    <footer className="border-t border-line bg-ink text-white/80">
      <Container className="grid gap-12 py-16 lg:grid-cols-4">
        <div>
          <p className="font-display text-xl text-white">{settings.firmName}</p>
          {settings.footerDescription && (
            <p className="mt-4 max-w-xs text-sm leading-relaxed">{settings.footerDescription}</p>
          )}
          <div className="mt-6 flex gap-4 text-sm">
            {settings.socialLinkedin && <a href={settings.socialLinkedin} className="hover:text-brass">LinkedIn</a>}
            {settings.socialFacebook && <a href={settings.socialFacebook} className="hover:text-brass">Facebook</a>}
            {settings.socialInstagram && <a href={settings.socialInstagram} className="hover:text-brass">Instagram</a>}
            {settings.socialX && <a href={settings.socialX} className="hover:text-brass">X</a>}
          </div>
        </div>

        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/50">Practice Areas</p>
          <ul className="space-y-2 text-sm">
            {practiceAreas.slice(0, 6).map((pa) => (
              <li key={pa.id}>
                <Link href={`/practice-areas/${pa.slug}`} className="hover:text-brass">
                  {pa.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/50">Firm</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-brass">About</Link></li>
            <li><Link href="/team" className="hover:text-brass">Our Team</Link></li>
            <li><Link href="/insights" className="hover:text-brass">Insights</Link></li>
            <li><Link href="/faq" className="hover:text-brass">FAQ</Link></li>
            <li><Link href="/contact" className="hover:text-brass">Contact</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/50">Contact</p>
          <ul className="space-y-2 text-sm">
            {settings.address && <li className="whitespace-pre-line">{settings.address}</li>}
            <li><a href={`tel:${settings.phone}`} className="hover:text-brass">{settings.phone}</a></li>
            <li><a href={`mailto:${settings.email}`} className="hover:text-brass">{settings.email}</a></li>
            {settings.workingHours && (
              <li className="whitespace-pre-line pt-2 text-white/50">{settings.workingHours}</li>
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
