import "server-only";
import { getDb } from "@/db";
import { notifications, profiles } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { id as makeId } from "@/lib/utils/slug";
import { sendPushToUser } from "./push";

type NotificationType =
  | "reply"
  | "mention"
  | "follow"
  | "vote"
  | "reaction"
  | "dm"
  | "badge"
  | "launch"
  | "system"
  | "teacher_verified";

export async function createNotification(input: {
  userId: string;
  type: NotificationType;
  actorId?: string | null;
  targetType?: string;
  targetId?: string;
  title: string;
  body?: string;
  link?: string;
}) {
  try {
    const db = getDb();
    if (input.actorId === input.userId) return; // 자기 자신은 알림 안함
    await db.insert(notifications).values({
      id: makeId(),
      userId: input.userId,
      type: input.type,
      actorId: input.actorId ?? null,
      targetType: input.targetType,
      targetId: input.targetId,
      title: input.title,
      body: input.body,
      link: input.link,
    });
    // push도 시도
    await sendPushToUser(input.userId, {
      title: input.title,
      body: input.body,
      url: input.link,
    });
  } catch {
    // noop
  }
}

/**
 * 텍스트에서 @username 추출 → profiles 조회 → 유효한 userId 목록 반환.
 * 한글 username도 허용.
 */
export async function resolveMentions(text: string): Promise<Array<{ userId: string; username: string }>> {
  const re = /@([a-zA-Z0-9_가-힣]{2,20})/gu;
  const names = new Set<string>();
  for (const m of text.matchAll(re)) names.add(m[1]);
  if (names.size === 0) return [];
  try {
    const db = getDb();
    const rows = await db
      .select({ userId: profiles.userId, username: profiles.username })
      .from(profiles)
      .where(inArray(profiles.username, [...names]));
    return rows;
  } catch {
    return [];
  }
}

export async function notifyMentions(input: {
  text: string;
  actorId: string;
  actorName: string;
  targetType: string;
  targetId: string;
  link: string;
  preview: string;
}) {
  const mentions = await resolveMentions(input.text);
  await Promise.all(
    mentions
      .filter((m) => m.userId !== input.actorId)
      .map((m) =>
        createNotification({
          userId: m.userId,
          type: "mention",
          actorId: input.actorId,
          targetType: input.targetType,
          targetId: input.targetId,
          title: `${input.actorName}님이 회원님을 언급했어요`,
          body: input.preview,
          link: input.link,
        }),
      ),
  );
}

export async function markAllRead(userId: string) {
  try {
    const db = getDb();
    await db
      .update(notifications)
      .set({ isRead: true, readAt: new Date() })
      .where(eq(notifications.userId, userId));
  } catch {
    // noop
  }
}
