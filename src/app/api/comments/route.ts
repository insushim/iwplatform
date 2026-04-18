import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { comments, posts, profiles } from "@/db/schema";
import { sql, eq } from "drizzle-orm";
import { getSessionUser, requireVerifiedTeacher } from "@/lib/auth/session";
import { commentCreateSchema } from "@/lib/validators";
import { id as makeId } from "@/lib/utils/slug";
import { ipRateLimit } from "@/lib/security/rate-limit";


export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "UNAUTHENTICATED" }, { status: 401 });

  const rl = await ipRateLimit(req, "comment", 30, 60 * 60);
  if (!rl.ok) {
    return NextResponse.json(
      { message: "댓글 한도를 초과했습니다" },
      { status: 429 },
    );
  }

  try {
    await requireVerifiedTeacher();
  } catch {
    return NextResponse.json({ message: "교원 인증이 필요합니다" }, { status: 403 });
  }

  const parsed = commentCreateSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ message: "bad" }, { status: 400 });
  }

  const db = getDb();
  const cid = makeId();

  let depth = 0;
  if (parsed.data.parentId) {
    const [parent] = await db
      .select({ d: comments.depth })
      .from(comments)
      .where(eq(comments.id, parsed.data.parentId))
      .limit(1);
    depth = Math.min((parent?.d ?? 0) + 1, 3);
  }

  await db.insert(comments).values({
    id: cid,
    postId: parsed.data.postId,
    authorId: user.id,
    parentId: parsed.data.parentId ?? null,
    content: parsed.data.content,
    isAnonymous: parsed.data.isAnonymous,
    depth,
  });

  await db
    .update(posts)
    .set({ commentCount: sql`${posts.commentCount} + 1` })
    .where(eq(posts.id, parsed.data.postId));

  if (parsed.data.parentId) {
    await db
      .update(comments)
      .set({ replyCount: sql`${comments.replyCount} + 1` })
      .where(eq(comments.id, parsed.data.parentId));
  }

  const [author] = await db
    .select({
      displayName: profiles.displayName,
      username: profiles.username,
      avatarUrl: profiles.avatarUrl,
    })
    .from(profiles)
    .where(eq(profiles.userId, user.id))
    .limit(1);

  return NextResponse.json({
    id: cid,
    content: parsed.data.content,
    voteScore: 0,
    createdAt: new Date(),
    parentId: parsed.data.parentId ?? null,
    isDeleted: false,
    authorName: author?.displayName ?? user.name,
    authorUsername: author?.username ?? null,
    authorAvatar: author?.avatarUrl ?? null,
  });
}
