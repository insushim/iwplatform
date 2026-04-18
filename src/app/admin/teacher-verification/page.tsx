import { getDb } from "@/db";
import { teacherVerifications, profiles } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils/date";

export default async function TeacherVerificationPage() {
  const db = getDb();
  const rows = await db
    .select({
      v: teacherVerifications,
      p: profiles,
    })
    .from(teacherVerifications)
    .leftJoin(profiles, eq(profiles.userId, teacherVerifications.userId))
    .where(eq(teacherVerifications.status, "pending"))
    .orderBy(desc(teacherVerifications.createdAt))
    .limit(50)
    .catch(() => []);

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">교원 인증 검토</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        총 {rows.length}건의 검토 대기 중 요청
      </p>
      {rows.length === 0 ? (
        <div className="mt-8 rounded-xl border bg-card p-12 text-center text-muted-foreground">
          검토 대기 중인 요청이 없습니다.
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {rows.map(({ v, p }) => (
            <li key={v.id} className="rounded-xl border bg-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-semibold">
                    {p?.displayName ?? "—"}{" "}
                    <span className="text-sm text-muted-foreground">
                      @{p?.username ?? "—"}
                    </span>
                  </p>
                  <p className="mt-1 text-sm">
                    <Badge variant="outline">{v.method}</Badge>{" "}
                    <span className="ml-1">{v.schoolName}</span>{" "}
                    <span className="text-muted-foreground">· {v.teacherLevel ?? "-"}</span>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    제출: {formatDateTime(v.createdAt)}
                  </p>
                </div>
                <div className="flex gap-2">
                  {v.documentUrl ? (
                    <Button asChild variant="outline" size="sm">
                      <a href={v.documentUrl} target="_blank" rel="noreferrer">
                        문서 보기
                      </a>
                    </Button>
                  ) : null}
                  <form action="/api/admin/teacher/approve" method="post">
                    <input type="hidden" name="verificationId" value={v.id} />
                    <Button size="sm" type="submit">
                      승인
                    </Button>
                  </form>
                  <form action="/api/admin/teacher/reject" method="post">
                    <input type="hidden" name="verificationId" value={v.id} />
                    <Button size="sm" variant="destructive" type="submit">
                      거절
                    </Button>
                  </form>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
