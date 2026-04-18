"use client";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

type Prefs = {
  profilePublic: boolean;
  showSchool: boolean;
  showEmail: boolean;
  allowDmFrom: "verified" | "all" | "none";
};

export function PrivacyForm({ initial }: { initial: Prefs }) {
  const [prefs, setPrefs] = useState<Prefs>(initial);
  const [pending, start] = useTransition();

  function onSave() {
    start(async () => {
      const r = await fetch("/api/profile/prefs/privacy", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prefs),
      });
      if (!r.ok) {
        toast.error("저장 실패");
        return;
      }
      toast.success("저장되었습니다");
    });
  }

  return (
    <Card>
      <CardContent className="space-y-5 p-6">
        <ToggleRow
          label="프로필 공개"
          desc="다른 사용자가 내 프로필을 볼 수 있음"
          checked={prefs.profilePublic}
          onChange={(v) => setPrefs((p) => ({ ...p, profilePublic: v }))}
        />
        <ToggleRow
          label="학교명 공개"
          desc="프로필에 소속 학교 표시"
          checked={prefs.showSchool}
          onChange={(v) => setPrefs((p) => ({ ...p, showSchool: v }))}
        />
        <ToggleRow
          label="이메일 공개"
          desc="프로필에 이메일 표시 (권장하지 않음)"
          checked={prefs.showEmail}
          onChange={(v) => setPrefs((p) => ({ ...p, showEmail: v }))}
        />
        <div className="space-y-1.5">
          <Label>DM 수신 범위</Label>
          <Select
            value={prefs.allowDmFrom}
            onValueChange={(v) =>
              setPrefs((p) => ({ ...p, allowDmFrom: v as Prefs["allowDmFrom"] }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">모두에게 받기</SelectItem>
              <SelectItem value="verified">인증 교사에게만 받기 (권장)</SelectItem>
              <SelectItem value="none">받지 않기</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={onSave} disabled={pending}>
          {pending ? <Loader2 className="size-4 animate-spin" /> : "저장"}
        </Button>
      </CardContent>
    </Card>
  );
}

function ToggleRow({
  label,
  desc,
  checked,
  onChange,
}: {
  label: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <Switch checked={checked} onCheckedChange={(v) => onChange(Boolean(v))} />
    </label>
  );
}
