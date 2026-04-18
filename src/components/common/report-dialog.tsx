"use client";
import { useState, useTransition } from "react";
import { Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const REASONS = [
  { v: "spam", l: "스팸·광고" },
  { v: "abuse", l: "욕설·혐오·괴롭힘" },
  { v: "inappropriate", l: "부적절한 콘텐츠" },
  { v: "misinformation", l: "허위 정보" },
  { v: "copyright", l: "저작권 침해" },
  { v: "other", l: "기타" },
];

export function ReportDialog({
  targetType,
  targetId,
}: {
  targetType: "post" | "comment" | "user" | "product" | "message";
  targetId: string;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<string>("");
  const [details, setDetails] = useState("");
  const [pending, start] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reason) {
      toast.error("사유를 선택해 주세요");
      return;
    }
    start(async () => {
      const r = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetType, targetId, reason, details }),
      });
      if (!r.ok) {
        toast.error("접수 실패");
        return;
      }
      toast.success("신고가 접수되었습니다. 검토 후 조치됩니다.");
      setOpen(false);
      setReason("");
      setDetails("");
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="sm" aria-label="신고">
            <Flag className="size-4" />
          </Button>
        }
      />
      <DialogContent>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>신고하기</DialogTitle>
            <DialogDescription>
              커뮤니티 가이드라인 위반을 알려 주세요. 허위 신고 시 제재될 수 있습니다.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-3">
            <div className="space-y-1.5">
              <Label>사유</Label>
              <Select value={reason} onValueChange={(v: string | null) => setReason(v ?? "")}>
                <SelectTrigger>
                  <SelectValue placeholder="선택" />
                </SelectTrigger>
                <SelectContent>
                  {REASONS.map((r) => (
                    <SelectItem key={r.v} value={r.v}>
                      {r.l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="details">상세 설명 (선택)</Label>
              <Textarea
                id="details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="min-h-[90px]"
                maxLength={1000}
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={pending}
            >
              취소
            </Button>
            <Button type="submit" disabled={pending}>
              신고
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
