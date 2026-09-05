import { notFound } from "next/navigation";
import { adminFetchJson } from "@/lib/api";
import { Container } from "@/components/ui/container";
import { TestimonialForm } from "@/components/admin/testimonial-form";

export default async function EditTestimonialPage({ params }: { params: { id: string } }) {
  const { testimonial: row } = await adminFetchJson(`/api/admin/testimonials/${params.id}`).catch(() => ({ testimonial: null }));
  if (!row) notFound();

  return (
    <Container className="max-w-2xl px-0">
      <h1 className="font-display text-2xl text-ink">Edit Testimonial</h1>
      <div className="mt-8">
        <TestimonialForm
          testimonialId={row.id}
          defaultValues={{
            ...row,
            companyPosition: row.companyPosition ?? undefined,
            dateGiven: row.dateGiven ? new Date(row.dateGiven).toISOString().slice(0, 10) : undefined,
          }}
        />
      </div>
    </Container>
  );
}
