import { notFound } from "next/navigation";
import { getDb } from "@/db";
import { tags, posts, postTags, profiles, categories } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { PostListCard } from "@/components/posts/post-list-card";

export default async function TagDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const db = getDb();
  const [tag] = await db.select().from(tags).where(eq(tags.slug, slug)).limit(1);
  if (!tag) notFound();

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
    .from(postTags)
    .innerJoin(posts, eq(posts.id, postTags.postId))
    .innerJoin(categories, eq(categories.id, posts.categoryId))
    .leftJoin(profiles, eq(profiles.userId, posts.authorId))
    .where(and(eq(postTags.tagId, tag.id), eq(posts.status, "published")))
    .orderBy(desc(posts.publishedAt))
    .limit(50);

  return (
    <div className="container-reading py-8">
      <h1 className="text-3xl font-bold tracking-tight">#{tag.name}</h1>
      {tag.description ? (
        <p className="mt-2 text-muted-foreground">{tag.description}</p>
      ) : null}
      <p className="mt-1 text-sm text-muted-foreground">{tag.postCount}개 글</p>
      <div className="mt-6 space-y-3">
        {rows.length === 0 ? (
          <p className="rounded-xl border bg-card p-12 text-center text-muted-foreground">
            아직 이 태그가 달린 글이 없습니다.
          </p>
        ) : (
          rows.map((p) => <PostListCard key={p.id} post={p} />)
        )}
      </div>
    </div>
  );
}
