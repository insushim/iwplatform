import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth/session";
import { SubmitForm } from "./submit-form";

export const metadata: Metadata = { title: "앱 제출하기" };

export default async function SubmitShowcasePage() {
  const { profile } = await requireAuth().catch(() => {
    redirect("/login?redirect=/showcase/submit");
  });
  if (profile.teacherStatus !== "verified") redirect("/verify-teacher?reason=showcase");

  return (
    <div className="container-reading py-8">
      <h1 className="text-3xl font-bold tracking-tight">앱·SaaS 제출</h1>
      <p className="mt-2 text-muted-foreground">
        제출하신 앱은 매주 월요일 런치 데이에 공개됩니다. 스크린샷 3장 이상 권장.
      </p>
      <div className="mt-6">
        <SubmitForm />
      </div>
    </div>
  );
}
