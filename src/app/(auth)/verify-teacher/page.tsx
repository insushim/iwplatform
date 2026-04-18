import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";
import { TeacherVerifyForm } from "./teacher-verify-form";

export const metadata: Metadata = { title: "교원 인증" };

export default function VerifyTeacherPage() {
  return (
    <div className="w-full max-w-2xl">
      <AuthCard
        title="교원 인증"
        description="안전한 커뮤니티를 위해 교원 인증을 해주세요. 방법 중 하나를 선택하시면 됩니다."
      >
        <TeacherVerifyForm />
      </AuthCard>
    </div>
  );
}
