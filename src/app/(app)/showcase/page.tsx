import type { Metadata } from "next";
import Link from "next/link";
import { getDb } from "@/db";
import { showcaseProducts, profiles } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowBigUp, MessageSquare, ExternalLink } from "lucide-react";
import { SHOWCASE_CATEGORIES } from "@/lib/constants";

export const metadata: Metadata = { title: "메이커 쇼케이스" };

export default async function ShowcasePage() {
  const db = getDb();
  const rows = await db
    .select({
      p: showcaseProducts,
      m: profiles,
    })
    .from(showcaseProducts)
    .leftJoin(profiles, eq(profiles.userId, showcaseProducts.makerId))
    .where(and(eq(showcaseProducts.status, "launched")))
    .orderBy(desc(showcaseProducts.upvoteCount))
    .limit(24)
    .catch(() => []);

  return (
    <div className="container-page py-8">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Badge variant="secondary">매주 월요일 새 런치</Badge>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">메이커 쇼케이스</h1>
          <p className="mt-1 text-muted-foreground">
            선생님들이 직접 만든 앱과 SaaS. 업보트로 응원해 주세요.
          </p>
        </div>
        <Button asChild>
          <Link href="/showcase/submit">내 앱 제출하기</Link>
        </Button>
      </header>

      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/showcase"
          className="rounded-full border bg-card px-3 py-1.5 text-sm font-medium hover:border-primary/40"
        >
          전체
        </Link>
        {SHOWCASE_CATEGORIES.map((c) => (
          <Link
            key={c.slug}
            href={`/showcase?cat=${c.slug}`}
            className="rounded-full border bg-card px-3 py-1.5 text-sm text-muted-foreground hover:border-primary/40 hover:text-foreground"
          >
            {c.label}
          </Link>
        ))}
      </div>

      {rows.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {rows.map(({ p, m }) => (
            <Card key={p.id} className="overflow-hidden">
              <Link href={`/showcase/${p.slug}`} className="block">
                <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-primary/20 via-accent/10 to-background">
                  {p.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.logoUrl} alt={p.name} className="size-20 object-contain" />
                  ) : (
                    <span className="text-5xl">🛠️</span>
                  )}
                </div>
              </Link>
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <Link href={`/showcase/${p.slug}`}>
                      <h3 className="truncate font-semibold">{p.name}</h3>
                    </Link>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {p.tagline}
                    </p>
                  </div>
                  <div className="flex flex-col items-center rounded-md border bg-muted/40 px-2.5 py-1.5">
                    <ArrowBigUp className="size-3.5 text-primary" />
                    <span className="text-sm font-bold">{p.upvoteCount}</span>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                  {m?.username ? (
                    <Link href={`/u/${m.username}`} className="hover:text-foreground">
                      @{m.username}
                    </Link>
                  ) : null}
                  <span className="inline-flex items-center gap-1">
                    <MessageSquare className="size-3" /> {p.commentCount}
                  </span>
                  {p.websiteUrl ? (
                    <a
                      href={p.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="ml-auto inline-flex items-center gap-1 hover:text-foreground"
                    >
                      <ExternalLink className="size-3" /> 방문
                    </a>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border bg-card p-14 text-center">
      <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10 text-3xl">
        🚀
      </div>
      <h3 className="text-xl font-semibold">첫 번째 메이커가 되어 주세요</h3>
      <p className="mx-auto mt-2 max-w-md text-muted-foreground">
        당신이 만든 교육용 앱·SaaS를 동료 교사들에게 소개하세요. 매주 월요일 런치 데이에 공개됩니다.
      </p>
      <Button asChild className="mt-5">
        <Link href="/showcase/submit">내 앱 제출하기</Link>
      </Button>
    </div>
  );
}
