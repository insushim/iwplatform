"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const QUICK = [
  "재직증명서 일부가 가려져 있어요",
  "교사번호가 확인되지 않아요",
  "문서가 너무 흐려서 내용을 확인할 수 없어요",
  "기타",
];

export function RejectForm({ verificationId }: { verificationId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [pending, start] = useTransition();

  function submit() {
    if (reason.trim().length < 3) {
      toast.error("사유를 입력해 주세요");
      return;
    }
    start(async () => {
      const fd = new FormData();
      fd.append("verificationId", verificationId);
      fd.append("reason", reason.trim());
      const r = await fetch("/api/admin/teacher/reject", {
        method: "POST",
        body: fd,
      });
      if (!r.ok) {
        toast.error("실패");
        return;
      }
      toast.success("거절되었습니다");
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="sm" variant="destructive">
            거절
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>인증 거절</DialogTitle>
          <DialogDescription>사유는 사용자에게 이메일로 전달됩니다.</DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {QUICK.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setReason(q)}
                className="rounded-full border bg-muted/30 px-3 py-1 text-xs hover:border-primary/40 hover:bg-primary/5"
              >
                {q}
              </button>
            ))}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="reason">사유</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[120px]"
              maxLength={500}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={pending}>
            취소
          </Button>
          <Button variant="destructive" onClick={submit} disabled={pending}>
            {pending ? <Loader2 className="size-4 animate-spin" /> : null}
            거절 확정
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
