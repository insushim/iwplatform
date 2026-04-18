import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth/session";
import { PromptForm } from "./prompt-form";

export const metadata: Metadata = { title: "프롬프트 공유" };

export default async function NewPromptPage() {
  const { profile } = await requireAuth().catch(() => {
    redirect("/login?redirect=/prompts/new");
  });
  if (profile.teacherStatus !== "verified") redirect("/verify-teacher");
  return (
    <div className="container-reading py-8">
      <h1 className="text-3xl font-bold tracking-tight">프롬프트 공유</h1>
      <p className="mt-2 text-muted-foreground">
        다른 선생님들이 바로 써먹을 수 있도록 예시 입력·출력도 함께 남겨주세요.
      </p>
      <div className="mt-6">
        <PromptForm />
      </div>
    </div>
  );
}
