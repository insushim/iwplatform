"use client";
import { useState, useTransition } from "react";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function BookmarkButton({
  postId,
  initialBookmarked = false,
  variant = "outline",
  size = "sm",
}: {
  postId: string;
  initialBookmarked?: boolean;
  variant?: "outline" | "ghost";
  size?: "default" | "sm";
}) {
  const [on, setOn] = useState(initialBookmarked);
  const [pending, start] = useTransition();

  function toggle() {
    start(async () => {
      const was = on;
      setOn(!was);
      const r = await fetch("/api/bookmarks", {
        method: was ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });
      if (!r.ok) {
        setOn(was);
        toast.error("북마크 실패");
      } else {
        toast.success(was ? "북마크 해제" : "북마크에 추가했어요");
      }
    });
  }

  return (
    <Button variant={variant} size={size} onClick={toggle} disabled={pending}>
      <Bookmark className={cn("size-4", on && "fill-current text-primary")} />
      {on ? "저장됨" : "북마크"}
    </Button>
  );
}
