import { notFound } from "next/navigation";
import Link from "next/link";
import { getDb } from "@/db";
import { profiles, users, posts } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateTime } from "@/lib/utils/date";
import { SuspendForm } from "./suspend-form";

export default async function AdminUserDetail({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const db = getDb();
  const [row] = await db
    .select({
      userId: profiles.userId,
      username: profiles.username,
      displayName: profiles.displayName,
      avatarUrl: profiles.avatarUrl,
      role: profiles.role,
      trustLevel: profiles.trustLevel,
      teacherStatus: profiles.teacherStatus,
      karma: profiles.karma,
      postCount: profiles.postCount,
      isSuspended: profiles.isSuspended,
      suspendedUntil: profiles.suspendedUntil,
      suspendedReason: profiles.suspendedReason,
      createdAt: profiles.createdAt,
      email: users.email,
      lastLoginAt: profiles.lastLoginAt,
    })
    .from(profiles)
    .innerJoin(users, eq(users.id, profiles.userId))
    .where(eq(profiles.userId, userId))
    .limit(1)
    .catch(() => []);
  if (!row) notFound();

  const recentPosts = await db
    .select({ id: posts.id, slug: posts.slug, title: posts.title, publishedAt: posts.publishedAt })
    .from(posts)
    .where(eq(posts.authorId, userId))
    .orderBy(desc(posts.publishedAt))
    .limit(5)
    .catch(() => []);

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">사용자 상세</h1>
      <Card className="mt-6">
        <CardContent className="flex flex-wrap items-start gap-4 p-6">
          <Avatar className="size-16">
            {row.avatarUrl ? <AvatarImage src={row.avatarUrl} alt={row.displayName} /> : null}
            <AvatarFallback>{row.displayName[0]}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/u/${row.username}`}
                className="text-xl font-bold hover:text-primary"
              >
                {row.displayName}
              </Link>
              <Badge variant="outline">{row.role}</Badge>
              {row.teacherStatus === "verified" ? (
                <Badge variant="secondary">✓ 인증 교사</Badge>
              ) : (
                <Badge variant="outline">{row.teacherStatus}</Badge>
              )}
              {row.isSuspended ? (
                <Badge variant="destructive">정지</Badge>
              ) : null}
            </div>
            <p className="text-sm text-muted-foreground">@{row.username} · {row.email}</p>
            <div className="mt-4 grid gap-2 text-sm sm:grid-cols-4">
              <Stat label="Karma" value={String(row.karma)} />
              <Stat label="글" value={String(row.postCount)} />
              <Stat label="가입" value={formatDateTime(row.createdAt)} />
              <Stat
                label="최근 로그인"
                value={row.lastLoginAt ? formatDateTime(row.lastLoginAt) : "—"}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold">정지 관리</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            정지하면 글쓰기·댓글·DM이 차단됩니다.
          </p>
          <div className="mt-4">
            <SuspendForm
              userId={row.userId}
              isSuspended={row.isSuspended}
              currentReason={row.suspendedReason}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold">최근 글</h2>
          {recentPosts.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">글이 없습니다.</p>
          ) : (
            <ul className="mt-3 space-y-1.5 text-sm">
              {recentPosts.map((p) => (
                <li key={p.id}>
                  <Link href={`/posts/${p.slug}`} className="hover:text-primary">
                    {p.title}
                  </Link>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {formatDateTime(p.publishedAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
