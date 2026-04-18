import type { Metadata } from "next";
import Link from "next/link";
import { getDb } from "@/db";
import { tags } from "@/db/schema";
import { desc } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "태그" };

export default async function TagsPage() {
  const db = getDb();
  const rows = await db
    .select()
    .from(tags)
    .orderBy(desc(tags.postCount))
    .limit(200)
    .catch(() => []);
  return (
    <div className="container-page py-8">
      <h1 className="text-3xl font-bold tracking-tight">태그</h1>
      <p className="mt-1 text-muted-foreground">관심있는 주제를 골라 보세요</p>
      {rows.length === 0 ? (
        <p className="mt-12 rounded-xl border bg-card p-12 text-center text-muted-foreground">
          아직 태그가 없습니다.
        </p>
      ) : (
        <div className="mt-8 flex flex-wrap gap-2">
          {rows.map((t) => (
            <Link
              key={t.id}
              href={`/tags/${t.slug}`}
              className="rounded-full border bg-card px-4 py-2 text-sm transition hover:border-primary/40 hover:bg-primary/5"
            >
              <span className="font-medium">#{t.name}</span>
              <span className="ml-2 text-xs text-muted-foreground">{t.postCount}</span>
              {t.isFeatured ? (
                <Badge variant="outline" className="ml-2 text-[9px]">
                  추천
                </Badge>
              ) : null}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
