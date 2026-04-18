import type { Metadata } from "next";
import Link from "next/link";
import { getDb } from "@/db";
import {
  conversationParticipants,
  conversations,
  messages,
  profiles,
} from "@/db/schema";
import { and, desc, eq, ne } from "drizzle-orm";
import { requireAuth } from "@/lib/auth/session";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { timeAgo } from "@/lib/utils/date";
import { MessageSquare } from "lucide-react";

export const metadata: Metadata = { title: "메시지" };

export default async function MessagesIndex() {
  const { user } = await requireAuth();
  const db = getDb();

  const myParts = await db
    .select({ cid: conversationParticipants.conversationId })
    .from(conversationParticipants)
    .where(eq(conversationParticipants.userId, user.id))
    .catch(() => []);
  const myCids = myParts.map((p) => p.cid);

  if (myCids.length === 0) {
    return (
      <div className="container-reading py-12">
        <h1 className="text-3xl font-bold tracking-tight">메시지</h1>
        <div className="mt-8 rounded-xl border bg-card p-12 text-center">
          <MessageSquare className="mx-auto size-10 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">
            아직 대화가 없습니다. 다른 선생님의 프로필에서 메시지를 시작해 보세요.
          </p>
        </div>
      </div>
    );
  }

  const convs = await Promise.all(
    myCids.map(async (cid) => {
      const [conv] = await db
        .select()
        .from(conversations)
        .where(eq(conversations.id, cid))
        .limit(1);
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
            eq(conversationParticipants.conversationId, cid),
            ne(conversationParticipants.userId, user.id),
          ),
        )
        .limit(1);
      const [last] = await db
        .select({ content: messages.content, createdAt: messages.createdAt })
        .from(messages)
        .where(eq(messages.conversationId, cid))
        .orderBy(desc(messages.createdAt))
        .limit(1);
      return { conv, partner, last };
    }),
  );

  convs.sort(
    (a, b) =>
      (b.last?.createdAt?.getTime() ?? b.conv?.createdAt?.getTime() ?? 0) -
      (a.last?.createdAt?.getTime() ?? a.conv?.createdAt?.getTime() ?? 0),
  );

  return (
    <div className="container-reading py-8">
      <h1 className="text-3xl font-bold tracking-tight">메시지</h1>
      <ul className="mt-6 divide-y rounded-xl border bg-card">
        {convs.map(({ conv, partner, last }) =>
          conv && partner ? (
            <li key={conv.id}>
              <Link
                href={`/messages/${conv.id}`}
                className="flex items-center gap-3 p-4 transition hover:bg-muted/40"
              >
                <Avatar className="size-11">
                  {partner.avatarUrl ? (
                    <AvatarImage src={partner.avatarUrl} alt={partner.displayName} />
                  ) : null}
                  <AvatarFallback>{partner.displayName[0]}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between">
                    <p className="truncate font-semibold">{partner.displayName}</p>
                    {last ? (
                      <span className="text-xs text-muted-foreground">
                        {timeAgo(last.createdAt)}
                      </span>
                    ) : null}
                  </div>
                  {last ? (
                    <p className="truncate text-sm text-muted-foreground">{last.content}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">대화 시작 전</p>
                  )}
                </div>
              </Link>
            </li>
          ) : null,
        )}
      </ul>
    </div>
  );
}
