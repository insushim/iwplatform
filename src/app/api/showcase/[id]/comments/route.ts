import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { showcaseComments, showcaseProducts, profiles } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { getSessionUser, requireVerifiedTeacher } from "@/lib/auth/session";
import { id as makeId } from "@/lib/utils/slug";
import { z } from "zod";

const schema = z.object({ content: z.string().min(1).max(2000) });

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "UNAUTHENTICATED" }, { status: 401 });
  try {
    await requireVerifiedTeacher();
  } catch {
    return NextResponse.json({ message: "교원 인증이 필요합니다" }, { status: 403 });
  }
  const { id: productId } = await ctx.params;
  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ message: "bad" }, { status: 400 });

  const db = getDb();
  const [p] = await db
    .select({ makerId: showcaseProducts.makerId })
    .from(showcaseProducts)
    .where(eq(showcaseProducts.id, productId))
    .limit(1);
  if (!p) return NextResponse.json({ message: "not found" }, { status: 404 });

  const cid = makeId();
  const isMakerReply = p.makerId === user.id;

  await db.insert(showcaseComments).values({
    id: cid,
    productId,
    authorId: user.id,
    content: parsed.data.content,
    isMakerReply,
  });
  await db
    .update(showcaseProducts)
    .set({ commentCount: sql`${showcaseProducts.commentCount} + 1` })
    .where(eq(showcaseProducts.id, productId));

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
    createdAt: new Date(),
    isMakerReply,
    authorName: author?.displayName ?? user.name,
    authorUsername: author?.username ?? null,
    authorAvatar: author?.avatarUrl ?? null,
  });
}
