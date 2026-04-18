"use client";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function ProfileForm({
  initial,
}: {
  initial: {
    displayName: string;
    bio: string;
    subject: string;
    yearsOfTeaching: number | null;
    websiteUrl: string;
    githubUrl: string;
  };
}) {
  const [pending, start] = useTransition();
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      displayName: String(fd.get("displayName") ?? ""),
      bio: String(fd.get("bio") ?? "") || undefined,
      subject: String(fd.get("subject") ?? "") || undefined,
      yearsOfTeaching: fd.get("yearsOfTeaching") ? Number(fd.get("yearsOfTeaching")) : undefined,
      websiteUrl: String(fd.get("websiteUrl") ?? "") || undefined,
      githubUrl: String(fd.get("githubUrl") ?? "") || undefined,
    };
    start(async () => {
      const r = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!r.ok) {
        const j = (await r.json().catch(() => ({}))) as { message?: string };
        toast.error(j.message ?? "저장 실패");
        return;
      }
      toast.success("저장되었습니다");
    });
  }
  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-xl border bg-card p-6">
      <Field id="displayName" label="표시 이름" defaultValue={initial.displayName} required />
      <div className="space-y-1.5">
        <Label htmlFor="bio">소개</Label>
        <Textarea id="bio" name="bio" defaultValue={initial.bio} className="min-h-[100px]" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="subject" label="담당 교과" defaultValue={initial.subject} />
        <Field
          id="yearsOfTeaching"
          label="경력 (년)"
          type="number"
          defaultValue={initial.yearsOfTeaching ?? ""}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="websiteUrl" label="웹사이트" type="url" defaultValue={initial.websiteUrl} />
        <Field id="githubUrl" label="GitHub" type="url" defaultValue={initial.githubUrl} />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? <Loader2 className="size-4 animate-spin" /> : "저장"}
      </Button>
    </form>
  );
}

function Field({
  id,
  label,
  type = "text",
  defaultValue,
  required,
}: {
  id: string;
  label: string;
  type?: string;
  defaultValue?: string | number;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={id} type={type} defaultValue={defaultValue} required={required} />
    </div>
  );
}
