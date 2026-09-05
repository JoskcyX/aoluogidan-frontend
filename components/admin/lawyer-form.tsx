"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { lawyerSchema, type LawyerFormValues } from "@/lib/validations/lawyer";
import { Input, Textarea, Label, FieldError } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/admin/image-uploader";
import type { PracticeArea } from "@/lib/types";

export function LawyerForm({
  practiceAreas,
  defaultValues,
  lawyerId,
}: {
  practiceAreas: PracticeArea[];
  defaultValues?: Partial<LawyerFormValues> & { photoUrl?: string | null };
  lawyerId?: string;
}) {
  const router = useRouter();
  const [photoUrl, setPhotoUrl] = useState<string | null>(defaultValues?.photoUrl ?? null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LawyerFormValues>({
    resolver: zodResolver(lawyerSchema),
    defaultValues: {
      published: false,
      featuredHome: false,
      practiceAreaIds: [],
      ...defaultValues,
    },
  });

  const onSubmit = async (values: LawyerFormValues) => {
    const payload = { ...values, photoUrl };

    const res = await fetch(lawyerId ? `/api/admin/lawyers/${lawyerId}` : "/api/admin/lawyers", {
      method: lawyerId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      toast.error(body.error ?? "Something went wrong.");
      return;
    }

    toast.success(lawyerId ? "Lawyer updated." : "Lawyer added.");
    router.push("/admin/lawyers");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10" noValidate>
      <section className="border border-line bg-white p-6">
        <h2 className="font-display text-lg text-ink">Basic Information</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="name" required>Full Name</Label>
            <Input id="name" {...register("name")} />
            <FieldError message={errors.name?.message} />
          </div>
          <div>
            <Label htmlFor="position" required>Position</Label>
            <Input id="position" {...register("position")} placeholder="e.g. Managing Partner" />
            <FieldError message={errors.position?.message} />
          </div>
        </div>

        <div className="mt-5">
          <ImageUploader value={photoUrl} onChange={setPhotoUrl} folder="lawyers" label="Profile Photograph" />
        </div>

        <div className="mt-5">
          <Label htmlFor="bioShort">Short Bio</Label>
          <Textarea id="bioShort" rows={2} {...register("bioShort")} placeholder="One or two sentences shown on listing cards." />
          <FieldError message={errors.bioShort?.message} />
        </div>

        <div className="mt-5">
          <Label htmlFor="bio">Full Biography</Label>
          <Textarea id="bio" rows={6} {...register("bio")} />
        </div>
      </section>

      <section className="border border-line bg-white p-6">
        <h2 className="font-display text-lg text-ink">Credentials</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="education">Education (one per line)</Label>
            <Textarea id="education" rows={3} {...register("education")} />
          </div>
          <div>
            <Label htmlFor="qualifications">Qualifications</Label>
            <Textarea id="qualifications" rows={3} {...register("qualifications")} />
          </div>
          <div>
            <Label htmlFor="experienceYears">Years of Experience</Label>
            <Input id="experienceYears" type="number" min={0} {...register("experienceYears")} />
          </div>
          <div>
            <Label htmlFor="languages">Languages (comma separated)</Label>
            <Input id="languages" {...register("languages")} placeholder="English, Spanish" />
          </div>
          <div>
            <Label htmlFor="memberships">Professional Memberships (one per line)</Label>
            <Textarea id="memberships" rows={2} {...register("memberships")} />
          </div>
          <div>
            <Label htmlFor="awards">Awards</Label>
            <Textarea id="awards" rows={2} {...register("awards")} />
          </div>
        </div>
      </section>

      <section className="border border-line bg-white p-6">
        <h2 className="font-display text-lg text-ink">Practice Areas</h2>
        <Controller
          control={control}
          name="practiceAreaIds"
          render={({ field }) => (
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {practiceAreas.map((pa) => (
                <label key={pa.id} className="flex items-center gap-2 text-sm text-ink">
                  <input
                    type="checkbox"
                    checked={field.value?.includes(pa.id)}
                    onChange={(e) => {
                      const set = new Set(field.value ?? []);
                      e.target.checked ? set.add(pa.id) : set.delete(pa.id);
                      field.onChange(Array.from(set));
                    }}
                  />
                  {pa.name}
                </label>
              ))}
            </div>
          )}
        />
      </section>

      <section className="border border-line bg-white p-6">
        <h2 className="font-display text-lg text-ink">Contact & Links</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
            <FieldError message={errors.email?.message} />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" {...register("phone")} />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
            <Input id="linkedinUrl" {...register("linkedinUrl")} placeholder="https://linkedin.com/in/…" />
            <FieldError message={errors.linkedinUrl?.message} />
          </div>
        </div>
      </section>

      <section className="border border-line bg-white p-6">
        <h2 className="font-display text-lg text-ink">SEO</h2>
        <div className="mt-5 grid gap-5">
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
        <h2 className="font-display text-lg text-ink">Visibility</h2>
        <div className="mt-4 flex flex-col gap-3">
          <label className="flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" {...register("published")} /> Published (visible on the website)
          </label>
          <label className="flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" {...register("featuredHome")} /> Feature on homepage
          </label>
        </div>
      </section>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="ghost" onClick={() => router.push("/admin/lawyers")}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : lawyerId ? "Save Changes" : "Add Lawyer"}
        </Button>
      </div>
    </form>
  );
}
