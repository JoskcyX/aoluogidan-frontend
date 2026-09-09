import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import { Container } from "@/components/ui/container";

export const metadata = { title: "Terms" };

export default async function LegalPage() {
  const { page } = await api.getPageBySlug("terms").catch(() => ({ page: null }));
  if (!page) notFound();

  return (
    <Container className="max-w-3xl py-20">
      <h1 className="font-display text-4xl text-ink">{page.title}</h1>
      <div className="prose-legal mt-8" dangerouslySetInnerHTML={{ __html: page.content }} />
    </Container>
  );
}
