import { getDb } from "@/db";
import { reports, profiles } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils/date";
import { ReportActions } from "./report-actions";

export default async function AdminReportsPage() {
  const db = getDb();
  const rows = await db
    .select({ r: reports, reporter: profiles })
    .from(reports)
    .leftJoin(profiles, eq(profiles.userId, reports.reporterId))
    .where(eq(reports.status, "pending"))
    .orderBy(desc(reports.createdAt))
    .limit(50)
    .catch(() => []);
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">신고</h1>
      <p className="mt-1 text-sm text-muted-foreground">미처리 {rows.length}건</p>
      {rows.length === 0 ? (
        <div className="mt-8 rounded-xl border bg-card p-12 text-center text-muted-foreground">
          처리할 신고가 없습니다.
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {rows.map(({ r, reporter }) => (
            <li key={r.id} className="rounded-xl border bg-card p-5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{r.targetType}</Badge>
                <Badge variant="outline">{r.reason}</Badge>
                <span className="ml-auto text-xs text-muted-foreground">
                  {formatDateTime(r.createdAt)}
                </span>
              </div>
              <p className="mt-2 text-sm">
                신고자:{" "}
                {reporter?.username ? (
                  <a href={`/u/${reporter.username}`} className="text-primary hover:underline">
                    @{reporter.username}
                  </a>
                ) : (
                  "삭제된 사용자"
                )}{" "}
                · 대상:{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">{r.targetId}</code>
              </p>
              {r.details ? (
                <p className="mt-2 rounded-md bg-muted/40 p-3 text-sm">{r.details}</p>
              ) : null}
              <div className="mt-4">
                <ReportActions reportId={r.id} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
