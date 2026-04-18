import { getDb } from "@/db";
import { profiles, posts, reports, teacherVerifications, showcaseProducts } from "@/db/schema";
import { sql, eq } from "drizzle-orm";
import { Card, CardContent } from "@/components/ui/card";
import { Users, FileText, Flag, ShieldCheck, Rocket } from "lucide-react";

async function stat<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export default async function AdminDashboard() {
  const db = getDb();
  const [users, posts_, openReports, pendingVerif, launched] = await Promise.all([
    stat(
      async () =>
        (await db.select({ c: sql<number>`count(*)` }).from(profiles))[0]?.c ?? 0,
      0,
    ),
    stat(
      async () =>
        (await db.select({ c: sql<number>`count(*)` }).from(posts))[0]?.c ?? 0,
      0,
    ),
    stat(
      async () =>
        (
          await db
            .select({ c: sql<number>`count(*)` })
            .from(reports)
            .where(eq(reports.status, "pending"))
        )[0]?.c ?? 0,
      0,
    ),
    stat(
      async () =>
        (
          await db
            .select({ c: sql<number>`count(*)` })
            .from(teacherVerifications)
            .where(eq(teacherVerifications.status, "pending"))
        )[0]?.c ?? 0,
      0,
    ),
    stat(
      async () =>
        (
          await db
            .select({ c: sql<number>`count(*)` })
            .from(showcaseProducts)
            .where(eq(showcaseProducts.status, "launched"))
        )[0]?.c ?? 0,
      0,
    ),
  ]);

  const cards = [
    { icon: Users, label: "전체 회원", value: users, tint: "bg-primary/10 text-primary" },
    { icon: FileText, label: "게시글", value: posts_, tint: "bg-[#10B981]/10 text-[#10B981]" },
    {
      icon: ShieldCheck,
      label: "대기 중 교원인증",
      value: pendingVerif,
      tint: "bg-accent/20 text-accent-foreground",
    },
    { icon: Flag, label: "미처리 신고", value: openReports, tint: "bg-destructive/10 text-destructive" },
    { icon: Rocket, label: "런치된 앱", value: launched, tint: "bg-[#3B82F6]/10 text-[#3B82F6]" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">대시보드</h1>
      <p className="mt-1 text-sm text-muted-foreground">오늘의 커뮤니티 현황을 확인하세요.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardContent className="p-5">
              <div
                className={`inline-flex size-10 items-center justify-center rounded-lg ${c.tint}`}
              >
                <c.icon className="size-5" />
              </div>
              <p className="mt-4 text-2xl font-bold">{c.value.toLocaleString("ko-KR")}</p>
              <p className="mt-1 text-sm text-muted-foreground">{c.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
