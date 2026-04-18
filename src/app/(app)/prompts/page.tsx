import type { Metadata } from "next";
import Link from "next/link";
import { getDb } from "@/db";
import { prompts, profiles } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PROMPT_CATEGORIES } from "@/lib/constants";
import { Sparkles, Star, GitFork } from "lucide-react";

export const metadata: Metadata = { title: "프롬프트 라이브러리" };

export default async function PromptsPage() {
  const db = getDb();
  const rows = await db
    .select({ p: prompts, a: profiles })
    .from(prompts)
    .leftJoin(profiles, eq(profiles.userId, prompts.authorId))
    .where(eq(prompts.isPublic, true))
    .orderBy(desc(prompts.favoriteCount))
    .limit(30)
    .catch(() => []);

  return (
    <div className="container-page py-8">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Badge variant="secondary">
            <Sparkles className="mr-1 size-3" /> AI 네이티브
          </Badge>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">프롬프트 라이브러리</h1>
          <p className="mt-1 text-muted-foreground">
            교실에서 검증된 Claude · GPT · Gemini 프롬프트. 포크해서 내 수업에 맞게 수정하세요.
          </p>
        </div>
        <Button asChild>
          <Link href="/prompts/new">프롬프트 공유하기</Link>
        </Button>
      </header>

      <div className="mb-6 flex flex-wrap gap-2">
        {PROMPT_CATEGORIES.map((c) => (
          <Link
            key={c.slug}
            href={`/prompts?cat=${c.slug}`}
            className="rounded-full border bg-card px-3 py-1.5 text-sm text-muted-foreground hover:border-primary/40 hover:text-foreground"
          >
            {c.label}
          </Link>
        ))}
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border bg-card p-14 text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-accent/20 text-3xl">
            ✨
          </div>
          <h3 className="text-xl font-semibold">첫 번째 프롬프트의 주인공이 되어 주세요</h3>
          <p className="mx-auto mt-2 max-w-md text-muted-foreground">
            동료 교사에게 도움이 될 프롬프트 하나로 충분합니다.
          </p>
          <Button asChild className="mt-5">
            <Link href="/prompts/new">프롬프트 공유하기</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {rows.map(({ p, a }) => (
            <Card key={p.id} className="group transition hover:-translate-y-0.5 hover:shadow-md">
              <Link href={`/prompts/${p.id}`}>
                <CardContent className="flex h-full flex-col p-5">
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="text-xs">
                      {p.targetModel}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {p.category}
                    </Badge>
                  </div>
                  <h3 className="mt-3 font-semibold leading-snug group-hover:text-primary">
                    {p.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {p.description}
                  </p>
                  <div className="mt-auto flex items-center gap-4 pt-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Star className="size-3" /> {p.favoriteCount}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <GitFork className="size-3" /> {p.forkCount}
                    </span>
                    {a?.username ? <span className="ml-auto">@{a.username}</span> : null}
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
