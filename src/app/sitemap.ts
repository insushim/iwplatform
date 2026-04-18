import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";
import { getDb } from "@/db";
import { posts, showcaseProducts, profiles } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url;
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/feed`, lastModified: now, changeFrequency: "hourly", priority: 0.9 },
    { url: `${base}/showcase`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/prompts`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${base}/leaderboard`, lastModified: now, changeFrequency: "daily", priority: 0.6 },
    { url: `${base}/tags`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
  ];

  try {
    const db = getDb();
    const [postRows, productRows, profileRows] = await Promise.all([
      db
        .select({ slug: posts.slug, updatedAt: posts.updatedAt })
        .from(posts)
        .where(eq(posts.status, "published"))
        .orderBy(desc(posts.publishedAt))
        .limit(1000),
      db
        .select({ slug: showcaseProducts.slug, updatedAt: showcaseProducts.updatedAt })
        .from(showcaseProducts)
        .where(eq(showcaseProducts.status, "launched"))
        .limit(500),
      db
        .select({ username: profiles.username, updatedAt: profiles.updatedAt })
        .from(profiles)
        .limit(1000),
    ]);

    return [
      ...staticRoutes,
      ...postRows.map((p) => ({
        url: `${base}/posts/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
      ...productRows.map((p) => ({
        url: `${base}/showcase/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),
      ...profileRows.map((p) => ({
        url: `${base}/u/${p.username}`,
        lastModified: p.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.4,
      })),
    ];
  } catch {
    return staticRoutes;
  }
}
