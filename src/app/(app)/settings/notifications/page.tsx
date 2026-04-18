import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth/session";
import { getDb } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NotificationPrefsForm } from "./prefs-form";
import { Card, CardContent } from "@/components/ui/card";
import { PushSubscribeButton } from "@/components/notifications/push-subscribe-button";

export const metadata: Metadata = { title: "알림 설정" };

export default async function NotificationSettingsPage() {
  const { user } = await requireAuth();
  const db = getDb();
  const [row] = await db.select().from(profiles).where(eq(profiles.userId, user.id)).limit(1);
  const defaults = {
    emailMentions: true,
    emailReplies: true,
    emailDm: true,
    emailDigest: true,
    pushMentions: true,
    pushReplies: true,
    pushDm: true,
  };
  const prefs = row?.notificationPrefs ?? defaults;
  return (
    <div className="container-reading py-8">
      <h1 className="text-3xl font-bold tracking-tight">알림</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        무엇을 어떻게 받을지 고르세요.
      </p>
      <div className="mt-6 space-y-6">
        <NotificationPrefsForm initial={prefs} />
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold">브라우저 푸시</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              이 기기의 브라우저에서 실시간 알림을 받습니다. (PWA 설치 시에도 동작)
            </p>
            <div className="mt-4">
              <PushSubscribeButton />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
