import Link from "next/link";
import { adminFetchJson } from "@/lib/api";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { TestimonialsTable } from "./testimonials-table";
import { Plus } from "lucide-react";

export default async function AdminTestimonialsPage() {
  const { testimonials: rows = [] } = await adminFetchJson("/api/admin/testimonials");

  return (
    <Container className="max-w-none px-0">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-ink">Testimonials</h1>
          <p className="mt-1 text-sm text-slate">Client feedback shown on your website.</p>
        </div>
        <Link href="/admin/testimonials/new"><Button size="sm"><Plus size={16} className="mr-1" /> Add Testimonial</Button></Link>
      </div>

      <div className="mt-8">
        {rows.length === 0 ? (
          <EmptyState title="No testimonials have been added yet." actionLabel="+ Add Your First Testimonial" actionHref="/admin/testimonials/new" />
        ) : (
          <TestimonialsTable initialRows={rows} />
        )}
      </div>
    </Container>
  );
}
