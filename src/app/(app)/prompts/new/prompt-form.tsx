"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { PROMPT_CATEGORIES } from "@/lib/constants";
import { toast } from "sonner";

export function PromptForm() {
  const router = useRouter();
  const [pending, start] = useTransition();
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      title: String(fd.get("title") ?? "").trim(),
      description: String(fd.get("description") ?? "").trim(),
      content: String(fd.get("content") ?? "").trim(),
      category: String(fd.get("category") ?? ""),
      targetModel: String(fd.get("targetModel") ?? "claude-sonnet"),
      useCase: String(fd.get("useCase") ?? "") || undefined,
      exampleInput: String(fd.get("exampleInput") ?? "") || undefined,
      exampleOutput: String(fd.get("exampleOutput") ?? "") || undefined,
      tags: String(fd.get("tags") ?? "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      isPublic: true,
    };
    start(async () => {
      const r = await fetch("/api/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!r.ok) {
        const j = (await r.json().catch(() => ({}))) as { message?: string };
        toast.error(j.message ?? "공유에 실패했습니다");
        return;
      }
      const { id } = (await r.json()) as { id: string };
      toast.success("공유되었습니다");
      router.push(`/prompts/${id}`);
      router.refresh();
    });
  }
  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-xl border bg-card p-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="title">제목</Label>
          <Input id="title" name="title" required maxLength={100} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="category">카테고리</Label>
          <Select name="category" required>
            <SelectTrigger>
              <SelectValue placeholder="선택" />
            </SelectTrigger>
            <SelectContent>
              {PROMPT_CATEGORIES.map((c) => (
                <SelectItem key={c.slug} value={c.slug}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">한 줄 설명</Label>
        <Input id="description" name="description" required maxLength={500} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="targetModel">대상 모델</Label>
          <Select name="targetModel" defaultValue="claude-sonnet">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="claude-sonnet">Claude Sonnet</SelectItem>
              <SelectItem value="claude-opus">Claude Opus</SelectItem>
              <SelectItem value="claude-haiku">Claude Haiku</SelectItem>
              <SelectItem value="gpt-4">GPT-4</SelectItem>
              <SelectItem value="gpt-4o">GPT-4o</SelectItem>
              <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
              <SelectItem value="other">기타</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="useCase">사용 맥락 (선택)</Label>
          <Input id="useCase" name="useCase" placeholder="예: 5학년 수학 공배수 수업" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="content">프롬프트 본문</Label>
        <Textarea
          id="content"
          name="content"
          required
          minLength={50}
          className="min-h-[200px] font-mono text-sm"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="exampleInput">예시 입력 (선택)</Label>
          <Textarea
            id="exampleInput"
            name="exampleInput"
            className="min-h-[120px] font-mono text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="exampleOutput">예시 출력 (선택)</Label>
          <Textarea
            id="exampleOutput"
            name="exampleOutput"
            className="min-h-[120px] font-mono text-sm"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="tags">태그 (쉼표)</Label>
        <Input id="tags" name="tags" placeholder="초등, 수학, 서술형, 피드백" />
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? <Loader2 className="size-4 animate-spin" /> : "공유하기"}
      </Button>
    </form>
  );
}
