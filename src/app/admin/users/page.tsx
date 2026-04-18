import { getDb } from "@/db";
import { profiles } from "@/db/schema";
import { desc } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils/date";

export default async function AdminUsersPage() {
  const db = getDb();
  const rows = await db
    .select()
    .from(profiles)
    .orderBy(desc(profiles.createdAt))
    .limit(100)
    .catch(() => []);
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">사용자</h1>
      <p className="mt-1 text-sm text-muted-foreground">최근 가입 100명</p>
      <div className="mt-6 overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="p-3 text-left">사용자</th>
              <th className="p-3 text-left">역할</th>
              <th className="p-3 text-left">인증</th>
              <th className="p-3 text-right">Karma</th>
              <th className="p-3 text-right">글</th>
              <th className="p-3 text-right">가입</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.userId} className="border-t">
                <td className="p-3">
                  <p className="font-medium">{r.displayName}</p>
                  <p className="text-xs text-muted-foreground">@{r.username}</p>
                </td>
                <td className="p-3">
                  <Badge variant="outline">{r.role}</Badge>
                </td>
                <td className="p-3">
                  {r.teacherStatus === "verified" ? (
                    <Badge variant="secondary">✓ 인증</Badge>
                  ) : (
                    <Badge variant="outline">{r.teacherStatus}</Badge>
                  )}
                </td>
                <td className="p-3 text-right">{r.karma.toLocaleString("ko-KR")}</td>
                <td className="p-3 text-right">{r.postCount.toLocaleString("ko-KR")}</td>
                <td className="p-3 text-right text-xs text-muted-foreground">
                  {formatDateTime(r.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
