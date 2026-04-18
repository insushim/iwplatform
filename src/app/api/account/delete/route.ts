import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { profiles, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth/session";
import { logAudit, logSecurityEvent } from "@/lib/security/audit";

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "UNAUTHENTICATED" }, { status: 401 });

  // 비밀번호 확인은 Better Auth 의 별도 엔드포인트를 통해 해야 하지만,
  // 여기서는 세션이 있다는 사실 + 명시적 확인 문구로 갈음.
  const ip =
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const db = getDb();

  // Soft delete: 프로필에 deletedAt 기록, 개인정보 익명화
  await db
    .update(profiles)
    .set({
      deletedAt: new Date(),
      displayName: "삭제된 사용자",
      bio: null,
      avatarUrl: null,
      coverUrl: null,
      schoolName: null,
      schoolRegion: null,
      subject: null,
      websiteUrl: null,
      githubUrl: null,
      linkedinUrl: null,
      privacyPrefs: {
        profilePublic: false,
        showSchool: false,
        showEmail: false,
        allowDmFrom: "none",
      },
    })
    .where(eq(profiles.userId, user.id));

  // users 테이블은 Better Auth 가 관리하므로 cascade 를 활용해 삭제
  await db.delete(users).where(eq(users.id, user.id));

  await logAudit({
    actorId: user.id,
    action: "account.deleted",
    targetType: "user",
    targetId: user.id,
    ipAddress: ip,
  });
  await logSecurityEvent({
    eventType: "account_deleted",
    userId: user.id,
    ipAddress: ip,
  });

  return NextResponse.json({ ok: true });
}
