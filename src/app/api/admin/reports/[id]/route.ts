import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { reports } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireRole } from "@/lib/auth/session";
import { logAudit } from "@/lib/security/audit";
import { z } from "zod";

const schema = z.object({
  status: z.enum(["resolved", "dismissed", "reviewing"]),
  actionTaken: z.string().max(500).optional(),
});

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const result = await requireRole(["moderator", "admin", "super_admin"]).catch(() => null);
  if (!result) return NextResponse.json({ message: "FORBIDDEN" }, { status: 403 });
  const { id } = await ctx.params;
  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ message: "bad" }, { status: 400 });
  const db = getDb();
  await db
    .update(reports)
    .set({
      status: parsed.data.status,
      actionTaken: parsed.data.actionTaken,
      reviewedBy: result.user.id,
      reviewedAt: new Date(),
    })
    .where(eq(reports.id, id));
  await logAudit({
    actorId: result.user.id,
    action: "report.handled",
    targetType: "report",
    targetId: id,
    changes: { status: parsed.data.status },
  });
  return NextResponse.json({ ok: true });
}
