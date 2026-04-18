import { notFound } from "next/navigation";
import { getDb } from "@/db";
import { profiles, posts, categories } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { PostListCard } from "@/components/posts/post-list-card";

export default async function UserPostsPage({
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
      id: posts.id,
      slug: posts.slug,
      title: posts.title,
      excerpt: posts.excerpt,
      coverImageUrl: posts.coverImageUrl,
      voteScore: posts.voteScore,
      commentCount: posts.commentCount,
      viewCount: posts.viewCount,
      publishedAt: posts.publishedAt,
      categorySlug: categories.slug,
      categoryName: categories.name,
      categoryIcon: categories.icon,
      authorId: posts.authorId,
      authorName: profiles.displayName,
      authorUsername: profiles.username,
      authorAvatar: profiles.avatarUrl,
    })
    .from(posts)
    .innerJoin(categories, eq(categories.id, posts.categoryId))
    .leftJoin(profiles, eq(profiles.userId, posts.authorId))
    .where(and(eq(posts.authorId, target.userId), eq(posts.status, "published")))
    .orderBy(desc(posts.publishedAt))
    .limit(50);

  return (
    <div className="container-reading py-8">
      <h1 className="text-2xl font-bold tracking-tight">
        {target.displayName}님의 글 ({rows.length})
      </h1>
      <div className="mt-6 space-y-3">
        {rows.length === 0 ? (
          <p className="rounded-xl border bg-card p-12 text-center text-muted-foreground">
            아직 작성한 글이 없어요.
          </p>
        ) : (
          rows.map((p) => <PostListCard key={p.id} post={p} />)
        )}
      </div>
    </div>
  );
}
