import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { votes, comments } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth/session";
import { voteSchema } from "@/lib/validators";
import { id as makeId } from "@/lib/utils/slug";

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "UNAUTHENTICATED" }, { status: 401 });
  const { id: commentId } = await ctx.params;
  const parsed = voteSchema
    .omit({ targetType: true, targetId: true })
    .safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ message: "bad" }, { status: 400 });

  const db = getDb();
  const [existing] = await db
    .select()
    .from(votes)
    .where(
      and(
        eq(votes.userId, user.id),
        eq(votes.targetType, "comment"),
        eq(votes.targetId, commentId),
      ),
    )
    .limit(1);
  const next = parsed.data.vote;

  if (!next) {
    if (existing) {
      const delta = existing.vote === "up" ? -1 : 1;
      await db.delete(votes).where(eq(votes.id, existing.id));
      await db
        .update(comments)
        .set({ voteScore: sql`${comments.voteScore} + ${delta}` })
        .where(eq(comments.id, commentId));
    }
    return NextResponse.json({ ok: true });
  }

  if (existing && existing.vote === next) {
    return NextResponse.json({ ok: true, unchanged: true });
  }

  if (existing) {
    const delta = next === "up" ? 2 : -2;
    await db.update(votes).set({ vote: next }).where(eq(votes.id, existing.id));
    await db
      .update(comments)
      .set({ voteScore: sql`${comments.voteScore} + ${delta}` })
      .where(eq(comments.id, commentId));
  } else {
    const delta = next === "up" ? 1 : -1;
    await db.insert(votes).values({
      id: makeId(),
      userId: user.id,
      targetType: "comment",
      targetId: commentId,
      vote: next,
    });
    await db
      .update(comments)
      .set({ voteScore: sql`${comments.voteScore} + ${delta}` })
      .where(eq(comments.id, commentId));
  }
  return NextResponse.json({ ok: true });
}
