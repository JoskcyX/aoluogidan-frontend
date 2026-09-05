import { notFound } from "next/navigation";
import { adminFetchJson } from "@/lib/api";
import { Container } from "@/components/ui/container";
import { PageEditorForm } from "@/components/admin/page-editor-form";

export default async function EditLegalPage({ params }: { params: { slug: string } }) {
  const { page } = await adminFetchJson(`/api/admin/pages/${params.slug}`).catch(() => ({ page: null }));
  if (!page) notFound();

  return (
    <Container className="max-w-2xl px-0">
      <h1 className="font-display text-2xl text-ink">{page.title}</h1>
      <div className="mt-8"><PageEditorForm page={page} /></div>
    </Container>
  );
}
