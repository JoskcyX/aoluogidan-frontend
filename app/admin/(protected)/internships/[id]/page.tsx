import { notFound } from "next/navigation";
import { adminFetchJson } from "@/lib/api";
import { Container } from "@/components/ui/container";
import { InternshipDetail } from "./internship-detail";

export default async function InternshipDetailPage({ params }: { params: { id: string } }) {
  const { application } = await adminFetchJson(`/api/admin/internships/${params.id}`).catch(() => ({
    application: null,
  }));
  if (!application) notFound();

  return (
    <Container className="max-w-2xl px-0">
      <InternshipDetail application={application} />
    </Container>
  );
}
