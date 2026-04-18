import { NextResponse } from "next/server";
import { getDb } from "@/db";
import {
  conversationParticipants,
  conversations,
  profiles,
} from "@/db/schema";
import { and, eq, inArray } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth/session";
import { id as makeId } from "@/lib/utils/slug";
import { z } from "zod";

const schema = z.object({ targetUserId: z.string().min(1) });

/** 상대방과의 기존 대화가 있으면 반환, 없으면 생성 */
export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "UNAUTHENTICATED" }, { status: 401 });
  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ message: "bad" }, { status: 400 });
  if (parsed.data.targetUserId === user.id) {
    return NextResponse.json({ message: "자기 자신과 대화할 수 없습니다" }, { status: 400 });
  }

  const db = getDb();

  // 프라이버시 체크
  const [target] = await db
    .select({ privacy: profiles.privacyPrefs, teacher: profiles.teacherStatus })
    .from(profiles)
    .where(eq(profiles.userId, parsed.data.targetUserId))
    .limit(1);
  if (!target) return NextResponse.json({ message: "대상 없음" }, { status: 404 });
  const allow = target.privacy?.allowDmFrom ?? "verified";
  if (allow === "none") {
    return NextResponse.json({ message: "DM을 받지 않는 사용자입니다" }, { status: 403 });
  }

  // 기존 대화 찾기 (간단한 방법: 내 대화 중 target도 참여한 것)
  const myConvs = await db
    .select({ cid: conversationParticipants.conversationId })
    .from(conversationParticipants)
    .where(eq(conversationParticipants.userId, user.id));
  const myCids = myConvs.map((c) => c.cid);

  if (myCids.length > 0) {
    const shared = await db
      .select({ cid: conversationParticipants.conversationId })
      .from(conversationParticipants)
      .where(
        and(
          eq(conversationParticipants.userId, parsed.data.targetUserId),
          inArray(conversationParticipants.conversationId, myCids),
        ),
      )
      .limit(1);
    if (shared[0]) {
      return NextResponse.json({ conversationId: shared[0].cid, created: false });
    }
  }

  const cid = makeId();
  await db.insert(conversations).values({ id: cid });
  await db.insert(conversationParticipants).values([
    { conversationId: cid, userId: user.id },
    { conversationId: cid, userId: parsed.data.targetUserId },
  ]);
  return NextResponse.json({ conversationId: cid, created: true });
}
