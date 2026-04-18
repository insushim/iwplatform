"use client";
import { useState, useTransition } from "react";
import { ArrowBigUp, ArrowBigDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/utils/text";
import { toast } from "sonner";

type VoteKind = "up" | "down" | null;

export function PostVoteButtons({
  postId,
  initialScore,
  initialVote,
  orientation = "vertical",
}: {
  postId: string;
  initialScore: number;
  initialVote?: VoteKind;
  orientation?: "vertical" | "horizontal";
}) {
  const [score, setScore] = useState(initialScore);
  const [vote, setVote] = useState<VoteKind>(initialVote ?? null);
  const [pending, start] = useTransition();

  function onClick(next: Exclude<VoteKind, null>) {
    start(async () => {
      const was = vote;
      const newVote: VoteKind = was === next ? null : next;
      let delta = 0;
      if (was === "up") delta -= 1;
      if (was === "down") delta += 1;
      if (newVote === "up") delta += 1;
      if (newVote === "down") delta -= 1;
      setVote(newVote);
      setScore((s) => s + delta);

      const r = await fetch(`/api/posts/${postId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vote: newVote }),
      });
      if (!r.ok) {
        setVote(was);
        setScore((s) => s - delta);
        toast.error("투표 실패");
      }
    });
  }

  const isVertical = orientation === "vertical";
  return (
    <div
      className={cn(
        "inline-flex items-center",
        isVertical ? "flex-col" : "gap-1 rounded-full border p-1",
      )}
    >
      <button
        onClick={() => onClick("up")}
        disabled={pending}
        aria-pressed={vote === "up"}
        aria-label="추천"
        className={cn(
          "rounded-md p-1.5 transition hover:bg-muted disabled:opacity-50",
          vote === "up" ? "text-primary" : "text-muted-foreground hover:text-primary",
        )}
      >
        <ArrowBigUp className={cn("size-5", vote === "up" && "fill-current")} />
      </button>
      <span
        className={cn(
          "min-w-6 text-center text-sm font-bold tabular-nums",
          isVertical ? "" : "px-2",
        )}
      >
        {formatNumber(score)}
      </span>
      <button
        onClick={() => onClick("down")}
        disabled={pending}
        aria-pressed={vote === "down"}
        aria-label="비추천"
        className={cn(
          "rounded-md p-1.5 transition hover:bg-muted disabled:opacity-50",
          vote === "down"
            ? "text-destructive"
            : "text-muted-foreground hover:text-destructive",
        )}
      >
        <ArrowBigDown className={cn("size-5", vote === "down" && "fill-current")} />
      </button>
    </div>
  );
}

export function CommentVoteButtons({
  commentId,
  initialScore,
  initialVote,
}: {
  commentId: string;
  initialScore: number;
  initialVote?: VoteKind;
}) {
  const [score, setScore] = useState(initialScore);
  const [vote, setVote] = useState<VoteKind>(initialVote ?? null);
  const [pending, start] = useTransition();

  function onClick(next: "up" | "down") {
    start(async () => {
      const was = vote;
      const newVote: VoteKind = was === next ? null : next;
      let delta = 0;
      if (was === "up") delta -= 1;
      if (was === "down") delta += 1;
      if (newVote === "up") delta += 1;
      if (newVote === "down") delta -= 1;
      setVote(newVote);
      setScore((s) => s + delta);
      const r = await fetch(`/api/comments/${commentId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vote: newVote }),
      });
      if (!r.ok) {
        setVote(was);
        setScore((s) => s - delta);
      }
    });
  }

  return (
    <div className="inline-flex items-center gap-1 text-xs">
      <button
        onClick={() => onClick("up")}
        disabled={pending}
        className={cn(
          "inline-flex items-center gap-0.5 rounded p-1 hover:text-primary",
          vote === "up" && "text-primary",
        )}
      >
        <ArrowBigUp className={cn("size-3.5", vote === "up" && "fill-current")} />
        <span className="tabular-nums">{score}</span>
      </button>
      <button
        onClick={() => onClick("down")}
        disabled={pending}
        className={cn(
          "rounded p-1 hover:text-destructive",
          vote === "down" && "text-destructive",
        )}
      >
        <ArrowBigDown className={cn("size-3.5", vote === "down" && "fill-current")} />
      </button>
    </div>
  );
}
