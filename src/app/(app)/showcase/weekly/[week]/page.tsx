import Link from "next/link";
import { notFound } from "next/navigation";
import { getDb } from "@/db";
import { showcaseProducts, profiles } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/lib/utils/text";

export default async function WeeklyShowcasePage({
  params,
}: {
  params: Promise<{ week: string }>;
}) {
  const { week } = await params;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(week)) notFound();

  const db = getDb();
  const rows = await db
    .select({ p: showcaseProducts, m: profiles })
    .from(showcaseProducts)
    .leftJoin(profiles, eq(profiles.userId, showcaseProducts.makerId))
    .where(
      and(eq(showcaseProducts.launchWeek, week), eq(showcaseProducts.status, "launched")),
    )
    .orderBy(desc(showcaseProducts.upvoteCount))
    .limit(50)
    .catch(() => []);

  return (
    <div className="container-page py-8">
      <header className="mb-8">
        <Badge variant="secondary">주간 런치</Badge>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">
          {week} 주 런치 리더보드
        </h1>
        <p className="mt-1 text-muted-foreground">
          업보트 기준. 이번 주의 메이커들을 응원해 주세요.
        </p>
      </header>

      {rows.length === 0 ? (
        <p className="rounded-2xl border bg-card p-14 text-center text-muted-foreground">
          이 주에 런치된 앱이 없어요.
        </p>
      ) : (
        <ol className="space-y-3">
          {rows.map(({ p, m }, idx) => (
            <li key={p.id}>
              <Link href={`/showcase/${p.slug}`}>
                <Card className="transition hover:border-primary/40">
                  <CardContent className="flex items-center gap-4 p-5">
                    <span
                      className={`inline-flex size-10 shrink-0 items-center justify-center rounded-full text-xl font-bold ${
                        idx === 0
                          ? "bg-[#FFD700] text-black"
                          : idx === 1
                            ? "bg-[#C0C0C0] text-black"
                            : idx === 2
                              ? "bg-[#CD7F32] text-white"
                              : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {idx + 1}
                    </span>
                    {p.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.logoUrl} alt={p.name} className="size-12 rounded-lg border" />
                    ) : (
                      <div className="flex size-12 items-center justify-center rounded-lg border bg-muted text-2xl">
                        🛠️
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-semibold">{p.name}</h3>
                      <p className="truncate text-sm text-muted-foreground">{p.tagline}</p>
                      {m ? (
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          by @{m.username}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex flex-col items-center rounded-md border bg-muted/40 px-3 py-1.5">
                      <span className="text-xs text-muted-foreground">▲</span>
                      <span className="text-lg font-bold tabular-nums">
                        {formatNumber(p.upvoteCount)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
