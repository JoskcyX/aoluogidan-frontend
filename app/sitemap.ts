import { MetadataRoute } from "next";
import { api } from "@/lib/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.SITE_URL ?? "http://localhost:3000";

  const staticRoutes = [
    "",
    "/about",
    "/practice-areas",
    "/team",
    "/insights",
    "/faq",
    "/contact",
    "/consultation",
    "/privacy-policy",
    "/terms",
    "/disclaimer",
  ].map((path) => ({ url: `${base}${path}`, lastModified: new Date() }));

  const { areas = [], team = [], posts = [] } = await api.getSitemapData().catch(() => ({
    areas: [],
    team: [],
    posts: [],
  }));

  return [
    ...staticRoutes,
    ...areas.map((a: any) => ({ url: `${base}/practice-areas/${a.slug}`, lastModified: a.updatedAt })),
    ...team.map((t: any) => ({ url: `${base}/team/${t.slug}`, lastModified: t.updatedAt })),
    ...posts.map((p: any) => ({ url: `${base}/insights/${p.slug}`, lastModified: p.updatedAt })),
  ];
}
