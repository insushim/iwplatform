"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { RichEditor } from "@/components/editor/rich-editor";

interface Props {
  post: {
    id: string;
    slug: string;
    title: string;
    content: string;
    categoryId: number;
    isAnonymous: boolean;
  };
  categories: Array<{ id: number; slug: string; name: string; icon: string | null }>;
}

export function EditPostForm({ post, categories }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [html, setHtml] = useState(post.content);
  const [text, setText] = useState("");
  const [isAnon, setIsAnon] = useState(post.isAnonymous);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      categoryId: Number(fd.get("categoryId")),
      title: String(fd.get("title") ?? "").trim(),
      content: html,
      contentText: text || html.replace(/<[^>]+>/g, ""),
      excerpt: (text || html.replace(/<[^>]+>/g, "")).slice(0, 200),
      tags: String(fd.get("tags") ?? "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, 8),
      isAnonymous: isAnon,
    };
    start(async () => {
      const r = await fetch(`/api/posts/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!r.ok) {
        toast.error("수정 실패");
        return;
      }
      toast.success("수정되었습니다");
      router.push(`/posts/${post.slug}`);
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-xl border bg-card p-6">
      <div className="space-y-1.5">
        <Label>카테고리</Label>
        <Select name="categoryId" defaultValue={String(post.categoryId)}>
          <SelectTrigger>
            <SelectValue />
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
        <Input id="title" name="title" required maxLength={200} defaultValue={post.title} />
      </div>
      <div className="space-y-1.5">
        <Label>내용</Label>
        <RichEditor
          value={html}
          onChange={(h, t) => {
            setHtml(h);
            setText(t);
          }}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="tags">태그 (쉼표)</Label>
        <Input id="tags" name="tags" />
      </div>
      <label className="flex items-center gap-3 rounded-md bg-muted/40 p-3">
        <Switch checked={isAnon} onCheckedChange={setIsAnon} />
        <span className="text-sm">익명으로 유지</span>
      </label>
      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? <Loader2 className="size-4 animate-spin" /> : "저장"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          취소
        </Button>
      </div>
    </form>
  );
}
