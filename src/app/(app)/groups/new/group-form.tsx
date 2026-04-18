"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export function GroupForm() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [isPrivate, setIsPrivate] = useState(false);
  const [requiresApproval, setRequiresApproval] = useState(true);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") ?? "").trim(),
      description: String(fd.get("description") ?? "").trim(),
      category: String(fd.get("category") ?? "") || undefined,
      isPrivate,
      requiresApproval,
    };
    start(async () => {
      const r = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!r.ok) {
        toast.error("생성 실패");
        return;
      }
      const { slug } = (await r.json()) as { slug: string };
      toast.success("모임이 만들어졌어요");
      router.push(`/groups/${slug}`);
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-xl border bg-card p-6">
      <div className="space-y-1.5">
        <Label htmlFor="name">모임 이름</Label>
        <Input id="name" name="name" required maxLength={50} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="description">소개</Label>
        <Textarea
          id="description"
          name="description"
          required
          minLength={10}
          className="min-h-[120px]"
          placeholder="모임의 목적, 활동 내용, 참여 방법 등"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="category">카테고리 (선택)</Label>
        <Input id="category" name="category" placeholder="예: AI 수업, 평가 혁신, 지역 모임" />
      </div>
      <label className="flex items-center gap-3 rounded-md bg-muted/40 p-3">
        <Switch checked={isPrivate} onCheckedChange={setIsPrivate} />
        <div className="min-w-0">
          <span className="text-sm font-medium">비공개 모임</span>
          <p className="text-xs text-muted-foreground">
            초대받은 멤버만 콘텐츠를 볼 수 있습니다.
          </p>
        </div>
      </label>
      <label className="flex items-center gap-3 rounded-md bg-muted/40 p-3">
        <Switch checked={requiresApproval} onCheckedChange={setRequiresApproval} />
        <div className="min-w-0">
          <span className="text-sm font-medium">가입 승인제</span>
          <p className="text-xs text-muted-foreground">
            운영진 승인 후 멤버가 됩니다.
          </p>
        </div>
      </label>
      <Button type="submit" disabled={pending}>
        {pending ? <Loader2 className="size-4 animate-spin" /> : "모임 만들기"}
      </Button>
    </form>
  );
}
