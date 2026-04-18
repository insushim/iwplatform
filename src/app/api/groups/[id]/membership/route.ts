import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { groupMembers, groups } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth/session";

export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "UNAUTHENTICATED" }, { status: 401 });
  const { id } = await ctx.params;
  const db = getDb();
  const [g] = await db.select().from(groups).where(eq(groups.id, id)).limit(1);
  if (!g) return NextResponse.json({ message: "not found" }, { status: 404 });
  const status = g.requiresApproval ? "pending" : "active";
  try {
    await db.insert(groupMembers).values({
      groupId: id,
      userId: user.id,
      role: "member",
      status,
    });
    if (status === "active") {
      await db
        .update(groups)
        .set({ memberCount: sql`${groups.memberCount} + 1` })
        .where(eq(groups.id, id));
    }
  } catch {
    // 이미 가입
  }
  return NextResponse.json({ status });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "UNAUTHENTICATED" }, { status: 401 });
  const { id } = await ctx.params;
  const db = getDb();
  const res = await db
    .delete(groupMembers)
    .where(and(eq(groupMembers.groupId, id), eq(groupMembers.userId, user.id)))
    .returning({ uid: groupMembers.userId });
  if (res.length > 0) {
    await db
      .update(groups)
      .set({ memberCount: sql`max(${groups.memberCount} - 1, 0)` })
      .where(eq(groups.id, id));
  }
  return NextResponse.json({ ok: true });
}
