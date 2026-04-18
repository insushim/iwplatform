"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function RSVPButton({
  eventId,
  initialRegistered,
}: {
  eventId: string;
  initialRegistered: boolean;
}) {
  const router = useRouter();
  const [on, setOn] = useState(initialRegistered);
  const [pending, start] = useTransition();

  function toggle() {
    start(async () => {
      const was = on;
      setOn(!was);
      const r = await fetch(`/api/events/${eventId}/rsvp`, {
        method: was ? "DELETE" : "POST",
      });
      if (!r.ok) {
        setOn(was);
        toast.error("실패");
        return;
      }
      toast.success(was ? "참가를 취소했습니다" : "참가가 확정되었습니다");
      router.refresh();
    });
  }

  return (
    <Button
      onClick={toggle}
      disabled={pending}
      className="mt-3 w-full"
      variant={on ? "outline" : "default"}
    >
      {on ? "참가 취소" : "참가하기"}
    </Button>
  );
}
