import { getDb } from "@/db";
import { reports } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils/date";

export default async function AdminReportsPage() {
  const db = getDb();
  const rows = await db
    .select()
    .from(reports)
    .where(eq(reports.status, "pending"))
    .orderBy(desc(reports.createdAt))
    .limit(50)
    .catch(() => []);
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">신고</h1>
      <p className="mt-1 text-sm text-muted-foreground">미처리 {rows.length}건</p>
      <ul className="mt-6 space-y-3">
        {rows.map((r) => (
          <li key={r.id} className="rounded-xl border bg-card p-5">
            <div className="flex items-center gap-2">
              <Badge>{r.targetType}</Badge>
              <Badge variant="outline">{r.reason}</Badge>
              <span className="ml-auto text-xs text-muted-foreground">
                {formatDateTime(r.createdAt)}
              </span>
            </div>
            {r.details ? (
              <p className="mt-2 text-sm text-muted-foreground">{r.details}</p>
            ) : null}
            <p className="mt-1 text-xs text-muted-foreground">target: {r.targetId}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
