import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Linkedin, Mail, Phone } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { lawyer } = await api.getLawyer(params.slug).catch(() => ({ lawyer: null }));
  if (!lawyer) return {};
  return { title: lawyer.seoTitle ?? lawyer.name, description: lawyer.seoDescription ?? lawyer.bioShort ?? undefined };
}

export default async function LawyerProfilePage({ params }: { params: { slug: string } }) {
  const { lawyer, practiceAreas: areas } = await api
    .getLawyer(params.slug)
    .catch(() => ({ lawyer: null, practiceAreas: [] }));

  if (!lawyer) notFound();

  const listField = (value: string | null) =>
    value ? value.split("\n").filter(Boolean) : [];

  return (
    <Container className="grid gap-16 py-20 lg:grid-cols-3">
      <div className="mx-auto w-full max-w-[320px] lg:max-w-none">
        <div className="aspect-[4/5] overflow-hidden rounded-lg bg-surface shadow-md">
          {lawyer.photoUrl ? (
            <Image src={lawyer.photoUrl} alt={lawyer.name} width={380} height={475} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-slate">No photo</div>
          )}
        </div>
        <div className="mt-6 space-y-3 text-sm">
          {lawyer.email && (
            <a href={`mailto:${lawyer.email}`} className="flex items-center gap-2 text-ink hover:text-brass-deep">
              <Mail size={16} /> {lawyer.email}
            </a>
          )}
          {lawyer.phone && (
            <a href={`tel:${lawyer.phone}`} className="flex items-center gap-2 text-ink hover:text-brass-deep">
              <Phone size={16} /> {lawyer.phone}
            </a>
          )}
          {lawyer.linkedinUrl && (
            <a href={lawyer.linkedinUrl} className="flex items-center gap-2 text-ink hover:text-brass-deep">
              <Linkedin size={16} /> LinkedIn Profile
            </a>
          )}
        </div>
        <Link href="/consultation" className="mt-6 block">
          <Button className="w-full">Request a Consultation</Button>
        </Link>
      </div>

      <div className="lg:col-span-2">
        <h1 className="font-display text-4xl text-ink">{lawyer.name}</h1>
        <p className="mt-2 text-brass-deep">{lawyer.position}</p>

        {areas.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {areas.map((a: any) => (
              <Link key={a.id} href={`/practice-areas/${a.slug}`} className="rounded-sm border border-line px-3 py-1 text-xs text-slate hover:border-brass hover:text-brass-deep">
                {a.name}
              </Link>
            ))}
          </div>
        )}

        {lawyer.bio && <p className="mt-8 leading-relaxed text-slate">{lawyer.bio}</p>}

        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          {lawyer.education && (
            <div>
              <h3 className="font-display text-lg text-ink">Education</h3>
              <ul className="mt-2 space-y-1 text-sm text-slate">
                {listField(lawyer.education).map((line, i) => <li key={i}>{line}</li>)}
              </ul>
            </div>
          )}
          {lawyer.qualifications && (
            <div>
              <h3 className="font-display text-lg text-ink">Qualifications</h3>
              <p className="mt-2 text-sm text-slate">{lawyer.qualifications}</p>
            </div>
          )}
          {lawyer.memberships && (
            <div>
              <h3 className="font-display text-lg text-ink">Professional Memberships</h3>
              <ul className="mt-2 space-y-1 text-sm text-slate">
                {listField(lawyer.memberships).map((line, i) => <li key={i}>{line}</li>)}
              </ul>
            </div>
          )}
          {lawyer.awards && (
            <div>
              <h3 className="font-display text-lg text-ink">Awards</h3>
              <p className="mt-2 text-sm text-slate">{lawyer.awards}</p>
            </div>
          )}
          {lawyer.languages && (
            <div>
              <h3 className="font-display text-lg text-ink">Languages</h3>
              <p className="mt-2 text-sm text-slate">{lawyer.languages}</p>
            </div>
          )}
          {lawyer.experienceYears != null && (
            <div>
              <h3 className="font-display text-lg text-ink">Experience</h3>
              <p className="mt-2 text-sm text-slate">{lawyer.experienceYears} years</p>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
