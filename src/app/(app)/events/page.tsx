import type { Metadata } from "next";
import Link from "next/link";
import { getDb } from "@/db";
import { events, profiles } from "@/db/schema";
import { asc, eq, gte } from "drizzle-orm";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Plus } from "lucide-react";
import { formatDateTime } from "@/lib/utils/date";

export const metadata: Metadata = { title: "이벤트" };

export default async function EventsPage() {
  const db = getDb();
  const now = new Date();
  const rows = await db
    .select({ e: events, o: profiles })
    .from(events)
    .leftJoin(profiles, eq(profiles.userId, events.organizerId))
    .where(gte(events.startAt, now))
    .orderBy(asc(events.startAt))
    .limit(30)
    .catch(() => []);

  return (
    <div className="container-page py-8">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">이벤트</h1>
          <p className="mt-1 text-muted-foreground">웨비나 · 워크숍 · 오프라인 모임</p>
        </div>
        <Button asChild>
          <Link href="/events/new">
            <Plus className="size-4" />
            이벤트 열기
          </Link>
        </Button>
      </header>

      {rows.length === 0 ? (
        <div className="rounded-2xl border bg-card p-14 text-center">
          <Calendar className="mx-auto size-10 text-muted-foreground" />
          <h3 className="mt-4 text-xl font-semibold">예정된 이벤트가 없어요</h3>
          <p className="mx-auto mt-2 max-w-md text-muted-foreground">
            학습공동체 세미나, AMA, 오프라인 모임을 기획해 보세요.
          </p>
          <Button asChild className="mt-5">
            <Link href="/events/new">이벤트 만들기</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {rows.map(({ e, o }) => (
            <Card key={e.id}>
              <Link href={`/events/${e.id}`}>
                <CardContent className="flex flex-col gap-4 p-5 md:flex-row">
                  <div className="flex w-full flex-col items-center justify-center rounded-lg bg-primary/5 py-4 md:w-28">
                    <span className="text-xs font-medium text-muted-foreground">
                      {new Date(e.startAt).toLocaleDateString("ko-KR", {
                        month: "short",
                      })}
                    </span>
                    <span className="text-3xl font-bold">
                      {new Date(e.startAt).getDate()}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(e.startAt).toLocaleTimeString("ko-KR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap gap-1.5">
                      <Badge variant="outline">{e.eventType}</Badge>
                      <Badge variant="outline">{e.locationType}</Badge>
                      {e.priceKrw === 0 ? <Badge variant="secondary">무료</Badge> : null}
                    </div>
                    <h3 className="mt-2 text-lg font-semibold">{e.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {e.description}
                    </p>
                    <p className="mt-3 text-xs text-muted-foreground">
                      {formatDateTime(e.startAt)} · 주최{" "}
                      {o?.displayName ?? "익명"} · 참가 {e.attendeeCount}명
                    </p>
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
