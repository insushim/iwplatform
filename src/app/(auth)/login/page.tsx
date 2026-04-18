import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";
import { SocialButtons } from "@/components/auth/social-buttons";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "로그인" };

export default function LoginPage() {
  return (
    <AuthCard
      title="다시 만나서 반가워요"
      description="이메일 또는 소셜 계정으로 로그인하세요."
      footer={
        <span className="text-muted-foreground">
          계정이 없으신가요?{" "}
          <Link href="/signup" className="font-semibold text-primary hover:underline">
            가입하기
          </Link>
        </span>
      }
    >
      <SocialButtons />
      <div className="relative my-5 flex items-center">
        <div className="h-px flex-1 bg-border" />
        <span className="mx-3 text-xs text-muted-foreground">또는</span>
        <div className="h-px flex-1 bg-border" />
      </div>
      <LoginForm />
    </AuthCard>
  );
}
