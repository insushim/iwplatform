"use client";
import { useState, useTransition } from "react";
import { ArrowBigUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function ShowcaseUpvoteButton({
  productId,
  initialCount,
  initialUpvoted = false,
}: {
  productId: string;
  initialCount: number;
  initialUpvoted?: boolean;
}) {
  const [count, setCount] = useState(initialCount);
  const [on, setOn] = useState(initialUpvoted);
  const [pending, start] = useTransition();

  function toggle() {
    start(async () => {
      const was = on;
      setOn(!was);
      setCount((c) => (was ? c - 1 : c + 1));
      const r = await fetch(`/api/showcase/${productId}/upvote`, { method: "POST" });
      if (!r.ok) {
        setOn(was);
        setCount((c) => (was ? c + 1 : c - 1));
        toast.error("실패");
      }
    });
  }

  return (
    <button
      onClick={toggle}
      disabled={pending}
      aria-pressed={on}
      className={cn(
        "group flex w-full flex-col items-center gap-0.5 rounded-xl border-2 px-5 py-3 transition-all",
        on
          ? "border-primary bg-primary/5 text-primary"
          : "border-border hover:border-primary/40",
      )}
    >
      <ArrowBigUp
        className={cn("size-6 transition-transform group-hover:scale-110", on && "fill-current")}
      />
      <span className="text-xs font-medium">{on ? "업보트됨" : "업보트"}</span>
      <span className="text-xl font-bold tabular-nums">{count}</span>
    </button>
  );
}
