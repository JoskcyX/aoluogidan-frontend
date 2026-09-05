import { notFound } from "next/navigation";
import { adminFetchJson } from "@/lib/api";
import { Container } from "@/components/ui/container";
import { FaqForm } from "@/components/admin/faq-form";

export default async function EditFaqPage({ params }: { params: { id: string } }) {
  const [{ faq }, { practiceAreas: areas = [] }] = await Promise.all([
    adminFetchJson(`/api/admin/faqs/${params.id}`).catch(() => ({ faq: null })),
    adminFetchJson("/api/admin/practice-areas"),
  ]);
  if (!faq) notFound();

  return (
    <Container className="max-w-2xl px-0">
      <h1 className="font-display text-2xl text-ink">Edit FAQ</h1>
      <div className="mt-8">
        <FaqForm practiceAreas={areas} faqId={faq.id} defaultValues={{ ...faq, practiceAreaId: faq.practiceAreaId ?? undefined }} />
      </div>
    </Container>
  );
}
