"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import { blogPostSchema, type BlogPostFormValues } from "@/lib/validations/blog-post";
import { Input, Textarea, Label, FieldError, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/admin/image-uploader";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import type { BlogCategory } from "@/lib/types";

export function BlogPostForm({
  categories,
  defaultValues,
  postId,
}: {
  categories: BlogCategory[];
  defaultValues?: Partial<BlogPostFormValues> & { featuredImageUrl?: string | null };
  postId?: string;
}) {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string | null>(defaultValues?.featuredImageUrl ?? null);
  const [tagInput, setTagInput] = useState("");

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: { status: "DRAFT", tagNames: [], content: "", ...defaultValues },
  });

  const submit = async (values: BlogPostFormValues, status: "DRAFT" | "PUBLISHED") => {
    const payload = { ...values, status, featuredImageUrl: imageUrl };
    const res = await fetch(postId ? `/api/admin/blog/${postId}` : "/api/admin/blog", {
      method: postId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) return toast.error(body.error ?? "Something went wrong.");
    toast.success(status === "PUBLISHED" ? "Article published." : "Draft saved.");
    router.push("/admin/blog");
    router.refresh();
  };

  return (
    <form className="space-y-8" noValidate>
      <section className="border border-line bg-white p-6">
        <div>
          <Label htmlFor="title" required>Title</Label>
          <Input id="title" {...register("title")} />
          <FieldError message={errors.title?.message} />
        </div>
        <div className="mt-5">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea id="excerpt" rows={2} {...register("excerpt")} placeholder="Shown on listing cards and search results." />
        </div>
        <div className="mt-5">
          <ImageUploader value={imageUrl} onChange={setImageUrl} folder="blog" label="Featured Image" />
        </div>
      </section>

      <section>
        <Label htmlFor="content" required>Content</Label>
        <Controller
          control={control}
          name="content"
          render={({ field }) => <RichTextEditor value={field.value} onChange={field.onChange} />}
        />
        <FieldError message={errors.content?.message} />
      </section>

      <section className="border border-line bg-white p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="categoryId">Category</Label>
            <Select id="categoryId" {...register("categoryId")}>
              <option value="">None</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </div>
          <Controller
            control={control}
            name="tagNames"
            render={({ field }) => (
              <div>
                <Label htmlFor="tagInput">Tags</Label>
                <Input
                  id="tagInput"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Type a tag and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (tagInput.trim()) {
                        field.onChange([...(field.value ?? []), tagInput.trim()]);
                        setTagInput("");
                      }
                    }
                  }}
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {(field.value ?? []).map((tag, i) => (
                    <span key={i} className="flex items-center gap-1 rounded-sm bg-surface px-2 py-1 text-xs text-ink">
                      {tag}
                      <button type="button" onClick={() => field.onChange(field.value.filter((_, idx) => idx !== i))}><X size={10} /></button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          />
        </div>
      </section>

      <section className="border border-line bg-white p-6">
        <h2 className="font-display text-lg text-ink">SEO</h2>
        <div className="mt-5 space-y-5">
          <div>
            <Label htmlFor="seoTitle">SEO Title</Label>
            <Input id="seoTitle" {...register("seoTitle")} />
          </div>
          <div>
            <Label htmlFor="seoDescription">SEO Description</Label>
            <Textarea id="seoDescription" rows={2} {...register("seoDescription")} />
          </div>
          <div>
            <Label htmlFor="canonicalUrl">Canonical URL</Label>
            <Input id="canonicalUrl" {...register("canonicalUrl")} />
            <FieldError message={errors.canonicalUrl?.message} />
          </div>
        </div>
      </section>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="ghost" onClick={() => router.push("/admin/blog")}>Cancel</Button>
        <Button type="button" variant="secondary" disabled={isSubmitting} onClick={handleSubmit((v) => submit(v, "DRAFT"))}>
          {isSubmitting ? "Saving…" : "Save Draft"}
        </Button>
        <Button type="button" disabled={isSubmitting} onClick={handleSubmit((v) => submit(v, "PUBLISHED"))}>
          {isSubmitting ? "Publishing…" : "Publish"}
        </Button>
      </div>
    </form>
  );
}
