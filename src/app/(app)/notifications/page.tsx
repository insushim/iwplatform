import type { Metadata } from "next";
import { getDb } from "@/db";
import { notifications } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { requireAuth } from "@/lib/auth/session";
import { Bell } from "lucide-react";
import { timeAgo } from "@/lib/utils/date";
import Link from "next/link";

export const metadata: Metadata = { title: "알림" };

export default async function NotificationsPage() {
  const { user } = await requireAuth();
  const db = getDb();
  const rows = await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, user.id))
    .orderBy(desc(notifications.createdAt))
    .limit(50)
    .catch(() => []);

  return (
    <div className="container-reading py-8">
      <h1 className="text-3xl font-bold tracking-tight">알림</h1>
      {rows.length === 0 ? (
        <div className="mt-12 rounded-xl border bg-card p-12 text-center">
          <Bell className="mx-auto size-10 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">아직 알림이 없습니다.</p>
        </div>
      ) : (
        <ul className="mt-6 space-y-2">
          {rows.map((n) => (
            <li
              key={n.id}
              className={`rounded-md border p-4 ${n.isRead ? "bg-card" : "bg-primary/5"}`}
            >
              {n.link ? (
                <Link href={n.link}>
                  <p className="font-medium">{n.title}</p>
                  {n.body ? <p className="mt-1 text-sm text-muted-foreground">{n.body}</p> : null}
                </Link>
              ) : (
                <>
                  <p className="font-medium">{n.title}</p>
                  {n.body ? <p className="mt-1 text-sm text-muted-foreground">{n.body}</p> : null}
                </>
              )}
              <p className="mt-2 text-xs text-muted-foreground">{timeAgo(n.createdAt)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
