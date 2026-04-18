"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function ReportActions({ reportId }: { reportId: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  function handle(status: "resolved" | "dismissed") {
    const actionTaken =
      status === "resolved"
        ? window.prompt("어떻게 조치했나요? (예: 콘텐츠 삭제, 사용자 경고)") ?? ""
        : "사유 불충분";
    start(async () => {
      const r = await fetch(`/api/admin/reports/${reportId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, actionTaken }),
      });
      if (!r.ok) {
        toast.error("처리 실패");
        return;
      }
      toast.success("처리되었습니다");
      router.refresh();
    });
  }

  return (
    <div className="flex gap-2">
      <Button size="sm" variant="outline" onClick={() => handle("dismissed")} disabled={pending}>
        {pending ? <Loader2 className="size-4 animate-spin" /> : "기각"}
      </Button>
      <Button size="sm" onClick={() => handle("resolved")} disabled={pending}>
        조치 완료
      </Button>
    </div>
  );
}
