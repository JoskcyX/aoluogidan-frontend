"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { settingsSchema, type SettingsFormValues } from "@/lib/validations/misc";
import { Input, Textarea, Label, FieldError } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/admin/image-uploader";
import type { SiteSettings } from "@/lib/types";

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(settings.heroImageUrl ?? null);
  const [heroImageUrl2, setHeroImageUrl2] = useState<string | null>(settings.heroImageUrl2 ?? null);
  const [heroImageUrl3, setHeroImageUrl3] = useState<string | null>(settings.heroImageUrl3 ?? null);
  const [heroImageUrl4, setHeroImageUrl4] = useState<string | null>(settings.heroImageUrl4 ?? null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SettingsFormValues>({ resolver: zodResolver(settingsSchema), defaultValues: settings });

  const onSubmit = async (values: SettingsFormValues) => {
    const payload = { ...values, heroImageUrl, heroImageUrl2, heroImageUrl3, heroImageUrl4 };
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) return toast.error(body.error ?? "Something went wrong.");
    toast.success("Settings saved. Changes are live on the website.");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10" noValidate>
      <section className="border border-line bg-white p-6">
        <h2 className="font-display text-lg text-ink">Firm Information</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="firmName" required>Firm Name</Label>
            <Input id="firmName" {...register("firmName")} />
            <FieldError message={errors.firmName?.message} />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="tagline">Tagline</Label>
            <Input id="tagline" {...register("tagline")} />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="description">Firm Description</Label>
            <Textarea id="description" rows={3} {...register("description")} />
          </div>
        </div>
      </section>

      <section className="border border-line bg-white p-6">
        <h2 className="font-display text-lg text-ink">Contact</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="email" required>Email</Label>
            <Input id="email" type="email" {...register("email")} />
            <FieldError message={errors.email?.message} />
          </div>
          <div>
            <Label htmlFor="phone" required>Phone</Label>
            <Input id="phone" {...register("phone")} />
          </div>
          <div>
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input id="whatsapp" {...register("whatsapp")} />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="address">Office Address</Label>
            <Textarea id="address" rows={2} {...register("address")} />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="workingHours">Working Hours</Label>
            <Textarea id="workingHours" rows={3} {...register("workingHours")} />
          </div>
        </div>
      </section>

      <section className="border border-line bg-white p-6">
        <h2 className="font-display text-lg text-ink">Social Media</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div><Label htmlFor="socialLinkedin">LinkedIn</Label><Input id="socialLinkedin" {...register("socialLinkedin")} /></div>
          <div><Label htmlFor="socialFacebook">Facebook</Label><Input id="socialFacebook" {...register("socialFacebook")} /></div>
          <div><Label htmlFor="socialInstagram">Instagram</Label><Input id="socialInstagram" {...register("socialInstagram")} /></div>
          <div><Label htmlFor="socialX">X (Twitter)</Label><Input id="socialX" {...register("socialX")} /></div>
          <div><Label htmlFor="socialYoutube">YouTube</Label><Input id="socialYoutube" {...register("socialYoutube")} /></div>
        </div>
      </section>

      <section className="border border-line bg-white p-6">
        <h2 className="font-display text-lg text-ink">Homepage</h2>
        <div className="mt-5 grid gap-5">
          <div>
            <Label htmlFor="heroHeading" required>Hero Heading</Label>
            <Input id="heroHeading" {...register("heroHeading")} />
          </div>
          <div>
            <Label htmlFor="heroSubheading">Hero Description</Label>
            <Textarea id="heroSubheading" rows={2} {...register("heroSubheading")} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div><Label htmlFor="heroCtaText">Primary Button Text</Label><Input id="heroCtaText" {...register("heroCtaText")} /></div>
            <div><Label htmlFor="heroCtaLink">Primary Button Link</Label><Input id="heroCtaLink" {...register("heroCtaLink")} /></div>
            <div><Label htmlFor="heroSecondaryCtaText">Secondary Button Text</Label><Input id="heroSecondaryCtaText" {...register("heroSecondaryCtaText")} /></div>
            <div><Label htmlFor="heroSecondaryCtaLink">Secondary Button Link</Label><Input id="heroSecondaryCtaLink" {...register("heroSecondaryCtaLink")} /></div>
          </div>
        </div>

        <h3 className="mt-8 text-sm font-semibold uppercase tracking-widest text-slate">Hero Photos</h3>
        <p className="mt-1 text-sm text-slate">
          Up to 4 photos shown as a collage behind the hero text. Leave any of these empty to show fewer.
        </p>
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <ImageUploader value={heroImageUrl} onChange={setHeroImageUrl} folder="general" label="Photo 1" />
          <ImageUploader value={heroImageUrl2} onChange={setHeroImageUrl2} folder="general" label="Photo 2" />
          <ImageUploader value={heroImageUrl3} onChange={setHeroImageUrl3} folder="general" label="Photo 3" />
          <ImageUploader value={heroImageUrl4} onChange={setHeroImageUrl4} folder="general" label="Photo 4" />
        </div>

        <h3 className="mt-8 text-sm font-semibold uppercase tracking-widest text-slate">Homepage Statistics</h3>
        <div className="mt-4 grid gap-5 sm:grid-cols-4">
          <div><Label htmlFor="statYearsExperience">Years of Experience</Label><Input id="statYearsExperience" type="number" {...register("statYearsExperience")} /></div>
          <div><Label htmlFor="statLawyersCount">Legal Professionals</Label><Input id="statLawyersCount" type="number" {...register("statLawyersCount")} /></div>
          <div><Label htmlFor="statPracticeAreasCount">Practice Areas</Label><Input id="statPracticeAreasCount" type="number" {...register("statPracticeAreasCount")} /></div>
          <div><Label htmlFor="statClientsServed">Clients Served</Label><Input id="statClientsServed" type="number" {...register("statClientsServed")} /></div>
        </div>
      </section>

      <section className="border border-line bg-white p-6">
        <h2 className="font-display text-lg text-ink">SEO</h2>
        <div className="mt-5 grid gap-5">
          <div><Label htmlFor="siteTitle" required>Site Title</Label><Input id="siteTitle" {...register("siteTitle")} /></div>
          <div><Label htmlFor="siteDescription">Site Description</Label><Textarea id="siteDescription" rows={2} {...register("siteDescription")} /></div>
          <div><Label htmlFor="googleVerification">Google Search Console Verification Code</Label><Input id="googleVerification" {...register("googleVerification")} /></div>
          <div><Label htmlFor="googleAnalyticsId">Google Analytics ID</Label><Input id="googleAnalyticsId" {...register("googleAnalyticsId")} placeholder="G-XXXXXXXXXX" /></div>
        </div>
      </section>

      <section className="border border-line bg-white p-6">
        <h2 className="font-display text-lg text-ink">Footer</h2>
        <div className="mt-5 grid gap-5">
          <div><Label htmlFor="footerDescription">Footer Description</Label><Textarea id="footerDescription" rows={2} {...register("footerDescription")} /></div>
          <div><Label htmlFor="copyrightText">Copyright Text</Label><Input id="copyrightText" {...register("copyrightText")} /></div>
        </div>
      </section>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving…" : "Save Settings"}</Button>
      </div>
    </form>
  );
}
