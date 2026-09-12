"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { X, Plus } from "lucide-react";
import { practiceAreaSchema, type PracticeAreaFormValues } from "@/lib/validations/practice-area";
import { Input, Textarea, Label, FieldError } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/admin/image-uploader";
import type { Lawyer } from "@/lib/types";

export function PracticeAreaForm({
  lawyers,
  defaultValues,
  practiceAreaId,
}: {
  lawyers: Lawyer[];
  defaultValues?: Partial<PracticeAreaFormValues> & { imageUrl?: string | null };
  practiceAreaId?: string;
}) {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string | null>(defaultValues?.imageUrl ?? null);
  const [serviceInput, setServiceInput] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<PracticeAreaFormValues>({
    resolver: zodResolver(practiceAreaSchema),
    defaultValues: { published: false, services: [], lawyerIds: [], ...defaultValues },
  });

  const onSubmit = async (values: PracticeAreaFormValues) => {
    const res = await fetch(practiceAreaId ? `/api/admin/practice-areas/${practiceAreaId}` : "/api/admin/practice-areas", {
      method: practiceAreaId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, imageUrl }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) return toast.error(body.error ?? "Something went wrong.");
    toast.success(practiceAreaId ? "Practice area updated." : "Practice area added.");
    router.push("/admin/practice-areas");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10" noValidate>
      <section className="border border-line bg-white p-6">
        <h2 className="font-display text-lg text-ink">Basic Information</h2>
        <div className="mt-5 space-y-5">
          <div>
            <Label htmlFor="name" required>Name</Label>
            <Input id="name" {...register("name")} />
            <FieldError message={errors.name?.message} />
          </div>
          <div>
            <Label htmlFor="shortDescription" required>Short Description</Label>
            <Textarea id="shortDescription" rows={2} {...register("shortDescription")} />
            <FieldError message={errors.shortDescription?.message} />
          </div>
          <div>
            <Label htmlFor="fullDescription">Full Description</Label>
            <Textarea id="fullDescription" rows={5} {...register("fullDescription")} />
          </div>
          <ImageUploader value={imageUrl} onChange={setImageUrl} folder="practice-areas" label="Featured Image" />
        </div>
      </section>

      <section className="border border-line bg-white p-6">
        <h2 className="font-display text-lg text-ink">Our Services</h2>
        <Controller
          control={control}
          name="services"
          render={({ field }) => (
            <div className="mt-4">
              <div className="flex gap-2">
                <Input
                  value={serviceInput}
                  onChange={(e) => setServiceInput(e.target.value)}
                  placeholder="e.g. Contract drafting"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (serviceInput.trim()) {
                        field.onChange([...(field.value ?? []), serviceInput.trim()]);
                        setServiceInput("");
                      }
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    if (serviceInput.trim()) {
                      field.onChange([...(field.value ?? []), serviceInput.trim()]);
                      setServiceInput("");
                    }
                  }}
                >
                  <Plus size={16} />
                </Button>
              </div>
              <ul className="mt-3 flex flex-wrap gap-2">
                {(field.value ?? []).map((service, i) => (
                  <li key={i} className="flex items-center gap-2 rounded-sm bg-surface px-3 py-1.5 text-sm text-ink">
                    {service}
                    <button type="button" onClick={() => field.onChange(field.value.filter((_, idx) => idx !== i))}>
                      <X size={12} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        />
      </section>

      <section className="border border-line bg-white p-6">
        <h2 className="font-display text-lg text-ink">Related Lawyers</h2>
        <Controller
          control={control}
          name="lawyerIds"
          render={({ field }) => (
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {lawyers.map((l) => (
                <label key={l.id} className="flex items-center gap-2 text-sm text-ink">
                  <input
                    type="checkbox"
                    checked={field.value?.includes(l.id)}
                    onChange={(e) => {
                      const set = new Set(field.value ?? []);
                      e.target.checked ? set.add(l.id) : set.delete(l.id);
                      field.onChange(Array.from(set));
                    }}
                  />
                  {l.name}
                </label>
              ))}
            </div>
          )}
        />
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
        </div>
      </section>

      <section className="border border-line bg-white p-6">
        <label className="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" {...register("published")} /> Published (visible on the website)
        </label>
      </section>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="ghost" onClick={() => router.push("/admin/practice-areas")}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving…" : practiceAreaId ? "Save Changes" : "Add Practice Area"}</Button>
      </div>
    </form>
  );
}
