import { adminFetchJson } from "@/lib/api";
import { Container } from "@/components/ui/container";
import { LawyerForm } from "@/components/admin/lawyer-form";

export default async function NewLawyerPage() {
  const { practiceAreas: areas = [] } = await adminFetchJson("/api/admin/practice-areas");

  return (
    <Container className="max-w-3xl px-0">
      <h1 className="font-display text-2xl text-ink">Add Lawyer</h1>
      <p className="mt-1 text-sm text-slate">Fill in the details below, then publish to make this profile live.</p>
      <div className="mt-8">
        <LawyerForm practiceAreas={areas} />
      </div>
    </Container>
  );
}
