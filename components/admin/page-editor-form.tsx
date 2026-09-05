"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { pageContentSchema } from "@/lib/validations/misc";
import { Input, Textarea, Label, FieldError } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Page } from "@/lib/types";

export function PageEditorForm({ page }: { page: Page }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(pageContentSchema), defaultValues: { title: page.title, content: page.content } });

  const onSubmit = async (values: { title: string; content: string }) => {
    const res = await fetch(`/api/admin/pages/${page.slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) return toast.error(body.error ?? "Something went wrong.");
    toast.success("Page updated.");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 border border-line bg-white p-6" noValidate>
      <div>
        <Label htmlFor="title" required>Page Title</Label>
        <Input id="title" {...register("title")} />
        <FieldError message={errors.title?.message as string | undefined} />
      </div>
      <div>
        <Label htmlFor="content" required>Content (HTML)</Label>
        <Textarea id="content" rows={12} {...register("content")} />
        <p className="mt-1 text-xs text-slate">
          Basic HTML tags like &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt;/&lt;li&gt; are supported. This content should be reviewed and approved by the firm before publishing.
        </p>
        <FieldError message={errors.content?.message as string | undefined} />
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving…" : "Save Page"}</Button>
      </div>
    </form>
  );
}
