import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { teacherVerifications, profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth/session";
import { teacherVerifySchema } from "@/lib/validators";
import { id as makeId } from "@/lib/utils/slug";
import { logAudit } from "@/lib/security/audit";


export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "UNAUTHENTICATED" }, { status: 401 });

  const parsed = teacherVerifySchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json(
      { message: "유효성 검증 실패", issues: parsed.error.format() },
      { status: 400 },
    );
  }

  const db = getDb();

  const ip = req.headers.get("cf-connecting-ip") ?? undefined;
  const ua = req.headers.get("user-agent") ?? undefined;

  await db.insert(teacherVerifications).values({
    id: makeId(),
    userId: user.id,
    method: parsed.data.method,
    documentUrl: parsed.data.documentUrl,
    documentHash: parsed.data.documentHash,
    schoolName: parsed.data.schoolName,
    teacherLevel: parsed.data.teacherLevel,
    schoolEmail: parsed.data.schoolEmail,
    status: "pending",
    ipAddress: ip,
    userAgent: ua,
  });

  await db
    .update(profiles)
    .set({
      teacherStatus: "pending",
      teacherLevel: parsed.data.teacherLevel,
      schoolName: parsed.data.schoolName,
      schoolRegion: parsed.data.schoolRegion,
      subject: parsed.data.subject,
      yearsOfTeaching: parsed.data.yearsOfTeaching,
    })
    .where(eq(profiles.userId, user.id));

  await logAudit({
    actorId: user.id,
    action: "teacher.verification.requested",
    targetType: "user",
    targetId: user.id,
    ipAddress: ip,
  });

  return NextResponse.json({ ok: true });
}
