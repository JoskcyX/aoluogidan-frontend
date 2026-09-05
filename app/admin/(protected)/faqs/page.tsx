import Link from "next/link";
import { adminFetchJson } from "@/lib/api";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { FaqsTable } from "./faqs-table";
import { Plus } from "lucide-react";

export default async function AdminFaqsPage() {
  const { faqs: rows = [] } = await adminFetchJson("/api/admin/faqs");

  return (
    <Container className="max-w-none px-0">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-ink">FAQs</h1>
          <p className="mt-1 text-sm text-slate">Manage the questions shown on your FAQ page.</p>
        </div>
        <Link href="/admin/faqs/new"><Button size="sm"><Plus size={16} className="mr-1" /> Add FAQ</Button></Link>
      </div>

      <div className="mt-8">
        {rows.length === 0 ? (
          <EmptyState title="No FAQs have been added yet." actionLabel="+ Add Your First FAQ" actionHref="/admin/faqs/new" />
        ) : (
          <FaqsTable initialRows={rows} />
        )}
      </div>
    </Container>
  );
}
