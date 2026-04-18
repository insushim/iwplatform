import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";
import { ResetForm } from "./reset-form";

export const metadata: Metadata = { title: "비밀번호 재설정" };

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return (
    <AuthCard title="새 비밀번호 설정" description="앞으로 사용할 비밀번호를 입력해 주세요.">
      <ResetForm token={token ?? ""} />
    </AuthCard>
  );
}
