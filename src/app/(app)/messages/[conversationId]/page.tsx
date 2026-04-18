import { notFound } from "next/navigation";
import Link from "next/link";
import { getDb } from "@/db";
import {
  conversationParticipants,
  messages,
  profiles,
} from "@/db/schema";
import { and, asc, eq, ne } from "drizzle-orm";
import { requireAuth } from "@/lib/auth/session";
import { ArrowLeft } from "lucide-react";
import { MessageComposer } from "./composer";

export default async function Conversation({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = await params;
  const { user } = await requireAuth();
  const db = getDb();

  const [participation] = await db
    .select({ cid: conversationParticipants.conversationId })
    .from(conversationParticipants)
    .where(
      and(
        eq(conversationParticipants.conversationId, conversationId),
        eq(conversationParticipants.userId, user.id),
      ),
    )
    .limit(1);
  if (!participation) notFound();

  const [partner] = await db
    .select({
      userId: profiles.userId,
      username: profiles.username,
      displayName: profiles.displayName,
      avatarUrl: profiles.avatarUrl,
    })
    .from(conversationParticipants)
    .innerJoin(profiles, eq(profiles.userId, conversationParticipants.userId))
    .where(
      and(
        eq(conversationParticipants.conversationId, conversationId),
        ne(conversationParticipants.userId, user.id),
      ),
    )
    .limit(1);

  const msgs = await db
    .select({
      id: messages.id,
      content: messages.content,
      senderId: messages.senderId,
      createdAt: messages.createdAt,
      isDeleted: messages.isDeleted,
    })
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(asc(messages.createdAt))
    .limit(200);

  await db
    .update(conversationParticipants)
    .set({ lastReadAt: new Date() })
    .where(
      and(
        eq(conversationParticipants.conversationId, conversationId),
        eq(conversationParticipants.userId, user.id),
      ),
    );

  return (
    <div className="container-reading flex min-h-[80vh] flex-col py-4">
      <header className="flex items-center gap-3 border-b py-3">
        <Link
          href="/messages"
          className="rounded-md p-2 hover:bg-muted"
          aria-label="목록으로"
        >
          <ArrowLeft className="size-4" />
        </Link>
        {partner ? (
          <Link href={`/u/${partner.username}`} className="font-semibold hover:text-primary">
            {partner.displayName}{" "}
            <span className="text-xs text-muted-foreground">@{partner.username}</span>
          </Link>
        ) : (
          <span className="text-muted-foreground">대화 상대 없음</span>
        )}
      </header>

      <ul className="flex-1 space-y-3 py-6">
        {msgs.length === 0 ? (
          <li className="py-10 text-center text-sm text-muted-foreground">
            첫 메시지를 남겨 주세요.
          </li>
        ) : (
          msgs.map((m) => {
            const mine = m.senderId === user.id;
            return (
              <li
                key={m.id}
                className={mine ? "flex justify-end" : "flex justify-start"}
              >
                <div
                  className={
                    mine
                      ? "max-w-[75%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2 text-primary-foreground"
                      : "max-w-[75%] rounded-2xl rounded-tl-sm border bg-card px-4 py-2"
                  }
                >
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {m.isDeleted ? "삭제된 메시지" : m.content}
                  </p>
                </div>
              </li>
            );
          })
        )}
      </ul>

      <MessageComposer conversationId={conversationId} />
    </div>
  );
}
