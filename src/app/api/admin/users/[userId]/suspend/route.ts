import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireRole } from "@/lib/auth/session";
import { logAudit } from "@/lib/security/audit";
import { z } from "zod";

const schema = z.object({
  suspend: z.boolean(),
  reason: z.string().max(500).optional(),
  days: z.number().int().min(1).max(365).optional(),
});

export async function POST(req: Request, ctx: { params: Promise<{ userId: string }> }) {
  const result = await requireRole(["admin", "super_admin"]).catch(() => null);
  if (!result) return NextResponse.json({ message: "FORBIDDEN" }, { status: 403 });
  const { userId } = await ctx.params;
  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ message: "bad" }, { status: 400 });

  const db = getDb();
  const suspendedUntil = parsed.data.suspend && parsed.data.days
    ? new Date(Date.now() + parsed.data.days * 86400_000)
    : null;

  await db
    .update(profiles)
    .set({
      isSuspended: parsed.data.suspend,
      suspendedUntil,
      suspendedReason: parsed.data.suspend ? (parsed.data.reason ?? null) : null,
    })
    .where(eq(profiles.userId, userId));

  await logAudit({
    actorId: result.user.id,
    action: parsed.data.suspend ? "user.suspended" : "user.unsuspended",
    targetType: "user",
    targetId: userId,
    changes: { reason: parsed.data.reason, days: parsed.data.days },
  });
  return NextResponse.json({ ok: true });
}
