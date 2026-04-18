import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth/session";
import { getDb } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { PrivacyForm } from "./privacy-form";

export const metadata: Metadata = { title: "프라이버시" };

export default async function PrivacySettingsPage() {
  const { user } = await requireAuth();
  const db = getDb();
  const [row] = await db.select().from(profiles).where(eq(profiles.userId, user.id)).limit(1);
  const defaults = {
    profilePublic: true,
    showSchool: false,
    showEmail: false,
    allowDmFrom: "verified" as const,
  };
  const prefs = row?.privacyPrefs ?? defaults;
  return (
    <div className="container-reading py-8">
      <h1 className="text-3xl font-bold tracking-tight">프라이버시</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        공개 범위와 DM 수신을 설정합니다.
      </p>
      <div className="mt-6">
        <PrivacyForm initial={prefs} />
      </div>
    </div>
  );
}
