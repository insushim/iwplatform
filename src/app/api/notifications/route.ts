import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { notifications } from "@/db/schema";
import { and, desc, eq, inArray } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth/session";
import { z } from "zod";

export async function GET(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "UNAUTHENTICATED" }, { status: 401 });
  const url = new URL(req.url);
  const unreadOnly = url.searchParams.get("unread") === "1";
  const db = getDb();
  const where = unreadOnly
    ? and(eq(notifications.userId, user.id), eq(notifications.isRead, false))
    : eq(notifications.userId, user.id);
  const rows = await db
    .select()
    .from(notifications)
    .where(where)
    .orderBy(desc(notifications.createdAt))
    .limit(50);
  return NextResponse.json({ notifications: rows });
}

const patchSchema = z.object({
  ids: z.array(z.string()).optional(),
  markAllRead: z.boolean().optional(),
});

export async function PATCH(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "UNAUTHENTICATED" }, { status: 401 });
  const parsed = patchSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ message: "bad" }, { status: 400 });
  const db = getDb();
  if (parsed.data.markAllRead) {
    await db
      .update(notifications)
      .set({ isRead: true, readAt: new Date() })
      .where(eq(notifications.userId, user.id));
  } else if (parsed.data.ids?.length) {
    await db
      .update(notifications)
      .set({ isRead: true, readAt: new Date() })
      .where(
        and(
          eq(notifications.userId, user.id),
          inArray(notifications.id, parsed.data.ids),
        ),
      );
  }
  return NextResponse.json({ ok: true });
}
