import Link from "next/link";
import { adminFetchJson } from "@/lib/api";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PracticeAreasTable } from "./practice-areas-table";
import { Plus } from "lucide-react";

export default async function AdminPracticeAreasPage() {
  const { practiceAreas: rows = [] } = await adminFetchJson("/api/admin/practice-areas");

  return (
    <Container className="max-w-none px-0">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-ink">Practice Areas</h1>
          <p className="mt-1 text-sm text-slate">Manage the areas of law your firm advertises.</p>
        </div>
        <Link href="/admin/practice-areas/new">
          <Button size="sm"><Plus size={16} className="mr-1" /> Add Practice Area</Button>
        </Link>
      </div>

      <div className="mt-8">
        {rows.length === 0 ? (
          <EmptyState title="No practice areas have been added yet." actionLabel="+ Add Your First Practice Area" actionHref="/admin/practice-areas/new" />
        ) : (
          <PracticeAreasTable initialRows={rows} />
        )}
      </div>
    </Container>
  );
}
