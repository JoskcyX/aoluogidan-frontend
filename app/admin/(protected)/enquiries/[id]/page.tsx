import { notFound } from "next/navigation";
import { adminFetchJson } from "@/lib/api";
import { Container } from "@/components/ui/container";
import { EnquiryDetail } from "./enquiry-detail";

export default async function EnquiryDetailPage({ params }: { params: { id: string } }) {
  const { enquiry } = await adminFetchJson(`/api/admin/enquiries/${params.id}`).catch(() => ({ enquiry: null }));
  if (!enquiry) notFound();

  return (
    <Container className="max-w-2xl px-0">
      <EnquiryDetail enquiry={enquiry} />
    </Container>
  );
}
