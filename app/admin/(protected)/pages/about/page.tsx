import { adminFetchJson } from "@/lib/api";
import { Container } from "@/components/ui/container";
import { AboutEditorForm } from "@/components/admin/about-editor-form";

export default async function AdminAboutPage() {
  const { about, coreValues: values = [], whyChooseUsItems: items = [] } = await adminFetchJson("/api/admin/about");

  if (!about) return null;

  return (
    <Container className="max-w-2xl px-0">
      <h1 className="font-display text-2xl text-ink">About Page Content</h1>
      <p className="mt-1 text-sm text-slate">Edit the text shown on your public About page and homepage.</p>
      <div className="mt-8">
        <AboutEditorForm
          defaultValues={{
            ...about,
            coreValues: values.map((v: any) => ({ title: v.title, description: v.description })),
            whyChooseUsItems: items.map((i: any) => ({ title: i.title, description: i.description, iconName: i.iconName })),
          }}
        />
      </div>
    </Container>
  );
}
