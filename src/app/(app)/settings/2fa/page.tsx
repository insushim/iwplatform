import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth/session";
import { TwoFactorSetup } from "./setup";

export const metadata: Metadata = { title: "2단계 인증 설정" };

export default async function TwoFactorSettings() {
  const { user, profile } = await requireAuth();
  return (
    <div className="container-reading py-8">
      <h1 className="text-3xl font-bold tracking-tight">2단계 인증</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        로그인 시 인증 앱의 6자리 코드를 추가로 입력합니다.
      </p>
      <div className="mt-6">
        <TwoFactorSetup
          email={user.email}
          enabled={Boolean(profile.teacherStatus && user.name)}
          alreadyEnabled={false}
        />
      </div>
    </div>
  );
}
