import { notFound } from "next/navigation";
import { adminFetchJson } from "@/lib/api";
import { Container } from "@/components/ui/container";
import { BlogPostForm } from "@/components/admin/blog-post-form";

export default async function EditBlogPostPage({ params }: { params: { id: string } }) {
  const [{ post, tagNames = [] }, { categories = [] }] = await Promise.all([
    adminFetchJson(`/api/admin/blog/${params.id}`).catch(() => ({ post: null })),
    adminFetchJson("/api/admin/blog-categories"),
  ]);
  if (!post) notFound();

  return (
    <Container className="max-w-3xl px-0">
      <h1 className="font-display text-2xl text-ink">Edit Article</h1>
      <div className="mt-8">
        <BlogPostForm
          categories={categories}
          postId={post.id}
          defaultValues={{ ...post, categoryId: post.categoryId ?? undefined, tagNames }}
        />
      </div>
    </Container>
  );
}
