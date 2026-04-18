"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Star, GitFork, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function PromptFavoriteButton({
  promptId,
  initialFavorited = false,
  initialCount,
}: {
  promptId: string;
  initialFavorited?: boolean;
  initialCount: number;
}) {
  const [on, setOn] = useState(initialFavorited);
  const [count, setCount] = useState(initialCount);
  const [pending, start] = useTransition();

  function toggle() {
    start(async () => {
      const was = on;
      setOn(!was);
      setCount((c) => (was ? Math.max(0, c - 1) : c + 1));
      const r = await fetch(`/api/prompts/${promptId}/favorite`, { method: "POST" });
      if (!r.ok) {
        setOn(was);
        setCount((c) => (was ? c + 1 : Math.max(0, c - 1)));
        toast.error("실패");
      }
    });
  }
  return (
    <Button onClick={toggle} disabled={pending} variant={on ? "default" : "outline"}>
      <Star className={cn("size-4", on && "fill-current")} />
      즐겨찾기 {count}
    </Button>
  );
}

export function PromptForkButton({ promptId }: { promptId: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  function onClick() {
    start(async () => {
      const r = await fetch(`/api/prompts/${promptId}/fork`, { method: "POST" });
      if (!r.ok) {
        toast.error("포크 실패");
        return;
      }
      const { id } = (await r.json()) as { id: string };
      toast.success("포크했습니다. 편집하세요.");
      router.push(`/prompts/${id}`);
      router.refresh();
    });
  }
  return (
    <Button onClick={onClick} disabled={pending} variant="outline">
      {pending ? <Loader2 className="size-4 animate-spin" /> : <GitFork className="size-4" />}
      포크
    </Button>
  );
}
