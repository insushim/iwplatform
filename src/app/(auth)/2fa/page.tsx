import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";
import { TotpForm } from "./totp-form";

export const metadata: Metadata = { title: "2단계 인증" };

export default function TwoFactorPage() {
  return (
    <AuthCard
      title="2단계 인증"
      description="앱(Google Authenticator 등)에 표시된 6자리 코드를 입력하세요."
    >
      <TotpForm />
    </AuthCard>
  );
}
