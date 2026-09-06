"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { ImageUploader } from "@/components/admin/image-uploader";
import { Button } from "@/components/ui/button";

const PAGE_LABELS: Record<string, string> = {
  about: "About Us",
  team: "Our Team",
  contact: "Contact Us",
  "practice-areas": "Practice Areas",
  insights: "Legal Insights",
  faq: "FAQ",
  consultation: "Request a Consultation",
};

type PageHero = { pageKey: string; imageUrl: string | null };

function PageHeroRow({ pageKey, initialImageUrl }: { pageKey: string; initialImageUrl: string | null }) {
  const [imageUrl, setImageUrl] = useState<string | null>(initialImageUrl);
  const [saving, setSaving] = useState(false);
  const dirty = imageUrl !== initialImageUrl;

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/page-heroes/${pageKey}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? "Something went wrong.");
      toast.success(`${PAGE_LABELS[pageKey] ?? pageKey} hero image saved.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border border-line bg-white p-6">
      <ImageUploader
        label={PAGE_LABELS[pageKey] ?? pageKey}
        value={imageUrl}
        onChange={setImageUrl}
        folder="general"
      />
      <Button type="button" size="sm" onClick={handleSave} disabled={!dirty || saving}>
        {saving ? "Saving…" : "Save"}
      </Button>
    </div>
  );
}

export function PageHeroesForm({ initialPageHeroes }: { initialPageHeroes: PageHero[] }) {
  return (
    <div className="space-y-5">
      {initialPageHeroes.map((hero) => (
        <PageHeroRow key={hero.pageKey} pageKey={hero.pageKey} initialImageUrl={hero.imageUrl} />
      ))}
    </div>
  );
}
