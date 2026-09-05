import { adminFetchJson } from "@/lib/api";
import { Container } from "@/components/ui/container";
import { FaqForm } from "@/components/admin/faq-form";

export default async function NewFaqPage() {
  const { practiceAreas: areas = [] } = await adminFetchJson("/api/admin/practice-areas");
  return (
    <Container className="max-w-2xl px-0">
      <h1 className="font-display text-2xl text-ink">Add FAQ</h1>
      <div className="mt-8"><FaqForm practiceAreas={areas} /></div>
    </Container>
  );
}
