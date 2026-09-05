import Link from "next/link";
import { adminFetchJson } from "@/lib/api";
import { Container } from "@/components/ui/container";
import { FileText } from "lucide-react";

export default async function AdminPagesPage() {
  const { pages: legalPages = [] } = await adminFetchJson("/api/admin/pages");

  return (
    <Container className="max-w-2xl px-0">
      <h1 className="font-display text-2xl text-ink">Pages</h1>
      <p className="mt-1 text-sm text-slate">Edit static content that doesn't fit neatly into Lawyers, Insights, or FAQs.</p>

      <div className="mt-8 divide-y divide-line border-y border-line">
        <Link href="/admin/pages/about" className="flex items-center gap-3 py-4 hover:text-brass-deep">
          <FileText size={18} /> About Page Content
        </Link>
        {legalPages.map((p: any) => (
          <Link key={p.id} href={`/admin/pages/${p.slug}`} className="flex items-center gap-3 py-4 hover:text-brass-deep">
            <FileText size={18} /> {p.title}
          </Link>
        ))}
      </div>
    </Container>
  );
}
