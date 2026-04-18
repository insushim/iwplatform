import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth/session";
import { getDb } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ProfileForm } from "./profile-form";

export const metadata: Metadata = { title: "프로필 설정" };

export default async function ProfileSettingsPage() {
  const { user } = await requireAuth();
  const db = getDb();
  const [row] = await db.select().from(profiles).where(eq(profiles.userId, user.id)).limit(1);
  return (
    <div className="container-reading py-8">
      <h1 className="text-3xl font-bold tracking-tight">프로필 설정</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        동료 교사들이 보게 될 당신의 소개입니다.
      </p>
      <div className="mt-6">
        <ProfileForm
          initial={{
            displayName: row?.displayName ?? user.name,
            bio: row?.bio ?? "",
            subject: row?.subject ?? "",
            yearsOfTeaching: row?.yearsOfTeaching ?? null,
            websiteUrl: row?.websiteUrl ?? "",
            githubUrl: row?.githubUrl ?? "",
          }}
        />
      </div>
    </div>
  );
}
