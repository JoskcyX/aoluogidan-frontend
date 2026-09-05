import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { post } = await api.getBlogPost(params.slug).catch(() => ({ post: null }));
  if (!post) return {};
  return {
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt ?? undefined,
    alternates: post.canonicalUrl ? { canonical: post.canonicalUrl } : undefined,
    openGraph: { images: post.featuredImageUrl ? [post.featuredImageUrl] : undefined },
  };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const { post, tags = [], related = [] } = await api
    .getBlogPost(params.slug)
    .catch(() => ({ post: null, tags: [], related: [] }));

  if (!post) notFound();

  return (
    <article className="py-20">
      <Container className="max-w-3xl">
        {post.categoryName && <p className="text-xs font-semibold uppercase tracking-widest text-brass-deep">{post.categoryName}</p>}
        <h1 className="mt-3 font-display text-4xl leading-tight text-ink">{post.title}</h1>
        <p className="mt-4 text-sm text-slate">
          By {post.authorName} ·{" "}
          {post.publishedAt && new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        {post.featuredImageUrl && (
          <div className="mt-8 aspect-[16/9] overflow-hidden bg-surface">
            <Image src={post.featuredImageUrl} alt={post.title} width={1200} height={675} className="h-full w-full object-cover" />
          </div>
        )}

        <div className="prose-legal mt-10" dangerouslySetInnerHTML={{ __html: post.content }} />

        {tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2 border-t border-line pt-6">
            {tags.map((t: any) => (
              <span key={t.name} className="rounded-sm bg-surface px-3 py-1 text-xs text-slate">#{t.name}</span>
            ))}
          </div>
        )}

        <div className="mt-14 border border-line bg-surface p-8 text-center">
          <p className="font-display text-xl text-ink">Have a legal question about this topic?</p>
          <Link href="/consultation" className="mt-4 inline-block">
            <Button>Request a Consultation</Button>
          </Link>
        </div>

        {related.length > 0 && (
          <div className="mt-14">
            <h2 className="font-display text-2xl text-ink">Related Insights</h2>
            <ul className="mt-4 space-y-3">
              {related.map((r: any) => (
                <li key={r.slug}>
                  <Link href={`/insights/${r.slug}`} className="text-brass-deep hover:underline">{r.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Container>
    </article>
  );
}
