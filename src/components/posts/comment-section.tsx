"use client";
import { useState, useTransition } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, MessageSquare } from "lucide-react";
import { timeAgo } from "@/lib/utils/date";
import { toast } from "sonner";
import { CommentVoteButtons } from "./vote-buttons";
import { ReportDialog } from "@/components/common/report-dialog";

type CommentItem = {
  id: string;
  content: string;
  voteScore: number;
  createdAt: Date;
  parentId: string | null;
  isDeleted: boolean;
  authorName: string;
  authorUsername: string | null;
  authorAvatar: string | null;
};

export function CommentSection({
  postId,
  initialComments,
}: {
  postId: string;
  initialComments: CommentItem[];
}) {
  const [items, setItems] = useState(initialComments);
  const [text, setText] = useState("");
  const [pending, start] = useTransition();
  const [replyTo, setReplyTo] = useState<string | null>(null);

  async function submit() {
    const content = text.trim();
    if (!content) return;
    start(async () => {
      const r = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, parentId: replyTo, content, isAnonymous: false }),
      });
      if (!r.ok) {
        const j = (await r.json().catch(() => ({}))) as { message?: string };
        toast.error(j.message ?? "댓글 작성에 실패했습니다");
        return;
      }
      const created = (await r.json()) as CommentItem;
      setItems((prev) => [...prev, created]);
      setText("");
      setReplyTo(null);
      toast.success("댓글이 등록되었습니다");
    });
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-card p-4">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={replyTo ? "답글을 입력하세요" : "댓글을 남겨주세요"}
          className="min-h-[90px]"
        />
        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {replyTo ? "답글 모드" : "최상위 댓글"}
          </p>
          <div className="flex gap-2">
            {replyTo ? (
              <Button variant="ghost" size="sm" onClick={() => setReplyTo(null)}>
                취소
              </Button>
            ) : null}
            <Button size="sm" onClick={submit} disabled={pending || text.trim().length === 0}>
              {pending ? <Loader2 className="size-4 animate-spin" /> : "등록"}
            </Button>
          </div>
        </div>
      </div>

      <ul className="space-y-3">
        {items.map((c) => (
          <li key={c.id} className="rounded-xl border bg-card p-4">
            <div className="flex items-start gap-3">
              <Avatar className="size-8">
                {c.authorAvatar ? (
                  <AvatarImage src={c.authorAvatar} alt={c.authorName} />
                ) : null}
                <AvatarFallback>{c.authorName[0]}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">{c.authorName}</span>
                  <span>·</span>
                  <span>{timeAgo(c.createdAt)}</span>
                </div>
                <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed">
                  {c.isDeleted ? "삭제된 댓글입니다." : c.content}
                </p>
                <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                  <CommentVoteButtons
                    commentId={c.id}
                    initialScore={c.voteScore}
                  />
                  <button
                    onClick={() => setReplyTo(c.id)}
                    className="inline-flex items-center gap-1 hover:text-primary"
                  >
                    <MessageSquare className="size-3.5" /> 답글
                  </button>
                  <ReportDialog targetType="comment" targetId={c.id} />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
