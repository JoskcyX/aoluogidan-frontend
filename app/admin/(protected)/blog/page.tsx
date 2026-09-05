import Link from "next/link";
import { adminFetchJson } from "@/lib/api";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { BlogTable } from "./blog-table";
import { Plus } from "lucide-react";

export default async function AdminBlogPage() {
  const { posts: rows = [] } = await adminFetchJson("/api/admin/blog");

  return (
    <Container className="max-w-none px-0">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-ink">Insights</h1>
          <p className="mt-1 text-sm text-slate">Write and publish articles for your website.</p>
        </div>
        <Link href="/admin/blog/new"><Button size="sm"><Plus size={16} className="mr-1" /> Write Article</Button></Link>
      </div>

      <div className="mt-8">
        {rows.length === 0 ? (
          <EmptyState title="No articles have been written yet." actionLabel="+ Write Your First Article" actionHref="/admin/blog/new" />
        ) : (
          <BlogTable initialRows={rows} />
        )}
      </div>
    </Container>
  );
}
