"use client";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

type Prefs = {
  emailMentions: boolean;
  emailReplies: boolean;
  emailDm: boolean;
  emailDigest: boolean;
  pushMentions: boolean;
  pushReplies: boolean;
  pushDm: boolean;
};

export function NotificationPrefsForm({ initial }: { initial: Prefs }) {
  const [prefs, setPrefs] = useState<Prefs>(initial);
  const [pending, start] = useTransition();

  function onSave() {
    start(async () => {
      const r = await fetch("/api/profile/prefs/notifications", {
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

  const rows: Array<[keyof Prefs, string, string]> = [
    ["emailMentions", "이메일 · 멘션", "누가 @나를 언급했을 때"],
    ["emailReplies", "이메일 · 답글/댓글", "내 글에 답글이 달렸을 때"],
    ["emailDm", "이메일 · DM", "1:1 메시지를 받았을 때"],
    ["emailDigest", "이메일 · 주간 다이제스트", "매주 월요일 트렌딩 요약"],
    ["pushMentions", "푸시 · 멘션", "브라우저 알림"],
    ["pushReplies", "푸시 · 답글/댓글", "브라우저 알림"],
    ["pushDm", "푸시 · DM", "브라우저 알림"],
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {rows.map(([k, label, desc]) => (
            <label
              key={k}
              className="flex items-center justify-between gap-4 border-b pb-4 last:border-none last:pb-0"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
              <Switch
                checked={prefs[k]}
                onCheckedChange={(v) => setPrefs((p) => ({ ...p, [k]: Boolean(v) }))}
              />
            </label>
          ))}
        </div>
        <Button onClick={onSave} disabled={pending} className="mt-5">
          {pending ? <Loader2 className="size-4 animate-spin" /> : "저장"}
        </Button>
      </CardContent>
    </Card>
  );
}
