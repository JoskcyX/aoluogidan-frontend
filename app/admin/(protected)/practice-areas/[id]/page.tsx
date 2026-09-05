import { notFound } from "next/navigation";
import { adminFetchJson } from "@/lib/api";
import { Container } from "@/components/ui/container";
import { PracticeAreaForm } from "@/components/admin/practice-area-form";

export default async function EditPracticeAreaPage({ params }: { params: { id: string } }) {
  const [{ practiceArea: area, services = [], lawyerIds = [] }, { lawyers: allLawyers = [] }] = await Promise.all([
    adminFetchJson(`/api/admin/practice-areas/${params.id}`).catch(() => ({ practiceArea: null })),
    adminFetchJson("/api/admin/lawyers"),
  ]);
  if (!area) notFound();

  return (
    <Container className="max-w-3xl px-0">
      <h1 className="font-display text-2xl text-ink">Edit Practice Area</h1>
      <div className="mt-8">
        <PracticeAreaForm
          lawyers={allLawyers}
          practiceAreaId={area.id}
          defaultValues={{ ...area, services: services.map((s: any) => s.name ?? s), lawyerIds }}
        />
      </div>
    </Container>
  );
}
