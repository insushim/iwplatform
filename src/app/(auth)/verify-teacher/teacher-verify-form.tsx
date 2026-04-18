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
import { Loader2, Upload, CheckCircle2, Mail, FileText } from "lucide-react";
import { TEACHER_LEVELS, REGIONS } from "@/lib/constants";
import { toast } from "sonner";

type Method = "document" | "school_email";

export function TeacherVerifyForm() {
  const router = useRouter();
  const [method, setMethod] = useState<Method>("document");
  const [pending, startTransition] = useTransition();
  const [file, setFile] = useState<File | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      method,
      teacherLevel: fd.get("teacherLevel"),
      schoolName: fd.get("schoolName"),
      schoolRegion: fd.get("schoolRegion"),
      subject: fd.get("subject") || undefined,
      yearsOfTeaching: fd.get("yearsOfTeaching")
        ? Number(fd.get("yearsOfTeaching"))
        : undefined,
      schoolEmail: method === "school_email" ? fd.get("schoolEmail") : undefined,
    };

    startTransition(async () => {
      try {
        if (method === "document") {
          if (!file) {
            toast.error("재직증명서 파일을 첨부해 주세요");
            return;
          }
          const up = new FormData();
          up.append("file", file);
          up.append("kind", "teacher_doc");
          const r = await fetch("/api/upload", { method: "POST", body: up });
          if (!r.ok) throw new Error("파일 업로드 실패");
          const { url, hash } = (await r.json()) as { url: string; hash: string };
          Object.assign(payload, { documentUrl: url, documentHash: hash });
        }
        const res = await fetch("/api/teacher/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const j = (await res.json().catch(() => ({}))) as { message?: string };
          throw new Error(j.message ?? "검토 요청에 실패했습니다");
        }
        toast.success("검토를 요청했습니다. 1~2일 내 이메일로 결과를 알려드려요.");
        router.push("/feed");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "알 수 없는 오류");
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-2">
        <MethodTab
          active={method === "document"}
          onClick={() => setMethod("document")}
          icon={<FileText className="size-5" />}
          title="재직증명서"
          desc="가장 빠른 방법"
        />
        <MethodTab
          active={method === "school_email"}
          onClick={() => setMethod("school_email")}
          icon={<Mail className="size-5" />}
          title="학교 이메일"
          desc=".go.kr / .sen.kr"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>학교 급</Label>
          <Select name="teacherLevel" required>
            <SelectTrigger>
              <SelectValue placeholder="선택" />
            </SelectTrigger>
            <SelectContent>
              {TEACHER_LEVELS.map((l) => (
                <SelectItem key={l.value} value={l.value}>
                  {l.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>지역</Label>
          <Select name="schoolRegion" required>
            <SelectTrigger>
              <SelectValue placeholder="선택" />
            </SelectTrigger>
            <SelectContent>
              {REGIONS.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="schoolName">학교명</Label>
        <Input id="schoolName" name="schoolName" required placeholder="○○초등학교" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="subject">담당 교과 (선택)</Label>
          <Input id="subject" name="subject" placeholder="담임 · 수학 등" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="yearsOfTeaching">경력 (년, 선택)</Label>
          <Input id="yearsOfTeaching" name="yearsOfTeaching" type="number" min={0} max={60} />
        </div>
      </div>

      {method === "document" ? (
        <div className="space-y-1.5">
          <Label htmlFor="doc">재직증명서 또는 공문 이미지</Label>
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed bg-muted/20 p-8 transition hover:bg-muted/40">
            <Upload className="size-8 text-muted-foreground" />
            <span className="mt-2 text-sm font-medium">
              {file ? file.name : "파일을 선택하거나 드래그"}
            </span>
            <span className="mt-1 text-xs text-muted-foreground">
              JPG · PNG · PDF · 최대 10MB
            </span>
            <input
              id="doc"
              type="file"
              accept="image/jpeg,image/png,application/pdf"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>
          {file ? (
            <p className="flex items-center gap-1 text-xs text-primary">
              <CheckCircle2 className="size-3.5" /> {(file.size / 1024).toFixed(0)}KB
            </p>
          ) : null}
        </div>
      ) : (
        <div className="space-y-1.5">
          <Label htmlFor="schoolEmail">학교 이메일</Label>
          <Input
            id="schoolEmail"
            name="schoolEmail"
            type="email"
            required
            placeholder="teacher@xxx.go.kr"
          />
          <p className="text-xs text-muted-foreground">
            입력하신 메일로 인증 링크를 보내드립니다.
          </p>
        </div>
      )}

      <div className="rounded-lg bg-muted/40 p-4 text-xs leading-relaxed text-muted-foreground">
        업로드하신 서류는 암호화되어 저장되며, 승인 후 30일 이내 원본이 폐기됩니다.
        관리자만 검토 목적으로 열람할 수 있고, 모든 접근은 감사 로그에 기록됩니다.
      </div>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? <Loader2 className="size-4 animate-spin" /> : "검토 요청"}
      </Button>
    </form>
  );
}

function MethodTab({
  active,
  onClick,
  icon,
  title,
  desc,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-start gap-1 rounded-xl border p-4 text-left transition ${
        active
          ? "border-primary bg-primary/5 ring-brand"
          : "hover:border-primary/40 hover:bg-muted/40"
      }`}
    >
      <span className="text-primary">{icon}</span>
      <span className="text-sm font-semibold">{title}</span>
      <span className="text-xs text-muted-foreground">{desc}</span>
    </button>
  );
}
