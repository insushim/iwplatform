import { notFound } from "next/navigation";
import Link from "next/link";
import { getDb } from "@/db";
import { profiles, posts, showcaseProducts, follows } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TRUST_LEVELS } from "@/lib/constants";
import { formatNumber } from "@/lib/utils/text";
import { formatDate } from "@/lib/utils/date";
import { getSessionUser } from "@/lib/auth/session";
import { ProfileActions } from "@/components/profile/profile-actions";

export default async function UserProfile({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const db = getDb();
  const rows = await db
    .select()
    .from(profiles)
    .where(eq(profiles.username, username))
    .limit(1)
    .catch(() => []);
  const p = rows[0];
  if (!p) notFound();

  const [userPosts, userProducts] = await Promise.all([
    db
      .select({
        id: posts.id,
        slug: posts.slug,
        title: posts.title,
        publishedAt: posts.publishedAt,
        voteScore: posts.voteScore,
        commentCount: posts.commentCount,
      })
      .from(posts)
      .where(and(eq(posts.authorId, p.userId), eq(posts.status, "published")))
      .orderBy(desc(posts.publishedAt))
      .limit(10)
      .catch(() => []),
    db
      .select({
        id: showcaseProducts.id,
        slug: showcaseProducts.slug,
        name: showcaseProducts.name,
        tagline: showcaseProducts.tagline,
        upvoteCount: showcaseProducts.upvoteCount,
      })
      .from(showcaseProducts)
      .where(eq(showcaseProducts.makerId, p.userId))
      .limit(6)
      .catch(() => []),
  ]);

  const trust = TRUST_LEVELS[p.trustLevel as keyof typeof TRUST_LEVELS];
  const sessionUser = await getSessionUser().catch(() => null);
  const isSelf = sessionUser?.id === p.userId;
  const alreadyFollowing = sessionUser
    ? Boolean(
        (
          await db
            .select({ f: follows.followerId })
            .from(follows)
            .where(
              and(
                eq(follows.followerId, sessionUser.id),
                eq(follows.followingId, p.userId),
              ),
            )
            .limit(1)
            .catch(() => [])
        )[0],
      )
    : false;
  const dmAllow = p.privacyPrefs?.allowDmFrom ?? "verified";
  const canDm = sessionUser && !isSelf && dmAllow !== "none";

  return (
    <div className="container-page py-8">
      <header className="flex flex-col gap-6 rounded-2xl border bg-gradient-to-br from-primary/5 to-accent/5 p-6 md:flex-row md:items-center">
        <Avatar className="size-24">
          {p.avatarUrl ? <AvatarImage src={p.avatarUrl} alt={p.displayName} /> : null}
          <AvatarFallback className="text-2xl">{p.displayName[0]}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">{p.displayName}</h1>
            {p.teacherStatus === "verified" ? (
              <Badge variant="secondary">✓ 인증 교사</Badge>
            ) : null}
            {p.isMaker ? <Badge className="bg-accent text-accent-foreground">메이커</Badge> : null}
            <Badge variant="outline" style={{ borderColor: trust.color, color: trust.color }}>
              {trust.label}
            </Badge>
          </div>
          <p className="text-muted-foreground">@{p.username}</p>
          {p.bio ? (
            <p className="mt-3 max-w-2xl text-sm leading-relaxed">{p.bio}</p>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-6 text-sm">
            <Stat value={p.karma} label="Karma" />
            <Stat value={p.postCount} label="글" />
            <Link href={`/u/${p.username}/followers`} className="hover:text-primary">
              <Stat value={p.followersCount} label="팔로워" />
            </Link>
            <Link href={`/u/${p.username}/following`} className="hover:text-primary">
              <Stat value={p.followingCount} label="팔로잉" />
            </Link>
          </div>
        </div>
        {sessionUser ? (
          <ProfileActions
            targetUserId={p.userId}
            isSelf={isSelf}
            initialFollowing={alreadyFollowing}
            canDm={Boolean(canDm)}
          />
        ) : null}
      </header>

      <section className="mt-10 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 text-lg font-semibold">최근 글</h2>
          {userPosts.length === 0 ? (
            <p className="text-sm text-muted-foreground">아직 작성한 글이 없습니다.</p>
          ) : (
            <ul className="space-y-2">
              {userPosts.map((post) => (
                <li key={post.id} className="rounded-md border bg-card p-3">
                  <Link href={`/posts/${post.slug}`} className="font-medium hover:text-primary">
                    {post.title}
                  </Link>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatDate(post.publishedAt)} · ▲{formatNumber(post.voteScore)} · 💬
                    {formatNumber(post.commentCount)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h2 className="mb-3 text-lg font-semibold">메이커 작품</h2>
          {userProducts.length === 0 ? (
            <p className="text-sm text-muted-foreground">아직 공개한 앱이 없습니다.</p>
          ) : (
            <div className="space-y-3">
              {userProducts.map((prod) => (
                <Link key={prod.id} href={`/showcase/${prod.slug}`}>
                  <Card className="transition hover:border-primary/40">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold">{prod.name}</p>
                          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                            {prod.tagline}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-md bg-muted px-2 py-1 text-xs font-bold">
                          ▲ {prod.upvoteCount}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <p className="text-xl font-bold">{formatNumber(value)}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
