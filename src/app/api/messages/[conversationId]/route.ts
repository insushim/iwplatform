import { NextResponse } from "next/server";
import { getDb } from "@/db";
import {
  conversationParticipants,
  conversations,
  messages,
} from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth/session";
import { id as makeId } from "@/lib/utils/slug";
import { ipRateLimit } from "@/lib/security/rate-limit";
import { z } from "zod";

const schema = z.object({ content: z.string().min(1).max(5000) });

export async function POST(
  req: Request,
  ctx: { params: Promise<{ conversationId: string }> },
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "UNAUTHENTICATED" }, { status: 401 });
  const rl = await ipRateLimit(req, "dm", 60, 60 * 60);
  if (!rl.ok) return NextResponse.json({ message: "한도 초과" }, { status: 429 });

  const { conversationId } = await ctx.params;
  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ message: "bad" }, { status: 400 });

  const db = getDb();
  const [ok] = await db
    .select({ cid: conversationParticipants.conversationId })
    .from(conversationParticipants)
    .where(
      and(
        eq(conversationParticipants.conversationId, conversationId),
        eq(conversationParticipants.userId, user.id),
      ),
    )
    .limit(1);
  if (!ok) return NextResponse.json({ message: "대화 참여자가 아닙니다" }, { status: 403 });

  const mid = makeId();
  await db.insert(messages).values({
    id: mid,
    conversationId,
    senderId: user.id,
    content: parsed.data.content,
  });
  await db
    .update(conversations)
    .set({ lastMessageAt: new Date() })
    .where(eq(conversations.id, conversationId));
  return NextResponse.json({ id: mid });
}
