import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { follows, profiles } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth/session";
import { z } from "zod";

const schema = z.object({ targetUserId: z.string().min(1) });

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "UNAUTHENTICATED" }, { status: 401 });
  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ message: "bad" }, { status: 400 });
  if (parsed.data.targetUserId === user.id) {
    return NextResponse.json({ message: "자기 자신은 팔로우할 수 없습니다" }, { status: 400 });
  }
  const db = getDb();
  try {
    await db.insert(follows).values({
      followerId: user.id,
      followingId: parsed.data.targetUserId,
    });
    await db
      .update(profiles)
      .set({ followersCount: sql`${profiles.followersCount} + 1` })
      .where(eq(profiles.userId, parsed.data.targetUserId));
    await db
      .update(profiles)
      .set({ followingCount: sql`${profiles.followingCount} + 1` })
      .where(eq(profiles.userId, user.id));
  } catch {
    // unique constraint → 이미 팔로우 중
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "UNAUTHENTICATED" }, { status: 401 });
  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ message: "bad" }, { status: 400 });
  const db = getDb();
  const res = await db
    .delete(follows)
    .where(
      and(
        eq(follows.followerId, user.id),
        eq(follows.followingId, parsed.data.targetUserId),
      ),
    )
    .returning({ fid: follows.followerId });
  if (res.length > 0) {
    await db
      .update(profiles)
      .set({ followersCount: sql`max(${profiles.followersCount} - 1, 0)` })
      .where(eq(profiles.userId, parsed.data.targetUserId));
    await db
      .update(profiles)
      .set({ followingCount: sql`max(${profiles.followingCount} - 1, 0)` })
      .where(eq(profiles.userId, user.id));
  }
  return NextResponse.json({ ok: true });
}
