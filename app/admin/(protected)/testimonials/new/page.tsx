import { Container } from "@/components/ui/container";
import { TestimonialForm } from "@/components/admin/testimonial-form";

export default function NewTestimonialPage() {
  return (
    <Container className="max-w-2xl px-0">
      <h1 className="font-display text-2xl text-ink">Add Testimonial</h1>
      <div className="mt-8"><TestimonialForm /></div>
    </Container>
  );
}
