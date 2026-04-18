import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { posts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth/session";
import { postUpdateSchema } from "@/lib/validators";
import { sanitizeHtml } from "@/lib/utils/sanitize";
import { logAudit } from "@/lib/security/audit";

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "UNAUTHENTICATED" }, { status: 401 });
  const { id } = await ctx.params;
  const db = getDb();
  const [post] = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  if (!post) return NextResponse.json({ message: "not found" }, { status: 404 });
  if (post.authorId !== user.id) {
    return NextResponse.json({ message: "FORBIDDEN" }, { status: 403 });
  }

  const parsed = postUpdateSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ message: "bad" }, { status: 400 });

  const update: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.content) update.content = sanitizeHtml(parsed.data.content);

  await db.update(posts).set(update).where(eq(posts.id, id));
  await logAudit({
    actorId: user.id,
    action: "post.updated",
    targetType: "post",
    targetId: id,
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "UNAUTHENTICATED" }, { status: 401 });
  const { id } = await ctx.params;
  const db = getDb();
  const [post] = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  if (!post) return NextResponse.json({ message: "not found" }, { status: 404 });
  if (post.authorId !== user.id) {
    return NextResponse.json({ message: "FORBIDDEN" }, { status: 403 });
  }
  await db
    .update(posts)
    .set({ status: "deleted", deletedAt: new Date() })
    .where(eq(posts.id, id));
  await logAudit({
    actorId: user.id,
    action: "post.deleted",
    targetType: "post",
    targetId: id,
  });
  return NextResponse.json({ ok: true });
}
