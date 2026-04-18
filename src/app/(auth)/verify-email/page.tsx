import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "이메일 인증" };

export default function VerifyEmailPage() {
  return (
    <AuthCard title="이메일을 확인해 주세요" description="받은 편지함에서 인증 링크를 눌러주세요.">
      <div className="flex flex-col items-center text-center">
        <MailCheck className="size-14 text-primary" />
        <p className="mt-4 text-sm text-muted-foreground">
          스팸 폴더에도 확인해 보세요. 10분 내에 도착하지 않으면 아래에서 재전송할 수 있습니다.
        </p>
        <Button asChild className="mt-6 w-full" variant="outline">
          <Link href="/login">로그인하러 가기</Link>
        </Button>
      </div>
    </AuthCard>
  );
}
