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
import { SHOWCASE_CATEGORIES } from "@/lib/constants";
import { toast } from "sonner";

export function SubmitForm() {
  const router = useRouter();
  const [pending, start] = useTransition();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") ?? "").trim(),
      tagline: String(fd.get("tagline") ?? "").trim(),
      description: String(fd.get("description") ?? "").trim(),
      category: String(fd.get("category") ?? ""),
      websiteUrl: String(fd.get("websiteUrl") ?? "").trim(),
      githubUrl: String(fd.get("githubUrl") ?? "").trim() || undefined,
      pricingModel: String(fd.get("pricingModel") ?? "free") as
        | "free"
        | "freemium"
        | "paid"
        | "open_source",
      techStack: String(fd.get("techStack") ?? "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      tags: String(fd.get("tags") ?? "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      screenshots: String(fd.get("screenshots") ?? "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      buildStory: String(fd.get("buildStory") ?? "") || undefined,
    };
    start(async () => {
      const r = await fetch("/api/showcase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!r.ok) {
        const j = (await r.json().catch(() => ({}))) as { message?: string };
        toast.error(j.message ?? "제출에 실패했습니다");
        return;
      }
      const { slug } = (await r.json()) as { slug: string };
      toast.success("제출되었습니다! 다음 월요일에 공개됩니다.");
      router.push(`/showcase/${slug}`);
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-xl border bg-card p-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="앱 이름" placeholder="예: 수학톡톡" required maxLength={60} />
        <div className="space-y-1.5">
          <Label htmlFor="category">카테고리</Label>
          <Select name="category" required>
            <SelectTrigger>
              <SelectValue placeholder="선택" />
            </SelectTrigger>
            <SelectContent>
              {SHOWCASE_CATEGORIES.map((c) => (
                <SelectItem key={c.slug} value={c.slug}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Field
        id="tagline"
        label="한 줄 소개 (태그라인)"
        placeholder="예: 초등 수학 개념을 친구에게 설명하게 하는 AI 튜터"
        required
        maxLength={120}
      />
      <div className="space-y-1.5">
        <Label htmlFor="description">상세 설명 (최소 50자)</Label>
        <Textarea
          id="description"
          name="description"
          required
          minLength={50}
          className="min-h-[160px]"
          placeholder="무엇을 해결하나요? 누구를 위한 서비스인가요? 어떻게 쓰나요?"
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="websiteUrl"
          label="웹사이트 URL"
          type="url"
          placeholder="https://..."
          required
        />
        <Field id="githubUrl" label="GitHub (선택)" type="url" placeholder="https://github.com/..." />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="pricingModel">가격 모델</Label>
          <Select name="pricingModel" defaultValue="free">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="free">무료</SelectItem>
              <SelectItem value="freemium">Freemium</SelectItem>
              <SelectItem value="paid">유료</SelectItem>
              <SelectItem value="open_source">오픈소스</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Field id="techStack" label="기술 스택 (쉼표)" placeholder="Next.js, Supabase, Claude" />
      </div>
      <Field id="tags" label="태그 (쉼표)" placeholder="초등, 수학, AI 튜터" />
      <div className="space-y-1.5">
        <Label htmlFor="screenshots">스크린샷 URL (한 줄에 하나, 최소 3개)</Label>
        <Textarea
          id="screenshots"
          name="screenshots"
          required
          className="min-h-[100px] font-mono text-xs"
          placeholder="https://.../s1.png
https://.../s2.png
https://.../s3.png"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="buildStory">빌드 스토리 (선택)</Label>
        <Textarea
          id="buildStory"
          name="buildStory"
          className="min-h-[120px]"
          placeholder="어떤 문제에서 출발했고, 어떻게 만들었는지, 무엇을 배웠는지 자유롭게 적어주세요."
        />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? <Loader2 className="size-4 animate-spin" /> : "제출하기"}
      </Button>
    </form>
  );
}

function Field({
  id,
  label,
  type = "text",
  placeholder,
  required,
  maxLength,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
      />
    </div>
  );
}
