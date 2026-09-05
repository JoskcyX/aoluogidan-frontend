import Link from "next/link";
import Image from "next/image";
import { HeroSlideshow } from "@/components/layout/hero-slideshow";
import { ArrowRight, Scale, Briefcase, Building, Lightbulb, Users, Landmark, Quote } from "lucide-react";
import { api } from "@/lib/api";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { AnimatedCounter } from "@/components/ui/animated-counter";

const ICONS: Record<string, React.ElementType> = {
  scale: Scale,
  briefcase: Briefcase,
  building: Building,
  lightbulb: Lightbulb,
  users: Users,
  landmark: Landmark,
};

export default async function HomePage() {
  const [
    { settings },
    { practiceAreas: areas },
    { lawyers: featuredLawyers },
    { posts: latestPosts },
    { testimonials: featuredTestimonials },
  ] = await Promise.all([
    api.getSiteSettings().catch(() => ({ settings: null })),
    api.getPracticeAreas().catch(() => ({ practiceAreas: [] })),
    api.getFeaturedLawyers().catch(() => ({ lawyers: [] })),
    api.getBlogPosts({ limit: 3 }).catch(() => ({ posts: [] })),
    api.getTestimonials({ featured: true }).catch(() => ({ testimonials: [] })),
  ]);

  const areasToShow = areas.slice(0, 6);
  const lawyersToShow = featuredLawyers.slice(0, 4);
  const testimonialsToShow = featuredTestimonials.slice(0, 3);

  if (!settings) {
    return (
      <Container className="py-24 text-center">
        <p className="text-slate">
          Site settings haven&apos;t been configured yet. Run the seed script, or add a settings row from
          /admin/settings.
        </p>
      </Container>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-white">
        {/* Sliding hero photos — one at a time, crossfading */}
        {(() => {
          const heroPhotos = [
            settings.heroImageUrl,
            settings.heroImageUrl2,
            settings.heroImageUrl3,
            settings.heroImageUrl4,
          ].filter((url): url is string => Boolean(url));

          if (heroPhotos.length === 0) return null;

          return <HeroSlideshow photos={heroPhotos} />;
        })()}

        {/* Dark-to-transparent gradient so the text on the left stays readable
            over the photos, while the photos remain visible toward the right. */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/30" />

        <Container className="relative grid gap-12 py-24 lg:grid-cols-12 lg:py-32">
          <div className="lg:col-span-7">
            <p
              className="mb-5 animate-fade-up text-xs font-semibold uppercase tracking-[0.25em] text-brass"
              style={{ animationDelay: "80ms" }}
            >
              {settings.tagline}
            </p>
            <h1
              className="animate-fade-up font-display text-4xl leading-[1.1] sm:text-5xl lg:text-6xl"
              style={{ animationDelay: "200ms" }}
            >
              {settings.heroHeading}
            </h1>
            {settings.heroSubheading && (
              <p
                className="mt-6 max-w-xl animate-fade-up text-base leading-relaxed text-white/70"
                style={{ animationDelay: "320ms" }}
              >
                {settings.heroSubheading}
              </p>
            )}
            <div
              className="mt-10 flex animate-fade-up flex-wrap gap-4"
              style={{ animationDelay: "440ms" }}
            >
              <Link href={settings.heroCtaLink}>
                <Button size="lg" className="transition-transform duration-200 hover:scale-105">
                  {settings.heroCtaText}
                </Button>
              </Link>
              <Link href={settings.heroSecondaryCtaLink}>
                <Button
                  size="lg"
                  variant="secondary"
                  className="border-white text-white transition-transform duration-200 hover:scale-105 hover:bg-white hover:text-ink"
                >
                  {settings.heroSecondaryCtaText}
                </Button>
              </Link>
            </div>
          </div>
        </Container>

        <div className="absolute inset-x-0 bottom-6 hidden justify-center sm:flex">
          <span className="h-9 w-5 animate-bounce-slow rounded-full border border-white/40" aria-hidden>
            <span className="mx-auto mt-1.5 block h-1.5 w-1.5 rounded-full bg-white/70" />
          </span>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-line bg-surface">
        <Container className="grid grid-cols-2 gap-8 py-14 lg:grid-cols-4">
          {[
            { value: `${settings.statYearsExperience}+`, label: "Years of Experience" },
            { value: `${settings.statLawyersCount}+`, label: "Legal Professionals" },
            { value: `${settings.statPracticeAreasCount}+`, label: "Practice Areas" },
            { value: `${settings.statClientsServed}+`, label: "Clients Served" },
          ].map((stat, i) => (
            <Reveal key={stat.label} delay={i * 100} className="text-center lg:text-left">
              <p className="font-display text-4xl text-ink">
                <AnimatedCounter value={stat.value} />
              </p>
              <p className="mt-1 text-sm text-slate">{stat.label}</p>
            </Reveal>
          ))}
        </Container>
      </section>

      {/* Practice Areas */}
      <section className="py-24">
        <Container>
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="What We Do" title="Practice Areas" />
            <Link href="/practice-areas" className="link-underline flex items-center gap-1 text-sm font-medium text-brass-deep">
              View all practice areas <ArrowRight size={14} />
            </Link>
          </Reveal>

          <div className="mt-12 grid gap-px overflow-hidden rounded border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {areasToShow.map((area: any, i: number) => {
              const Icon = ICONS[area.iconName ?? "scale"] ?? Scale;
              return (
                <Reveal key={area.id} delay={i * 80}>
                  <Link
                    href={`/practice-areas/${area.slug}`}
                    className="group block h-full bg-white p-8 transition-all duration-300 hover:z-10 hover:-translate-y-1 hover:bg-surface hover:shadow-lg"
                  >
                    <Icon
                      className="text-brass transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                      size={28}
                      strokeWidth={1.5}
                    />
                    <h3 className="mt-5 font-display text-lg text-ink">{area.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate">{area.shortDescription}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brass-deep opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                      Learn more <ArrowRight size={14} />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Featured Lawyers */}
      {lawyersToShow.length > 0 && (
        <section className="border-t border-line bg-surface py-24">
          <Container>
            <Reveal className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading eyebrow="Meet the Team" title="Our Legal Professionals" />
              <Link href="/team" className="link-underline flex items-center gap-1 text-sm font-medium text-brass-deep">
                Meet the full team <ArrowRight size={14} />
              </Link>
            </Reveal>

            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {lawyersToShow.map((lawyer: any, i: number) => (
                <Reveal key={lawyer.id} delay={i * 80}>
                  <Link href={`/team/${lawyer.slug}`} className="group block">
                    <div className="aspect-[4/5] overflow-hidden bg-line">
                      {lawyer.photoUrl ? (
                        <Image
                          src={lawyer.photoUrl}
                          alt={lawyer.name}
                          width={400}
                          height={500}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-slate">No photo</div>
                      )}
                    </div>
                    <h3 className="mt-4 font-display text-lg text-ink transition-colors group-hover:text-brass-deep">{lawyer.name}</h3>
                    <p className="text-sm text-brass-deep">{lawyer.position}</p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Legal Insights */}
      {latestPosts.length > 0 && (
        <section className="py-24">
          <Container>
            <Reveal className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading eyebrow="Insights" title="Legal Insights" />
              <Link href="/insights" className="link-underline flex items-center gap-1 text-sm font-medium text-brass-deep">
                All insights <ArrowRight size={14} />
              </Link>
            </Reveal>

            <div className="mt-12 grid gap-10 lg:grid-cols-3">
              {latestPosts.map((post: any, i: number) => (
                <Reveal key={post.id} delay={i * 80}>
                <Link href={`/insights/${post.slug}`} className="group block transition-transform duration-300 hover:-translate-y-1">
                  <div className="aspect-[16/10] overflow-hidden bg-surface">
                    {post.featuredImageUrl ? (
                      <Image
                        src={post.featuredImageUrl}
                        alt={post.title}
                        width={600}
                        height={375}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate">A. Oluogidan & Co</div>
                    )}
                  </div>
                  <div className="mt-5">
                    {post.categoryName && (
                      <p className="text-xs font-semibold uppercase tracking-widest text-brass-deep">
                        {post.categoryName}
                      </p>
                    )}
                    <h3 className="mt-2 font-display text-xl text-ink group-hover:text-brass-deep">
                      {post.title}
                    </h3>
                    {post.excerpt && <p className="mt-2 text-sm leading-relaxed text-slate">{post.excerpt}</p>}
                    <p className="mt-4 text-xs text-slate">
                      {post.authorName} ·{" "}
                      {post.publishedAt &&
                        new Date(post.publishedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                    </p>
                  </div>
                </Link>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Testimonials */}
      {testimonialsToShow.length > 0 && (
        <section className="border-t border-line bg-ink py-24 text-white">
          <Container>
            <Reveal>
              <SectionHeading eyebrow="Client Perspectives" title="What Clients Say" light align="center" />
            </Reveal>
            <div className="mt-12 grid gap-8 lg:grid-cols-3">
              {testimonialsToShow.map((t: any, i: number) => (
                <Reveal key={t.id} delay={i * 100}>
                  <div className="h-full border border-white/10 p-8 transition-colors duration-300 hover:border-brass/50">
                    <Quote className="text-brass" size={24} />
                    <p className="mt-4 text-sm leading-relaxed text-white/80">&ldquo;{t.testimonial}&rdquo;</p>
                    <p className="mt-6 text-sm font-medium text-white">{t.clientName}</p>
                    {t.companyPosition && <p className="text-xs text-white/50">{t.companyPosition}</p>}
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Consultation CTA */}
      <section className="py-24">
        <Container>
          <Reveal className="flex flex-col items-center gap-6 border border-line bg-surface px-8 py-16 text-center">
            <h2 className="font-display text-3xl text-ink sm:text-4xl">Need Legal Advice?</h2>
            <p className="max-w-md text-slate">Speak with our legal team about your situation.</p>
            <Link href="/consultation">
              <Button size="lg" className="transition-transform duration-200 hover:scale-105">
                Request a Consultation
              </Button>
            </Link>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
