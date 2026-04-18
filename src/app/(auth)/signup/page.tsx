import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";
import { SocialButtons } from "@/components/auth/social-buttons";
import { SignupForm } from "./signup-form";

export const metadata: Metadata = { title: "가입하기" };

export default function SignupPage() {
  return (
    <AuthCard
      title="에듀메이커스에 오신 걸 환영합니다"
      description="가입 후 교원 인증까지 3분이면 끝나요."
      footer={
        <span className="text-muted-foreground">
          이미 계정이 있나요?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            로그인
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
      <SignupForm />
    </AuthCard>
  );
}
