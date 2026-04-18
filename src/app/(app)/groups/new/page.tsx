import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth/session";
import { GroupForm } from "./group-form";

export const metadata: Metadata = { title: "새 모임 만들기" };

export default async function NewGroupPage() {
  const { profile } = await requireAuth().catch(() => {
    redirect("/login?redirect=/groups/new");
  });
  if (profile.teacherStatus !== "verified") redirect("/verify-teacher");
  return (
    <div className="container-reading py-8">
      <h1 className="text-3xl font-bold tracking-tight">새 모임 만들기</h1>
      <p className="mt-2 text-muted-foreground">관심사를 나눌 선생님들을 모아 보세요.</p>
      <div className="mt-6">
        <GroupForm />
      </div>
    </div>
  );
}
