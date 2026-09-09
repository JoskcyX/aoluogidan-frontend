import Image from "next/image";
import { Container } from "@/components/ui/container";

/**
 * Animated banner used at the top of every interior page (About, Team,
 * Contact, Practice Areas, Insights, FAQ, Consultation...). Pass an
 * `image` URL — e.g. `settings.heroImageUrl` from site settings, or a
 * page-specific field once your CMS exposes one — and it renders a full
 * photographic banner with a slow Ken Burns zoom, matching the homepage
 * hero. Omit `image` and it falls back to a lighter, textured header so
 * the page still looks intentional before a photo is set.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  image,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  image?: string | null;
}) {
  if (image) {
    return (
      <section className="relative flex min-h-[46vh] items-end overflow-hidden bg-ink text-white sm:min-h-[52vh]">
        <div className="absolute inset-0 animate-kenburns">
          <Image src={image} alt="" fill priority sizes="100vw" className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/20" />
        <Container className="relative py-14 sm:py-16">
          <div className="animate-fade-up" style={{ animationDelay: "80ms" }}>
            {eyebrow && (
              <p className="mb-3 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-brass">
                <span className="h-px w-8 bg-brass" />
                {eyebrow}
              </p>
            )}
            <h1 className="max-w-2xl font-display text-4xl leading-[1.1] sm:text-5xl">{title}</h1>
            {description && (
              <p className="mt-4 max-w-xl text-base leading-relaxed text-white/75">{description}</p>
            )}
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden border-b border-line bg-surface py-20">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brass/10 blur-3xl"
        aria-hidden
      />
      <Container className="relative animate-fade-up">
        {eyebrow && (
          <p className="mb-3 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-brass-deep">
            <span className="h-px w-8 bg-brass-deep" />
            {eyebrow}
          </p>
        )}
        <h1 className="max-w-2xl font-display text-3xl leading-tight text-ink sm:text-4xl">{title}</h1>
        {description && <p className="mt-4 max-w-xl text-base leading-relaxed text-slate">{description}</p>}
      </Container>
    </section>
  );
}
