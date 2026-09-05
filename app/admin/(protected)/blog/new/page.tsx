import { adminFetchJson } from "@/lib/api";
import { Container } from "@/components/ui/container";
import { BlogPostForm } from "@/components/admin/blog-post-form";

export default async function NewBlogPostPage() {
  const { categories = [] } = await adminFetchJson("/api/admin/blog-categories");
  return (
    <Container className="max-w-3xl px-0">
      <h1 className="font-display text-2xl text-ink">Write Article</h1>
      <div className="mt-8"><BlogPostForm categories={categories} /></div>
    </Container>
  );
}
