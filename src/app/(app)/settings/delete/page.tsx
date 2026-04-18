import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth/session";
import { Card, CardContent } from "@/components/ui/card";
import { DeleteAccountForm } from "./delete-form";
import { AlertTriangle } from "lucide-react";

export const metadata: Metadata = { title: "계정 삭제" };

export default async function DeleteAccountPage() {
  await requireAuth();
  return (
    <div className="container-reading py-8">
      <h1 className="text-3xl font-bold tracking-tight text-destructive">계정 삭제</h1>
      <Card className="mt-6 border-destructive/40">
        <CardContent className="space-y-4 p-6">
          <div className="flex items-start gap-3 rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
            <AlertTriangle className="mt-0.5 size-5 shrink-0" />
            <div>
              <p className="font-semibold">이 작업은 되돌릴 수 없습니다</p>
              <ul className="mt-1 list-disc pl-5 text-destructive/80">
                <li>작성한 모든 글·댓글은 익명화되거나 삭제됩니다</li>
                <li>쇼케이스·프롬프트·인디모임 소유권이 취소됩니다</li>
                <li>같은 이메일로 다시 가입할 수 없습니다 (30일)</li>
              </ul>
            </div>
          </div>
          <DeleteAccountForm />
        </CardContent>
      </Card>
    </div>
  );
}
