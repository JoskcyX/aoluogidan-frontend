import { adminFetchJson } from "@/lib/api";
import { Container } from "@/components/ui/container";
import { PageHeroesForm } from "./page-heroes-form";

export default async function AdminPageHeroesPage() {
  const { pageHeroes = [] } = await adminFetchJson("/api/admin/page-heroes").catch(() => ({ pageHeroes: [] }));

  return (
    <Container className="max-w-3xl px-0">
      <h1 className="font-display text-2xl text-ink">Page Hero Images</h1>
      <p className="mt-1 text-sm text-slate">
        Set the banner photo shown at the top of each interior page. The homepage&apos;s own hero photos are
        managed separately under Settings.
      </p>
      <div className="mt-8">
        <PageHeroesForm initialPageHeroes={pageHeroes} />
      </div>
    </Container>
  );
}
