import { notFound } from "next/navigation";
import { adminFetchJson } from "@/lib/api";
import { Container } from "@/components/ui/container";
import { LawyerForm } from "@/components/admin/lawyer-form";

export default async function EditLawyerPage({ params }: { params: { id: string } }) {
  const [{ lawyer, practiceAreaIds = [] }, { practiceAreas: areas = [] }] = await Promise.all([
    adminFetchJson(`/api/admin/lawyers/${params.id}`).catch(() => ({ lawyer: null })),
    adminFetchJson("/api/admin/practice-areas"),
  ]);
  if (!lawyer) notFound();

  return (
    <Container className="max-w-3xl px-0">
      <h1 className="font-display text-2xl text-ink">Edit Lawyer</h1>
      <p className="mt-1 text-sm text-slate">Update {lawyer.name}&apos;s profile.</p>
      <div className="mt-8">
        <LawyerForm
          practiceAreas={areas}
          lawyerId={lawyer.id}
          defaultValues={{
            ...lawyer,
            experienceYears: lawyer.experienceYears ?? undefined,
            practiceAreaIds,
          }}
        />
      </div>
    </Container>
  );
}
