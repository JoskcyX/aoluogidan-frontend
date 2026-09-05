"use client";

import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { X, Plus } from "lucide-react";
import { aboutContentSchema, type AboutContentFormValues } from "@/lib/validations/misc";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function AboutEditorForm({ defaultValues }: { defaultValues: AboutContentFormValues }) {
  const { register, handleSubmit, control, formState: { isSubmitting } } = useForm<AboutContentFormValues>({
    resolver: zodResolver(aboutContentSchema),
    defaultValues,
  });

  const coreValues = useFieldArray({ control, name: "coreValues" });
  const whyChoose = useFieldArray({ control, name: "whyChooseUsItems" });

  const onSubmit = async (values: AboutContentFormValues) => {
    const res = await fetch("/api/admin/about", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) return toast.error(body.error ?? "Something went wrong.");
    toast.success("About page updated.");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
      <section className="space-y-5 border border-line bg-white p-6">
        <div><Label htmlFor="introHeading" required>Heading</Label><Input id="introHeading" {...register("introHeading")} /></div>
        <div><Label htmlFor="introText">Introduction</Label><Textarea id="introText" rows={3} {...register("introText")} /></div>
        <div><Label htmlFor="historyText">History</Label><Textarea id="historyText" rows={3} {...register("historyText")} /></div>
        <div><Label htmlFor="missionText">Mission</Label><Textarea id="missionText" rows={2} {...register("missionText")} /></div>
        <div><Label htmlFor="visionText">Vision</Label><Textarea id="visionText" rows={2} {...register("visionText")} /></div>
        <div><Label htmlFor="approachText">Our Approach</Label><Textarea id="approachText" rows={3} {...register("approachText")} /></div>
        <div><Label htmlFor="whyClientsText">Why Clients Choose Us</Label><Textarea id="whyClientsText" rows={3} {...register("whyClientsText")} /></div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div><Label htmlFor="ctaText">CTA Button Text</Label><Input id="ctaText" {...register("ctaText")} /></div>
          <div><Label htmlFor="ctaLink">CTA Button Link</Label><Input id="ctaLink" {...register("ctaLink")} /></div>
        </div>
      </section>

      <section className="border border-line bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg text-ink">Core Values</h2>
          <Button type="button" size="sm" variant="secondary" onClick={() => coreValues.append({ title: "", description: "" })}>
            <Plus size={14} className="mr-1" /> Add Value
          </Button>
        </div>
        <div className="mt-4 space-y-4">
          {coreValues.fields.map((field, i) => (
            <div key={field.id} className="flex gap-3 border border-line p-4">
              <div className="flex-1 space-y-2">
                <Input placeholder="Title" {...register(`coreValues.${i}.title`)} />
                <Textarea placeholder="Description" rows={2} {...register(`coreValues.${i}.description`)} />
              </div>
              <button type="button" onClick={() => coreValues.remove(i)} className="text-slate hover:text-red-600"><X size={16} /></button>
            </div>
          ))}
        </div>
      </section>

      <section className="border border-line bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg text-ink">Why Choose Us</h2>
          <Button type="button" size="sm" variant="secondary" onClick={() => whyChoose.append({ title: "", description: "", iconName: "shield-check" })}>
            <Plus size={14} className="mr-1" /> Add Item
          </Button>
        </div>
        <div className="mt-4 space-y-4">
          {whyChoose.fields.map((field, i) => (
            <div key={field.id} className="flex gap-3 border border-line p-4">
              <div className="flex-1 space-y-2">
                <Input placeholder="Title" {...register(`whyChooseUsItems.${i}.title`)} />
                <Textarea placeholder="Description" rows={2} {...register(`whyChooseUsItems.${i}.description`)} />
              </div>
              <button type="button" onClick={() => whyChoose.remove(i)} className="text-slate hover:text-red-600"><X size={16} /></button>
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving…" : "Save About Page"}</Button>
      </div>
    </form>
  );
}
