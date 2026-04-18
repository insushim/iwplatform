import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { teacherVerifications, profiles, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireRole } from "@/lib/auth/session";
import { logAudit } from "@/lib/security/audit";
import { sendEmail } from "@/lib/email/client";
import { teacherVerifiedEmail } from "@/lib/email/templates";
import { createNotification } from "@/lib/notifications";


export async function POST(req: Request) {
  const { user } = await requireRole(["admin", "super_admin"]).catch(() => ({ user: null as never }));
  if (!user) return NextResponse.json({ message: "FORBIDDEN" }, { status: 403 });
  const form = await req.formData();
  const id = String(form.get("verificationId") ?? "");
  if (!id) return NextResponse.json({ message: "bad" }, { status: 400 });
  const db = getDb();
  const [v] = await db
    .select()
    .from(teacherVerifications)
    .where(eq(teacherVerifications.id, id))
    .limit(1);
  if (!v) return NextResponse.redirect(new URL("/admin/teacher-verification", req.url), 303);

  const expiresAt = new Date();
  expiresAt.setFullYear(expiresAt.getFullYear() + 1);

  await db
    .update(teacherVerifications)
    .set({
      status: "verified",
      reviewedBy: user.id,
      reviewedAt: new Date(),
      expiresAt,
    })
    .where(eq(teacherVerifications.id, id));

  await db
    .update(profiles)
    .set({ teacherStatus: "verified" })
    .where(eq(profiles.userId, v.userId));

  await logAudit({
    actorId: user.id,
    action: "teacher.verified",
    targetType: "user",
    targetId: v.userId,
  });

  // 이메일 + 인앱 알림
  const [target] = await db
    .select({
      email: users.email,
      displayName: profiles.displayName,
    })
    .from(users)
    .leftJoin(profiles, eq(profiles.userId, users.id))
    .where(eq(users.id, v.userId))
    .limit(1);
  if (target?.email) {
    const tpl = teacherVerifiedEmail(target.displayName ?? "선생님");
    void sendEmail({ to: target.email, subject: tpl.subject, html: tpl.html });
  }
  void createNotification({
    userId: v.userId,
    type: "teacher_verified",
    title: "교원 인증이 승인되었어요 ✓",
    body: "이제 글쓰기·쇼케이스·DM 모든 기능을 사용할 수 있습니다.",
    link: "/feed",
  });

  return NextResponse.redirect(new URL("/admin/teacher-verification", req.url), 303);
}
