"use client";
import { useTransition, useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function NewPostForm({
  categories,
  defaultCategorySlug,
}: {
  categories: Array<{ id: number; slug: string; name: string; icon: string | null }>;
  defaultCategorySlug?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const defaultCat = defaultCategorySlug
    ? categories.find((c) => c.slug === defaultCategorySlug)?.id
    : categories[0]?.id;

  const [isAnon, setIsAnon] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const contentText = String(fd.get("content") ?? "");
    const payload = {
      categoryId: Number(fd.get("categoryId")),
      title: String(fd.get("title") ?? "").trim(),
      content: contentText,
      contentText,
      excerpt: contentText.slice(0, 200),
      tags: String(fd.get("tags") ?? "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, 8),
      isAnonymous: isAnon,
      status: "published" as const,
    };

    startTransition(async () => {
      const r = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!r.ok) {
        const j = (await r.json().catch(() => ({}))) as { message?: string };
        toast.error(j.message ?? "발행에 실패했습니다");
        return;
      }
      const { slug } = (await r.json()) as { slug: string };
      toast.success("발행되었습니다");
      router.push(`/posts/${slug}`);
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-xl border bg-card p-6">
      <div className="space-y-1.5">
        <Label htmlFor="categoryId">카테고리</Label>
        <Select name="categoryId" defaultValue={defaultCat ? String(defaultCat) : undefined}>
          <SelectTrigger>
            <SelectValue placeholder="카테고리 선택" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>
                {c.icon ?? ""} {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="title">제목</Label>
        <Input id="title" name="title" required maxLength={200} placeholder="제목을 입력하세요" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="content">내용</Label>
        <Textarea
          id="content"
          name="content"
          required
          className="min-h-[320px] leading-relaxed"
          placeholder="마크다운을 지원합니다. 학생 개인정보는 절대 포함하지 마세요."
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="tags">태그 (쉼표로 구분)</Label>
        <Input id="tags" name="tags" placeholder="AI수업, 프롬프트, 초등" />
      </div>

      <label className="flex items-center gap-3 rounded-md bg-muted/40 p-3">
        <Switch checked={isAnon} onCheckedChange={setIsAnon} id="anon" />
        <div>
          <Label htmlFor="anon" className="cursor-pointer">
            익명으로 발행
          </Label>
          <p className="text-xs text-muted-foreground">
            민감한 주제(예: 학부모 갈등)에 권장. 작성자는 서버 로그에만 기록되며 관리자에게 공개되지
            않습니다.
          </p>
        </div>
      </label>

      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? <Loader2 className="size-4 animate-spin" /> : "발행"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          취소
        </Button>
      </div>
    </form>
  );
}
