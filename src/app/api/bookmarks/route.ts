import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { bookmarks, posts } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth/session";
import { id as makeId } from "@/lib/utils/slug";
import { z } from "zod";

const schema = z.object({ postId: z.string().min(1) });

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "UNAUTHENTICATED" }, { status: 401 });
  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ message: "bad" }, { status: 400 });
  const db = getDb();
  const [existing] = await db
    .select({ id: bookmarks.id })
    .from(bookmarks)
    .where(and(eq(bookmarks.userId, user.id), eq(bookmarks.postId, parsed.data.postId)))
    .limit(1);
  if (existing) return NextResponse.json({ ok: true, already: true });
  await db.insert(bookmarks).values({
    id: makeId(),
    userId: user.id,
    postId: parsed.data.postId,
  });
  await db
    .update(posts)
    .set({ bookmarkCount: sql`${posts.bookmarkCount} + 1` })
    .where(eq(posts.id, parsed.data.postId));
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "UNAUTHENTICATED" }, { status: 401 });
  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ message: "bad" }, { status: 400 });
  const db = getDb();
  const res = await db
    .delete(bookmarks)
    .where(and(eq(bookmarks.userId, user.id), eq(bookmarks.postId, parsed.data.postId)))
    .returning({ id: bookmarks.id });
  if (res.length > 0) {
    await db
      .update(posts)
      .set({ bookmarkCount: sql`max(${posts.bookmarkCount} - 1, 0)` })
      .where(eq(posts.id, parsed.data.postId));
  }
  return NextResponse.json({ ok: true });
}
