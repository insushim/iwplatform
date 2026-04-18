import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth/session";
import { Card, CardContent } from "@/components/ui/card";
import { AccountForms } from "./account-forms";

export const metadata: Metadata = { title: "계정 설정" };

export default async function AccountSettingsPage() {
  const { user, profile } = await requireAuth();
  return (
    <div className="container-reading py-8">
      <h1 className="text-3xl font-bold tracking-tight">계정</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        이메일, 비밀번호, 2단계 인증을 관리합니다.
      </p>

      <section className="mt-8 space-y-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold">계정 정보</h2>
            <dl className="mt-4 divide-y text-sm">
              <Row label="이메일" value={user.email} />
              <Row label="표시 이름" value={user.name} />
              <Row label="아이디" value={profile?.username ? `@${profile.username}` : "—"} />
              <Row
                label="교원 인증"
                value={
                  profile.teacherStatus === "verified"
                    ? "✓ 인증 완료"
                    : profile.teacherStatus === "pending"
                      ? "검토 중"
                      : "미인증"
                }
              />
            </dl>
          </CardContent>
        </Card>

        <AccountForms />
      </section>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
