"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { testimonialSchema, type TestimonialFormValues } from "@/lib/validations/misc";
import { Input, Textarea, Label, FieldError } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/admin/image-uploader";

export function TestimonialForm({
  defaultValues,
  testimonialId,
}: {
  defaultValues?: Partial<TestimonialFormValues> & { imageUrl?: string | null };
  testimonialId?: string;
}) {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string | null>(defaultValues?.imageUrl ?? null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: { published: false, featured: false, isAnonymous: false, ...defaultValues },
  });

  const isAnonymous = watch("isAnonymous");

  const onSubmit = async (values: TestimonialFormValues) => {
    const res = await fetch(testimonialId ? `/api/admin/testimonials/${testimonialId}` : "/api/admin/testimonials", {
      method: testimonialId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, imageUrl }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) return toast.error(body.error ?? "Something went wrong.");
    toast.success(testimonialId ? "Testimonial updated." : "Testimonial added.");
    router.push("/admin/testimonials");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 border border-line bg-white p-6" noValidate>
      <label className="flex items-center gap-2 text-sm text-ink">
        <input type="checkbox" {...register("isAnonymous")} /> Display anonymously (e.g. &quot;Founder, Technology Startup&quot;)
      </label>

      <div>
        <Label htmlFor="clientName" required>{isAnonymous ? "Anonymous Label" : "Client Name"}</Label>
        <Input id="clientName" {...register("clientName")} placeholder={isAnonymous ? "e.g. Founder, Technology Startup" : "e.g. Jane Doe"} />
        <FieldError message={errors.clientName?.message} />
      </div>

      <div>
        <Label htmlFor="testimonial" required>Testimonial</Label>
        <Textarea id="testimonial" rows={4} {...register("testimonial")} />
        <FieldError message={errors.testimonial?.message} />
      </div>

      <div>
        <Label htmlFor="companyPosition">Company / Position</Label>
        <Input id="companyPosition" {...register("companyPosition")} />
      </div>

      <ImageUploader value={imageUrl} onChange={setImageUrl} folder="testimonials" label="Photo (optional)" />

      <div>
        <Label htmlFor="dateGiven">Date</Label>
        <Input id="dateGiven" type="date" {...register("dateGiven")} />
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" {...register("published")} /> Published
        </label>
        <label className="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" {...register("featured")} /> Featured on homepage
        </label>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="ghost" onClick={() => router.push("/admin/testimonials")}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving…" : testimonialId ? "Save Changes" : "Add Testimonial"}</Button>
      </div>
    </form>
  );
}
