"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MessageSquare, Loader2 } from "lucide-react";
import { FollowButton } from "./follow-button";
import { toast } from "sonner";

export function ProfileActions({
  targetUserId,
  isSelf,
  initialFollowing,
  canDm,
}: {
  targetUserId: string;
  isSelf: boolean;
  initialFollowing: boolean;
  canDm: boolean;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();

  function startDM() {
    start(async () => {
      const r = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId }),
      });
      if (!r.ok) {
        const j = (await r.json().catch(() => ({}))) as { message?: string };
        toast.error(j.message ?? "대화 시작 실패");
        return;
      }
      const { conversationId } = (await r.json()) as { conversationId: string };
      router.push(`/messages/${conversationId}`);
    });
  }

  if (isSelf) {
    return (
      <Button variant="outline" size="sm" onClick={() => router.push("/settings/profile")}>
        프로필 편집
      </Button>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <FollowButton targetUserId={targetUserId} initialFollowing={initialFollowing} />
      {canDm ? (
        <Button size="sm" variant="outline" onClick={startDM} disabled={pending}>
          {pending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <MessageSquare className="size-4" />
          )}
          메시지
        </Button>
      ) : null}
    </div>
  );
}
