"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function SuspendForm({
  userId,
  isSuspended,
  currentReason,
}: {
  userId: string;
  isSuspended: boolean;
  currentReason: string | null;
}) {
  const router = useRouter();
  const [reason, setReason] = useState(currentReason ?? "");
  const [days, setDays] = useState(7);
  const [pending, start] = useTransition();

  function submit(suspend: boolean) {
    start(async () => {
      const r = await fetch(`/api/admin/users/${userId}/suspend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          suspend,
          reason: suspend ? reason : undefined,
          days: suspend ? days : undefined,
        }),
      });
      if (!r.ok) {
        toast.error("처리 실패");
        return;
      }
      toast.success(suspend ? "정지되었습니다" : "정지 해제되었습니다");
      router.refresh();
    });
  }

  if (isSuspended) {
    return (
      <div className="space-y-2">
        {currentReason ? (
          <p className="rounded-md bg-muted/40 p-3 text-sm">
            현재 사유: <span className="font-medium">{currentReason}</span>
          </p>
        ) : null}
        <Button onClick={() => submit(false)} disabled={pending} variant="outline">
          {pending ? <Loader2 className="size-4 animate-spin" /> : null}
          정지 해제
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="reason">사유</Label>
        <Textarea
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="예: 스팸 반복 · 커뮤니티 가이드라인 위반"
          maxLength={500}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="days">기간 (일)</Label>
        <Input
          id="days"
          type="number"
          min={1}
          max={365}
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
        />
      </div>
      <Button
        onClick={() => submit(true)}
        disabled={pending || reason.length < 3}
        variant="destructive"
      >
        {pending ? <Loader2 className="size-4 animate-spin" /> : null}
        정지 실행
      </Button>
    </div>
  );
}
