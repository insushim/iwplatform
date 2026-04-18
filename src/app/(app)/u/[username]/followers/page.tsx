import { notFound } from "next/navigation";
import { getDb } from "@/db";
import { profiles, follows } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { UserList } from "../user-list";

export default async function FollowersPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const db = getDb();
  const [target] = await db
    .select({ userId: profiles.userId, displayName: profiles.displayName })
    .from(profiles)
    .where(eq(profiles.username, username))
    .limit(1);
  if (!target) notFound();

  const rows = await db
    .select({
      userId: profiles.userId,
      username: profiles.username,
      displayName: profiles.displayName,
      avatarUrl: profiles.avatarUrl,
      bio: profiles.bio,
      teacherStatus: profiles.teacherStatus,
      karma: profiles.karma,
    })
    .from(follows)
    .innerJoin(profiles, eq(profiles.userId, follows.followerId))
    .where(eq(follows.followingId, target.userId))
    .orderBy(desc(follows.createdAt))
    .limit(100);

  return (
    <div className="container-reading py-8">
      <h1 className="text-2xl font-bold tracking-tight">
        {target.displayName}님의 팔로워 ({rows.length})
      </h1>
      <div className="mt-6">
        <UserList users={rows} />
      </div>
    </div>
  );
}
