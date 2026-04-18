import type { Metadata } from "next";
import Link from "next/link";
import { getDb } from "@/db";
import { posts, profiles, categories } from "@/db/schema";
import { and, desc, eq, like, or } from "drizzle-orm";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search as SearchIcon } from "lucide-react";
import { timeAgo } from "@/lib/utils/date";

export const metadata: Metadata = { title: "검색" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim();

  let results: Awaited<ReturnType<typeof doSearch>> = [];
  if (query.length >= 2) results = await doSearch(query);

  return (
    <div className="container-reading py-8">
      <form action="/search" method="get" className="flex gap-2">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="q"
            defaultValue={query}
            placeholder="검색어 입력 (제목 · 본문)"
            className="pl-9"
            autoFocus
          />
        </div>
      </form>

      {query.length >= 2 ? (
        <>
          <p className="mt-4 text-sm text-muted-foreground">
            <strong className="text-foreground">&ldquo;{query}&rdquo;</strong> 결과 {results.length}개
          </p>
          <ul className="mt-4 space-y-3">
            {results.map((r) => (
              <li key={r.id}>
                <Link href={`/posts/${r.slug}`}>
                  <Card className="transition hover:border-primary/40">
                    <CardContent className="p-4">
                      <p className="text-xs text-muted-foreground">
                        {r.categoryName} · {r.authorName ?? "익명"} · {timeAgo(r.publishedAt)}
                      </p>
                      <p className="mt-1 font-medium">
                        <Highlight text={r.title} q={query} />
                      </p>
                      {r.excerpt ? (
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                          <Highlight text={r.excerpt} q={query} />
                        </p>
                      ) : null}
                    </CardContent>
                  </Card>
                </Link>
              </li>
            ))}
            {results.length === 0 ? (
              <li className="rounded-xl border bg-card p-12 text-center text-muted-foreground">
                일치하는 결과가 없어요.
              </li>
            ) : null}
          </ul>
        </>
      ) : (
        <p className="mt-6 text-sm text-muted-foreground">
          2자 이상 입력해 주세요.
        </p>
      )}
    </div>
  );
}

async function doSearch(q: string) {
  try {
    const db = getDb();
    const pat = `%${q}%`;
    return await db
      .select({
        id: posts.id,
        slug: posts.slug,
        title: posts.title,
        excerpt: posts.excerpt,
        publishedAt: posts.publishedAt,
        authorName: profiles.displayName,
        categoryName: categories.name,
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
      .limit(30);
  } catch {
    return [];
  }
}

function Highlight({ text, q }: { text: string; q: string }) {
  if (!q) return <>{text}</>;
  const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(re);
  return (
    <>
      {parts.map((p, i) =>
        p.toLowerCase() === q.toLowerCase() ? (
          <mark key={i} className="rounded bg-primary/20 px-0.5 text-foreground">
            {p}
          </mark>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}
