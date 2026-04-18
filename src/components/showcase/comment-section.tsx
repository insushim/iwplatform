"use client";
import { useState, useTransition } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { timeAgo } from "@/lib/utils/date";
import { toast } from "sonner";

type Cmt = {
  id: string;
  content: string;
  createdAt: Date;
  isMakerReply: boolean;
  authorName: string;
  authorUsername: string | null;
  authorAvatar: string | null;
};

export function ShowcaseComments({
  productId,
  initial,
  canComment,
}: {
  productId: string;
  initial: Cmt[];
  canComment: boolean;
}) {
  const [items, setItems] = useState(initial);
  const [text, setText] = useState("");
  const [pending, start] = useTransition();

  function submit() {
    const content = text.trim();
    if (!content) return;
    start(async () => {
      const r = await fetch(`/api/showcase/${productId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!r.ok) {
        toast.error("작성 실패");
        return;
      }
      const created = (await r.json()) as Cmt;
      setItems((p) => [...p, created]);
      setText("");
    });
  }

  return (
    <section className="mt-10">
      <h2 className="mb-4 text-xl font-semibold">댓글 {items.length}개</h2>
      {canComment ? (
        <div className="rounded-xl border bg-card p-4">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="피드백·질문을 남겨 주세요"
            className="min-h-[80px]"
            maxLength={2000}
          />
          <div className="mt-3 flex justify-end">
            <Button onClick={submit} disabled={pending || text.trim().length === 0}>
              {pending ? <Loader2 className="size-4 animate-spin" /> : "등록"}
            </Button>
          </div>
        </div>
      ) : (
        <p className="rounded-md border bg-muted/30 p-3 text-sm text-muted-foreground">
          댓글을 남기려면 로그인 + 교원 인증이 필요합니다.
        </p>
      )}
      <ul className="mt-4 space-y-3">
        {items.map((c) => (
          <li key={c.id} className="rounded-xl border bg-card p-4">
            <div className="flex items-start gap-3">
              <Avatar className="size-8">
                {c.authorAvatar ? <AvatarImage src={c.authorAvatar} alt={c.authorName} /> : null}
                <AvatarFallback>{c.authorName[0]}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">{c.authorName}</span>
                  {c.isMakerReply ? (
                    <Badge variant="secondary" className="text-[9px]">
                      메이커
                    </Badge>
                  ) : null}
                  <span>· {timeAgo(c.createdAt)}</span>
                </div>
                <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed">{c.content}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
