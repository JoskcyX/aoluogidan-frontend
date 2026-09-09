import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/api";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/layout/page-hero";
import { Reveal } from "@/components/ui/reveal";

export const metadata = { title: "Legal Insights" };

const PAGE_SIZE = 6;

export default async function InsightsPage({
  searchParams,
}: {
  searchParams: { page?: string; category?: string };
}) {
  const page = Math.max(1, Number(searchParams.page ?? 1));
  const [{ categories = [] }, { settings }, { pageHeroes }] = await Promise.all([
    api.getBlogCategories().catch(() => ({ categories: [] })),
    api.getSiteSettings().catch(() => ({ settings: null })),
    api.getPageHeroes().catch(() => ({ pageHeroes: {} })),
  ]);
  const activeCategory = categories.find((c: any) => c.slug === searchParams.category);

  const { posts = [] } = await api
    .getBlogPosts({ page, limit: PAGE_SIZE, category: searchParams.category })
    .catch(() => ({ posts: [] }));

  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="Legal Insights & News"
        description="Analysis and updates from our legal team."
        image={pageHeroes?.insights ?? settings?.heroImageUrl}
      />

      <Container className="py-20">
        <div className="mb-10 flex flex-wrap gap-3">
          <Link
            href="/insights"
            className={`rounded-sm border px-4 py-1.5 text-sm ${!activeCategory ? "border-ink bg-ink text-white" : "border-line text-slate hover:border-brass"}`}
          >
            All
          </Link>
          {categories.map((c: any) => (
            <Link
              key={c.id}
              href={`/insights?category=${c.slug}`}
              className={`rounded-sm border px-4 py-1.5 text-sm ${activeCategory?.id === c.id ? "border-ink bg-ink text-white" : "border-line text-slate hover:border-brass"}`}
            >
              {c.name}
            </Link>
          ))}
        </div>

        {posts.length === 0 ? (
          <p className="text-slate">No articles published yet.</p>
        ) : (
          <div className="grid gap-10 lg:grid-cols-3">
            {posts.map((post: any, i: number) => (
              <Reveal key={post.id} delay={i * 60}>
                <Link href={`/insights/${post.slug}`} className="group block transition-transform duration-300 hover:-translate-y-1">
                  <div className="aspect-[16/10] overflow-hidden bg-surface">
                    {post.featuredImageUrl ? (
                      <Image src={post.featuredImageUrl} alt={post.title} width={600} height={375} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate">No image</div>
                    )}
                  </div>
                  <div className="mt-5">
                    {post.categoryName && <p className="text-xs font-semibold uppercase tracking-widest text-brass-deep">{post.categoryName}</p>}
                    <h2 className="mt-2 font-display text-xl text-ink group-hover:text-brass-deep">{post.title}</h2>
                    {post.excerpt && <p className="mt-2 text-sm leading-relaxed text-slate">{post.excerpt}</p>}
                    <p className="mt-4 text-xs text-slate">
                      {post.authorName} · {post.publishedAt && new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}

        <div className="mt-14 flex justify-center gap-4">
          {page > 1 && (
            <Link href={`/insights?page=${page - 1}`} className="text-sm font-medium text-brass-deep hover:underline">
              ← Previous
            </Link>
          )}
          {posts.length === PAGE_SIZE && (
            <Link href={`/insights?page=${page + 1}`} className="text-sm font-medium text-brass-deep hover:underline">
              Next →
            </Link>
          )}
        </div>
      </Container>
    </>
  );
}
