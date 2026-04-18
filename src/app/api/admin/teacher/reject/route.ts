import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { teacherVerifications, profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireRole } from "@/lib/auth/session";
import { logAudit } from "@/lib/security/audit";


export async function POST(req: Request) {
  const { user } = await requireRole(["admin", "super_admin"]).catch(() => ({ user: null as never }));
  if (!user) return NextResponse.json({ message: "FORBIDDEN" }, { status: 403 });
  const form = await req.formData();
  const id = String(form.get("verificationId") ?? "");
  const reason = String(form.get("reason") ?? "추가 증빙 필요");
  if (!id) return NextResponse.json({ message: "bad" }, { status: 400 });

  const db = getDb();
  const [v] = await db
    .select()
    .from(teacherVerifications)
    .where(eq(teacherVerifications.id, id))
    .limit(1);
  if (!v) return NextResponse.redirect(new URL("/admin/teacher-verification", req.url), 303);

  await db
    .update(teacherVerifications)
    .set({
      status: "rejected",
      reviewedBy: user.id,
      reviewedAt: new Date(),
      rejectionReason: reason,
    })
    .where(eq(teacherVerifications.id, id));

  await db
    .update(profiles)
    .set({ teacherStatus: "rejected" })
    .where(eq(profiles.userId, v.userId));

  await logAudit({
    actorId: user.id,
    action: "teacher.rejected",
    targetType: "user",
    targetId: v.userId,
    changes: { reason },
  });

  return NextResponse.redirect(new URL("/admin/teacher-verification", req.url), 303);
}
