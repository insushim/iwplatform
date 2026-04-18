"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus } from "lucide-react";
import { toast } from "sonner";

export function JoinGroupButton({
  groupId,
  initialJoined,
}: {
  groupId: string;
  initialJoined: boolean;
}) {
  const router = useRouter();
  const [joined, setJoined] = useState(initialJoined);
  const [pending, start] = useTransition();

  function toggle() {
    start(async () => {
      const was = joined;
      setJoined(!was);
      const r = await fetch(`/api/groups/${groupId}/membership`, {
        method: was ? "DELETE" : "POST",
      });
      if (!r.ok) {
        setJoined(was);
        toast.error("실패");
        return;
      }
      toast.success(was ? "탈퇴했습니다" : "가입 요청 완료");
      router.refresh();
    });
  }

  return (
    <Button onClick={toggle} disabled={pending} variant={joined ? "outline" : "default"}>
      {joined ? <UserMinus className="size-4" /> : <UserPlus className="size-4" />}
      {joined ? "탈퇴" : "참여하기"}
    </Button>
  );
}
