"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { faqSchema, type FaqFormValues } from "@/lib/validations/misc";
import { Input, Textarea, Label, FieldError, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { PracticeArea } from "@/lib/types";

export function FaqForm({
  practiceAreas,
  defaultValues,
  faqId,
}: {
  practiceAreas: PracticeArea[];
  defaultValues?: Partial<FaqFormValues>;
  faqId?: string;
}) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FaqFormValues>({ resolver: zodResolver(faqSchema), defaultValues: { published: true, ...defaultValues } });

  const onSubmit = async (values: FaqFormValues) => {
    const res = await fetch(faqId ? `/api/admin/faqs/${faqId}` : "/api/admin/faqs", {
      method: faqId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) return toast.error(body.error ?? "Something went wrong.");
    toast.success(faqId ? "FAQ updated." : "FAQ added.");
    router.push("/admin/faqs");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 border border-line bg-white p-6" noValidate>
      <div>
        <Label htmlFor="question" required>Question</Label>
        <Input id="question" {...register("question")} />
        <FieldError message={errors.question?.message} />
      </div>
      <div>
        <Label htmlFor="answer" required>Answer</Label>
        <Textarea id="answer" rows={5} {...register("answer")} />
        <FieldError message={errors.answer?.message} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="category">Category</Label>
          <Input id="category" {...register("category")} placeholder="e.g. General" />
        </div>
        <div>
          <Label htmlFor="practiceAreaId">Related Practice Area</Label>
          <Select id="practiceAreaId" {...register("practiceAreaId")}>
            <option value="">None</option>
            {practiceAreas.map((pa) => <option key={pa.id} value={pa.id}>{pa.name}</option>)}
          </Select>
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm text-ink">
        <input type="checkbox" {...register("published")} /> Published
      </label>
      <div className="flex justify-end gap-3">
        <Button type="button" variant="ghost" onClick={() => router.push("/admin/faqs")}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving…" : faqId ? "Save Changes" : "Add FAQ"}</Button>
      </div>
    </form>
  );
}
