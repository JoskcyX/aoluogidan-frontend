import Link from "next/link";
import Image from "next/image";
import { adminFetchJson } from "@/lib/api";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { LawyersTable } from "./lawyers-table";
import { Plus } from "lucide-react";

export default async function AdminLawyersPage() {
  const { lawyers: rows = [] } = await adminFetchJson("/api/admin/lawyers");

  return (
    <Container className="max-w-none px-0">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-ink">Lawyers</h1>
          <p className="mt-1 text-sm text-slate">Manage the lawyers shown on your website.</p>
        </div>
        <Link href="/admin/lawyers/new">
          <Button size="sm"><Plus size={16} className="mr-1" /> Add Lawyer</Button>
        </Link>
      </div>

      <div className="mt-8">
        {rows.length === 0 ? (
          <EmptyState
            title="No lawyers have been added yet."
            description="Add your first lawyer profile to have it appear on the Team page."
            actionLabel="+ Add Your First Lawyer"
            actionHref="/admin/lawyers/new"
          />
        ) : (
          <LawyersTable initialLawyers={rows} />
        )}
      </div>
    </Container>
  );
}
