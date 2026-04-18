import { notFound } from "next/navigation";
import Link from "next/link";
import { getDb } from "@/db";
import { posts, profiles, categories, comments } from "@/db/schema";
import { eq, and, asc } from "drizzle-orm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowBigUp, ArrowBigDown, MessageSquare, Bookmark, Flag, Share2 } from "lucide-react";
import { timeAgo, formatDateTime } from "@/lib/utils/date";
import { formatNumber } from "@/lib/utils/text";
import { CommentSection } from "@/components/posts/comment-section";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  try {
    const db = getDb();
    const [p] = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
    if (!p) return { title: "글을 찾을 수 없습니다" };
    return {
      title: p.title,
      description: p.excerpt ?? undefined,
    };
  } catch {
    return { title: "글" };
  }
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const db = getDb();

  const rows = await db
    .select({
      post: posts,
      author: profiles,
      category: categories,
    })
    .from(posts)
    .leftJoin(profiles, eq(profiles.userId, posts.authorId))
    .innerJoin(categories, eq(categories.id, posts.categoryId))
    .where(and(eq(posts.slug, slug), eq(posts.status, "published")))
    .limit(1)
    .catch(() => []);
  const row = rows[0];
  if (!row) notFound();
  const p = row.post;
  const author = row.author;
  const cat = row.category;

  const cmts = await db
    .select({ c: comments, a: profiles })
    .from(comments)
    .leftJoin(profiles, eq(profiles.userId, comments.authorId))
    .where(eq(comments.postId, p.id))
    .orderBy(asc(comments.createdAt))
    .catch(() => []);

  return (
    <article className="container-reading py-8">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <Link
          href={`/posts/category/${cat.slug}`}
          className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium hover:bg-primary/10 hover:text-primary"
        >
          {cat.icon ? <span>{cat.icon}</span> : null} {cat.name}
        </Link>
        {p.isPinned ? <Badge variant="secondary">📌 공지</Badge> : null}
        <span className="text-xs text-muted-foreground">{timeAgo(p.publishedAt)}</span>
      </div>
      <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{p.title}</h1>

      <div className="mt-5 flex flex-wrap items-center gap-3 border-y py-3">
        <Link
          href={author ? `/u/${author.username}` : "#"}
          className="flex items-center gap-2"
        >
          <Avatar className="size-9">
            {author?.avatarUrl ? (
              <AvatarImage src={author.avatarUrl} alt={author.displayName ?? ""} />
            ) : null}
            <AvatarFallback>{(author?.displayName ?? "E")[0]}</AvatarFallback>
          </Avatar>
          <div className="leading-tight">
            <p className="text-sm font-semibold">
              {author?.displayName ?? "익명"}
              {author?.teacherStatus === "verified" ? (
                <Badge variant="outline" className="ml-1 text-[9px]">
                  ✓ 인증
                </Badge>
              ) : null}
            </p>
            {author?.username ? (
              <p className="text-xs text-muted-foreground">
                @{author.username} · {formatDateTime(p.publishedAt)}
              </p>
            ) : null}
          </div>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Bookmark className="size-4" />
            북마크
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="size-4" />
            공유
          </Button>
          <Button variant="ghost" size="sm">
            <Flag className="size-4" />
          </Button>
        </div>
      </div>

      <div className="prose-kor mt-8 whitespace-pre-wrap text-[17px] leading-[1.8]">
        {p.content}
      </div>

      <footer className="mt-10 flex items-center gap-4 border-y py-4">
        <div className="inline-flex items-center gap-1 rounded-full border p-1">
          <Button variant="ghost" size="icon" className="size-8 rounded-full">
            <ArrowBigUp className="size-4" />
          </Button>
          <span className="px-2 text-sm font-bold">{formatNumber(p.voteScore)}</span>
          <Button variant="ghost" size="icon" className="size-8 rounded-full">
            <ArrowBigDown className="size-4" />
          </Button>
        </div>
        <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
          <MessageSquare className="size-4" /> 댓글 {formatNumber(p.commentCount)}
        </span>
      </footer>

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-semibold">댓글 {cmts.length}개</h2>
        <CommentSection
          postId={p.id}
          initialComments={cmts.map((x) => ({
            id: x.c.id,
            content: x.c.content,
            voteScore: x.c.voteScore,
            createdAt: x.c.createdAt,
            parentId: x.c.parentId,
            isDeleted: x.c.isDeleted,
            authorName: x.a?.displayName ?? "익명",
            authorUsername: x.a?.username ?? null,
            authorAvatar: x.a?.avatarUrl ?? null,
          }))}
        />
      </section>
    </article>
  );
}
