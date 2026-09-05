import { adminFetchJson } from "@/lib/api";
import { Container } from "@/components/ui/container";
import { PracticeAreaForm } from "@/components/admin/practice-area-form";

export default async function NewPracticeAreaPage() {
  const { lawyers: allLawyers = [] } = await adminFetchJson("/api/admin/lawyers");
  return (
    <Container className="max-w-3xl px-0">
      <h1 className="font-display text-2xl text-ink">Add Practice Area</h1>
      <div className="mt-8">
        <PracticeAreaForm lawyers={allLawyers} />
      </div>
    </Container>
  );
}
