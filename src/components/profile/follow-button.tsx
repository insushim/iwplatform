"use client";
import { useState, useTransition } from "react";
import { UserPlus, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function FollowButton({
  targetUserId,
  initialFollowing = false,
}: {
  targetUserId: string;
  initialFollowing?: boolean;
}) {
  const [on, setOn] = useState(initialFollowing);
  const [pending, start] = useTransition();

  function toggle() {
    start(async () => {
      const was = on;
      setOn(!was);
      const r = await fetch("/api/follows", {
        method: was ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId }),
      });
      if (!r.ok) {
        setOn(was);
        toast.error("실패");
      }
    });
  }

  return (
    <Button
      onClick={toggle}
      disabled={pending}
      variant={on ? "outline" : "default"}
      size="sm"
    >
      {on ? <UserCheck className="size-4" /> : <UserPlus className="size-4" />}
      {on ? "팔로잉" : "팔로우"}
    </Button>
  );
}
