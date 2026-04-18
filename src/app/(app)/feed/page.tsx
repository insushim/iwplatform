import type { Metadata } from "next";
import Link from "next/link";
import { getDb } from "@/db";
import { posts, profiles, categories } from "@/db/schema";
import { desc, eq, and } from "drizzle-orm";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PostListCard } from "@/components/posts/post-list-card";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/constants";
import { Plus } from "lucide-react";

export const metadata: Metadata = { title: "피드" };

async function listPosts(orderBy: "hot" | "new" | "top" = "hot") {
  const db = getDb();
  const order =
    orderBy === "new"
      ? desc(posts.publishedAt)
      : orderBy === "top"
        ? desc(posts.voteScore)
        : desc(posts.hotScore);
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
    .where(and(eq(posts.status, "published")))
    .orderBy(order)
    .limit(20);
  return rows;
}

export default async function FeedPage() {
  const hot = await listPosts("hot").catch(() => []);
  return (
    <div className="container-page py-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">피드</h1>
            <Button asChild>
              <Link href="/posts/new">
                <Plus className="size-4" />
                글쓰기
              </Link>
            </Button>
          </div>
          <Tabs defaultValue="hot">
            <TabsList>
              <TabsTrigger value="hot">인기</TabsTrigger>
              <TabsTrigger value="new">최신</TabsTrigger>
              <TabsTrigger value="top">베스트</TabsTrigger>
            </TabsList>
            <TabsContent value="hot" className="mt-4 space-y-3">
              {hot.length === 0 ? (
                <EmptyFeed />
              ) : (
                hot.map((p) => <PostListCard key={p.id} post={p} />)
              )}
            </TabsContent>
            <TabsContent value="new" className="mt-4">
              <NewList />
            </TabsContent>
            <TabsContent value="top" className="mt-4">
              <TopList />
            </TabsContent>
          </Tabs>
        </div>
        <aside className="space-y-6">
          <div className="rounded-xl border bg-card p-5">
            <h2 className="mb-3 text-sm font-semibold">카테고리</h2>
            <div className="flex flex-col gap-1">
              {CATEGORIES.map((c) => (
                <Link
                  key={c.slug}
                  href={`/posts/category/${c.slug}`}
                  className="flex items-center gap-3 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
                >
                  <span>{c.icon}</span>
                  <span>{c.name}</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="rounded-xl border bg-card p-5">
            <h2 className="mb-3 text-sm font-semibold">이번 주 트렌딩 태그</h2>
            <div className="flex flex-wrap gap-1.5">
              {["#AI수업", "#프롬프트", "#학급관리", "#서술형평가", "#바이브코딩", "#Claude"].map(
                (t) => (
                  <Link
                    key={t}
                    href={`/posts?tag=${encodeURIComponent(t.slice(1))}`}
                    className="rounded-full bg-muted px-2.5 py-1 text-xs hover:bg-primary/10 hover:text-primary"
                  >
                    {t}
                  </Link>
                ),
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

async function NewList() {
  const rows = await listPosts("new").catch(() => []);
  if (rows.length === 0) return <EmptyFeed />;
  return (
    <div className="space-y-3">
      {rows.map((p) => (
        <PostListCard key={p.id} post={p} />
      ))}
    </div>
  );
}

async function TopList() {
  const rows = await listPosts("top").catch(() => []);
  if (rows.length === 0) return <EmptyFeed />;
  return (
    <div className="space-y-3">
      {rows.map((p) => (
        <PostListCard key={p.id} post={p} />
      ))}
    </div>
  );
}

function EmptyFeed() {
  return (
    <div className="rounded-xl border bg-card p-12 text-center">
      <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10 text-2xl">
        ✍️
      </div>
      <h3 className="text-lg font-semibold">첫 글의 주인공이 되어 주세요</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
        아직 글이 없네요. 당신의 수업 이야기, 프롬프트 실험, 빌드 노트를 처음으로 올려 주세요.
      </p>
      <Button asChild className="mt-5">
        <Link href="/posts/new">첫 글 쓰러 가기</Link>
      </Button>
    </div>
  );
}
