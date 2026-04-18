import { getDb } from "@/db";
import { posts, profiles } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils/date";

export default async function AdminPostsPage() {
  const db = getDb();
  const rows = await db
    .select({ p: posts, a: profiles })
    .from(posts)
    .leftJoin(profiles, eq(profiles.userId, posts.authorId))
    .orderBy(desc(posts.publishedAt))
    .limit(50)
    .catch(() => []);
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">게시글</h1>
      <ul className="mt-6 space-y-2">
        {rows.map(({ p, a }) => (
          <li key={p.id} className="rounded-md border bg-card p-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{p.status}</Badge>
              <Link href={`/posts/${p.slug}`} className="font-medium hover:text-primary">
                {p.title}
              </Link>
              <span className="ml-auto text-xs text-muted-foreground">
                {formatDateTime(p.publishedAt)}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              by {a?.displayName ?? "—"} · 👁 {p.viewCount} · 💬 {p.commentCount} · ▲ {p.voteScore}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
