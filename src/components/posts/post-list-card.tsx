import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Eye } from "lucide-react";
import { timeAgo } from "@/lib/utils/date";
import { formatNumber } from "@/lib/utils/text";
import { PostVoteButtons } from "./vote-buttons";

export interface PostListItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  voteScore: number;
  commentCount: number;
  viewCount: number;
  publishedAt: Date;
  categorySlug: string;
  categoryName: string;
  categoryIcon: string | null;
  authorId: string;
  authorName: string | null;
  authorUsername: string | null;
  authorAvatar: string | null;
}

export function PostListCard({ post }: { post: PostListItem }) {
  return (
    <article className="group rounded-xl border bg-card p-5 transition hover:border-primary/40 hover:shadow-md">
      <div className="flex gap-4">
        <div className="flex w-12 shrink-0 flex-col items-center">
          <PostVoteButtons postId={post.id} initialScore={post.voteScore} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Link
              href={`/posts/category/${post.categorySlug}`}
              className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 font-medium hover:bg-primary/10 hover:text-primary"
            >
              {post.categoryIcon ? <span>{post.categoryIcon}</span> : null}
              {post.categoryName}
            </Link>
            <span>·</span>
            {post.authorUsername ? (
              <Link href={`/u/${post.authorUsername}`} className="hover:text-foreground">
                @{post.authorUsername}
              </Link>
            ) : null}
            <span>·</span>
            <span>{timeAgo(post.publishedAt)}</span>
          </div>
          <Link href={`/posts/${post.slug}`} className="mt-1.5 block">
            <h3 className="text-lg font-semibold leading-snug tracking-tight group-hover:text-primary">
              {post.title}
            </h3>
            {post.excerpt ? (
              <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                {post.excerpt}
              </p>
            ) : null}
          </Link>
          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MessageSquare className="size-3.5" /> {formatNumber(post.commentCount)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Eye className="size-3.5" /> {formatNumber(post.viewCount)}
            </span>
            <AuthorInline
              name={post.authorName}
              username={post.authorUsername}
              avatar={post.authorAvatar}
            />
          </div>
        </div>
        {post.coverImageUrl ? (
          <Link
            href={`/posts/${post.slug}`}
            className="hidden h-24 w-32 shrink-0 overflow-hidden rounded-lg sm:block"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImageUrl}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </Link>
        ) : null}
      </div>
    </article>
  );
}

function AuthorInline({
  name,
  username,
  avatar,
}: {
  name: string | null;
  username: string | null;
  avatar: string | null;
}) {
  if (!username) return null;
  return (
    <span className="ml-auto inline-flex items-center gap-1.5">
      <Avatar className="size-5">
        {avatar ? <AvatarImage src={avatar} alt={name ?? username} /> : null}
        <AvatarFallback className="text-[9px]">{(name ?? username)[0]}</AvatarFallback>
      </Avatar>
      <span className="truncate">{name ?? username}</span>
      <Badge variant="outline" className="ml-1 text-[9px]">
        ✓
      </Badge>
    </span>
  );
}
