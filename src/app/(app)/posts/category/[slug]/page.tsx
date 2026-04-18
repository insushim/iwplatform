import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getDb } from "@/db";
import { categories, posts, profiles } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { PostListCard } from "@/components/posts/post-list-card";
import { Plus } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const meta = CATEGORIES.find((c) => c.slug === slug);

  const db = getDb();
  const [cat] = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1)
    .catch(() => [null as unknown as typeof categories.$inferSelect]);
  if (!cat && !meta) notFound();

  const rows = cat
    ? await db
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
        .where(and(eq(categories.slug, slug), eq(posts.status, "published")))
        .orderBy(desc(posts.publishedAt))
        .limit(30)
        .catch(() => [])
    : [];

  const name = cat?.name ?? meta?.name ?? slug;
  const description = cat?.description ?? meta?.description;
  const icon = cat?.icon ?? meta?.icon;

  return (
    <div className="container-page py-8">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <div className="flex items-center gap-3">
            {icon ? <span className="text-3xl">{icon}</span> : null}
            <h1 className="text-3xl font-bold tracking-tight">{name}</h1>
          </div>
          {description ? (
            <p className="mt-1 text-muted-foreground">{description}</p>
          ) : null}
        </div>
        <Button asChild>
          <Link href={`/posts/new?category=${slug}`}>
            <Plus className="size-4" />
            글쓰기
          </Link>
        </Button>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-xl border bg-card p-12 text-center">
          <p className="text-muted-foreground">아직 이 카테고리에 글이 없습니다.</p>
          <Button asChild className="mt-4">
            <Link href={`/posts/new?category=${slug}`}>첫 글 쓰기</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((p) => (
            <PostListCard key={p.id} post={p} />
          ))}
        </div>
      )}
    </div>
  );
}
