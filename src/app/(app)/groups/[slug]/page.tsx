import { notFound } from "next/navigation";
import { getDb } from "@/db";
import { groups, groupMembers, profiles } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getSessionUser } from "@/lib/auth/session";
import { JoinGroupButton } from "./join-button";

export default async function GroupDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const db = getDb();
  const [g] = await db.select().from(groups).where(eq(groups.slug, slug)).limit(1).catch(() => []);
  if (!g) notFound();

  const user = await getSessionUser();
  const members = await db
    .select({
      userId: profiles.userId,
      username: profiles.username,
      displayName: profiles.displayName,
      avatarUrl: profiles.avatarUrl,
      role: groupMembers.role,
      status: groupMembers.status,
    })
    .from(groupMembers)
    .innerJoin(profiles, eq(profiles.userId, groupMembers.userId))
    .where(and(eq(groupMembers.groupId, g.id), eq(groupMembers.status, "active")))
    .limit(50)
    .catch(() => []);

  const joined = user
    ? members.some((m) => m.userId === user.id)
    : false;

  return (
    <div className="container-page py-8">
      <header className="rounded-2xl border bg-gradient-to-br from-primary/5 to-accent/5 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">{g.name}</h1>
              {g.isPrivate ? <Badge variant="outline">🔒 비공개</Badge> : null}
              {g.category ? <Badge variant="secondary">{g.category}</Badge> : null}
            </div>
            <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
              {g.description}
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              멤버 {g.memberCount}명 · 글 {g.postCount}개
            </p>
          </div>
          {user ? (
            <JoinGroupButton groupId={g.id} initialJoined={joined} />
          ) : (
            <Button asChild>
              <a href={`/login?redirect=/groups/${slug}`}>로그인 후 참여</a>
            </Button>
          )}
        </div>
      </header>

      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold">멤버 {members.length}명</h2>
        {members.length === 0 ? (
          <p className="text-sm text-muted-foreground">아직 멤버가 없습니다.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {members.map((m) => (
              <a
                key={m.userId}
                href={`/u/${m.username}`}
                className="flex items-center gap-3 rounded-xl border bg-card p-3 hover:border-primary/40"
              >
                <Avatar className="size-10">
                  {m.avatarUrl ? <AvatarImage src={m.avatarUrl} alt={m.displayName} /> : null}
                  <AvatarFallback>{m.displayName[0]}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{m.displayName}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    @{m.username}
                    {m.role !== "member" ? ` · ${m.role}` : ""}
                  </p>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
