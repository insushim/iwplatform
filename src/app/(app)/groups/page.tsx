import type { Metadata } from "next";
import Link from "next/link";
import { getDb } from "@/db";
import { groups } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Users } from "lucide-react";
import { formatNumber } from "@/lib/utils/text";

export const metadata: Metadata = { title: "인디모임" };

export default async function GroupsPage() {
  const db = getDb();
  const rows = await db
    .select()
    .from(groups)
    .where(eq(groups.isPrivate, false))
    .orderBy(desc(groups.memberCount))
    .limit(40)
    .catch(() => []);

  return (
    <div className="container-page py-8">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">인디모임</h1>
          <p className="mt-1 text-muted-foreground">
            학습공동체, 관심사별 모임을 만들고 참여하세요.
          </p>
        </div>
        <Button asChild>
          <Link href="/groups/new">
            <Plus className="size-4" />
            모임 만들기
          </Link>
        </Button>
      </header>

      {rows.length === 0 ? (
        <div className="rounded-2xl border bg-card p-14 text-center">
          <Users className="mx-auto size-10 text-muted-foreground" />
          <h3 className="mt-4 text-xl font-semibold">첫 번째 모임을 열어 주세요</h3>
          <p className="mx-auto mt-2 max-w-md text-muted-foreground">
            AI 수업 연구회 · 메이커 클럽 · 교과 연구회 — 무엇이든 좋습니다.
          </p>
          <Button asChild className="mt-5">
            <Link href="/groups/new">모임 개설</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {rows.map((g) => (
            <Card key={g.id} className="transition hover:-translate-y-0.5 hover:shadow-md">
              <Link href={`/groups/${g.slug}`}>
                <div className="flex aspect-[2/1] items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                  {g.iconUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={g.iconUrl} alt={g.name} className="size-16 object-contain" />
                  ) : (
                    <span className="text-5xl">🏫</span>
                  )}
                </div>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold">{g.name}</h3>
                    {g.category ? (
                      <Badge variant="outline" className="text-xs">
                        {g.category}
                      </Badge>
                    ) : null}
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {g.description}
                  </p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    멤버 {formatNumber(g.memberCount)} · 글 {formatNumber(g.postCount)}
                  </p>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
