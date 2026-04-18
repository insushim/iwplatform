import { getDb } from "@/db";
import { auditLogs } from "@/db/schema";
import { desc } from "drizzle-orm";
import { formatDateTime } from "@/lib/utils/date";

export default async function AdminAuditPage() {
  const db = getDb();
  const rows = await db
    .select()
    .from(auditLogs)
    .orderBy(desc(auditLogs.createdAt))
    .limit(100)
    .catch(() => []);
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">감사 로그</h1>
      <p className="mt-1 text-sm text-muted-foreground">최근 100건의 관리 액션</p>
      <div className="mt-6 overflow-x-auto rounded-xl border text-sm">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="p-3 text-left">시각</th>
              <th className="p-3 text-left">액션</th>
              <th className="p-3 text-left">대상</th>
              <th className="p-3 text-left">IP</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-3 text-xs text-muted-foreground">
                  {formatDateTime(r.createdAt)}
                </td>
                <td className="p-3 font-mono text-xs">{r.action}</td>
                <td className="p-3 text-xs">
                  {r.targetType}/{r.targetId}
                </td>
                <td className="p-3 text-xs text-muted-foreground">{r.ipAddress ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
