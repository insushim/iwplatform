import type { Metadata } from "next";
import Link from "next/link";
import { getDb } from "@/db";
import { bookmarks, posts } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { requireAuth } from "@/lib/auth/session";
import { Bookmark } from "lucide-react";

export const metadata: Metadata = { title: "북마크" };

export default async function BookmarksPage() {
  const { user } = await requireAuth();
  const db = getDb();
  const rows = await db
    .select({
      bookmarkedAt: bookmarks.createdAt,
      id: posts.id,
      slug: posts.slug,
      title: posts.title,
      excerpt: posts.excerpt,
    })
    .from(bookmarks)
    .innerJoin(posts, eq(posts.id, bookmarks.postId))
    .where(eq(bookmarks.userId, user.id))
    .orderBy(desc(bookmarks.createdAt))
    .limit(100)
    .catch(() => []);

  return (
    <div className="container-reading py-8">
      <h1 className="text-3xl font-bold tracking-tight">북마크</h1>
      {rows.length === 0 ? (
        <div className="mt-12 rounded-xl border bg-card p-12 text-center">
          <Bookmark className="mx-auto size-10 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">아직 저장한 글이 없습니다.</p>
        </div>
      ) : (
        <ul className="mt-6 space-y-2">
          {rows.map((r) => (
            <li key={r.id} className="rounded-md border bg-card p-4">
              <Link href={`/posts/${r.slug}`}>
                <p className="font-medium">{r.title}</p>
                {r.excerpt ? (
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{r.excerpt}</p>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
