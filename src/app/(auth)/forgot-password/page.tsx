import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";
import { ForgotForm } from "./forgot-form";

export const metadata: Metadata = { title: "비밀번호 찾기" };

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="비밀번호를 잊으셨나요?"
      description="가입 시 사용한 이메일을 입력하시면 재설정 링크를 보내드립니다."
      footer={
        <Link href="/login" className="text-muted-foreground hover:text-primary hover:underline">
          로그인으로 돌아가기
        </Link>
      }
    >
      <ForgotForm />
    </AuthCard>
  );
}
