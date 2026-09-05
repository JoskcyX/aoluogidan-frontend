import { adminFetchJson } from "@/lib/api";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { MediaGrid } from "./media-grid";

export default async function AdminMediaPage() {
  const { media: files = [] } = await adminFetchJson("/api/admin/media");

  return (
    <Container className="max-w-none px-0">
      <h1 className="font-display text-2xl text-ink">Media Library</h1>
      <p className="mt-1 text-sm text-slate">
        Images uploaded from Lawyers, Practice Areas, Insights, and Testimonials appear here automatically.
      </p>

      <div className="mt-8">
        {files.length === 0 ? (
          <EmptyState title="No images uploaded yet." description="Upload a photo from any content form and it will appear here." />
        ) : (
          <MediaGrid initialFiles={files} />
        )}
      </div>
    </Container>
  );
}
