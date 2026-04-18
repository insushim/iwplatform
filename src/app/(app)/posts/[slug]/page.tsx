import { notFound } from "next/navigation";
import Link from "next/link";
import { getDb } from "@/db";
import { posts, profiles, categories, comments } from "@/db/schema";
import { eq, and, asc } from "drizzle-orm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Share2 } from "lucide-react";
import { timeAgo, formatDateTime } from "@/lib/utils/date";
import { formatNumber } from "@/lib/utils/text";
import { CommentSection } from "@/components/posts/comment-section";
import { PostVoteButtons } from "@/components/posts/vote-buttons";
import { BookmarkButton } from "@/components/posts/bookmark-button";
import { ReportDialog } from "@/components/common/report-dialog";

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
          <BookmarkButton postId={p.id} />
          <Button variant="outline" size="sm">
            <Share2 className="size-4" />
            공유
          </Button>
          <ReportDialog targetType="post" targetId={p.id} />
        </div>
      </div>

      <div
        className="prose-kor mt-8 text-[17px] leading-[1.8] [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-bold [&_p]:my-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-primary/40 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_pre]:my-4 [&_pre]:rounded-md [&_pre]:bg-muted [&_pre]:p-4 [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2"
        dangerouslySetInnerHTML={{ __html: p.content }}
      />

      <footer className="mt-10 flex items-center gap-4 border-y py-4">
        <PostVoteButtons
          postId={p.id}
          initialScore={p.voteScore}
          orientation="horizontal"
        />
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
