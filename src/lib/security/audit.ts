import "server-only";
import { getDb } from "@/db";
import { auditLogs, securityEvents } from "@/db/schema";

export async function logAudit(input: {
  actorId?: string | null;
  action: string;
  targetType?: string;
  targetId?: string;
  changes?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}) {
  try {
    const db = getDb();
    await db.insert(auditLogs).values({
      actorId: input.actorId ?? null,
      action: input.action,
      targetType: input.targetType,
      targetId: input.targetId,
      changes: input.changes,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    });
  } catch {
    // 로깅은 실패해도 요청 실패로 이어지게 하지 않는다
  }
}

export async function logSecurityEvent(input: {
  eventType: string;
  userId?: string | null;
  email?: string;
  ipAddress: string;
  userAgent?: string;
  details?: Record<string, unknown>;
}) {
  try {
    const db = getDb();
    await db.insert(securityEvents).values({
      eventType: input.eventType,
      userId: input.userId ?? null,
      email: input.email,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
      details: input.details,
    });
  } catch {
    // noop
  }
}
