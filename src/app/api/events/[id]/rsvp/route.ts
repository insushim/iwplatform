import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { events, eventAttendees } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth/session";

export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "UNAUTHENTICATED" }, { status: 401 });
  const { id } = await ctx.params;
  const db = getDb();
  try {
    await db.insert(eventAttendees).values({
      eventId: id,
      userId: user.id,
      status: "registered",
    });
    await db
      .update(events)
      .set({ attendeeCount: sql`${events.attendeeCount} + 1` })
      .where(eq(events.id, id));
  } catch {
    // 이미 등록
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "UNAUTHENTICATED" }, { status: 401 });
  const { id } = await ctx.params;
  const db = getDb();
  const res = await db
    .delete(eventAttendees)
    .where(and(eq(eventAttendees.eventId, id), eq(eventAttendees.userId, user.id)))
    .returning({ uid: eventAttendees.userId });
  if (res.length > 0) {
    await db
      .update(events)
      .set({ attendeeCount: sql`max(${events.attendeeCount} - 1, 0)` })
      .where(eq(events.id, id));
  }
  return NextResponse.json({ ok: true });
}
