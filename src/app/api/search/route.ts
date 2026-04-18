import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { posts, profiles, categories } from "@/db/schema";
import { like, or, and, eq, desc } from "drizzle-orm";


export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") ?? "").trim();
  if (q.length < 2) return NextResponse.json({ results: [] });
  const db = getDb();
  const pat = `%${q}%`;
  const rows = await db
    .select({
      id: posts.id,
      slug: posts.slug,
      title: posts.title,
      excerpt: posts.excerpt,
      authorName: profiles.displayName,
      categoryName: categories.name,
      publishedAt: posts.publishedAt,
    })
    .from(posts)
    .leftJoin(profiles, eq(profiles.userId, posts.authorId))
    .innerJoin(categories, eq(categories.id, posts.categoryId))
    .where(
      and(
        eq(posts.status, "published"),
        or(like(posts.title, pat), like(posts.contentText, pat)),
      ),
    )
    .orderBy(desc(posts.publishedAt))
    .limit(20);
  return NextResponse.json({ results: rows });
}
