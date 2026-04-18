import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { votes, posts } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth/session";
import { voteSchema } from "@/lib/validators";
import { id as makeId } from "@/lib/utils/slug";


export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "UNAUTHENTICATED" }, { status: 401 });
  const { id: postId } = await ctx.params;

  const parsed = voteSchema
    .omit({ targetType: true, targetId: true })
    .safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ message: "bad" }, { status: 400 });
  }

  const db = getDb();
  const existing = await db
    .select()
    .from(votes)
    .where(
      and(
        eq(votes.userId, user.id),
        eq(votes.targetType, "post"),
        eq(votes.targetId, postId),
      ),
    )
    .limit(1);

  const current = existing[0];
  const next = parsed.data.vote;

  if (!next) {
    if (current) {
      const delta = current.vote === "up" ? -1 : 1;
      await db.delete(votes).where(eq(votes.id, current.id));
      await db
        .update(posts)
        .set({ voteScore: sql`${posts.voteScore} + ${delta}` })
        .where(eq(posts.id, postId));
    }
    return NextResponse.json({ ok: true });
  }

  if (current && current.vote === next) {
    return NextResponse.json({ ok: true, unchanged: true });
  }

  if (current) {
    const delta = next === "up" ? 2 : -2;
    await db.update(votes).set({ vote: next }).where(eq(votes.id, current.id));
    await db
      .update(posts)
      .set({ voteScore: sql`${posts.voteScore} + ${delta}` })
      .where(eq(posts.id, postId));
  } else {
    const delta = next === "up" ? 1 : -1;
    await db.insert(votes).values({
      id: makeId(),
      userId: user.id,
      targetType: "post",
      targetId: postId,
      vote: next,
    });
    await db
      .update(posts)
      .set({
        voteScore: sql`${posts.voteScore} + ${delta}`,
        upvoteCount: next === "up" ? sql`${posts.upvoteCount} + 1` : posts.upvoteCount,
        downvoteCount: next === "down" ? sql`${posts.downvoteCount} + 1` : posts.downvoteCount,
      })
      .where(eq(posts.id, postId));
  }
  return NextResponse.json({ ok: true });
}
