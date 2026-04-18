"use client";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PasswordStrength } from "@/components/auth/password-strength";
import { authClient } from "@/lib/auth/client";

export function AccountForms() {
  return (
    <>
      <ChangePassword />
      <TwoFactorSection />
    </>
  );
}

function ChangePassword() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [pending, start] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (next.length < 12) {
      toast.error("새 비밀번호는 12자 이상이어야 합니다");
      return;
    }
    start(async () => {
      const r = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      if (!r.ok) {
        toast.error("변경에 실패했습니다");
        return;
      }
      toast.success("비밀번호가 변경되었습니다. 다시 로그인해 주세요.");
      setCurrent("");
      setNext("");
    });
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold">비밀번호 변경</h2>
        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="cur">현재 비밀번호</Label>
            <Input
              id="cur"
              type="password"
              autoComplete="current-password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="next">새 비밀번호</Label>
            <Input
              id="next"
              type="password"
              autoComplete="new-password"
              value={next}
              onChange={(e) => setNext(e.target.value)}
              required
              minLength={12}
            />
            <PasswordStrength value={next} />
          </div>
          <Button type="submit" disabled={pending || !current || next.length < 12}>
            {pending ? <Loader2 className="size-4 animate-spin" /> : "변경"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function TwoFactorSection() {
  const [pending, start] = useTransition();

  function enable() {
    start(async () => {
      try {
        await authClient.twoFactor.enable({ password: window.prompt("확인을 위해 현재 비밀번호") ?? "" });
        toast.success("2FA 설정을 시작하세요 (QR 코드 생성)");
      } catch {
        toast.error("실패");
      }
    });
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold">2단계 인증 (2FA)</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Google Authenticator, 1Password 등 TOTP 호환 앱을 사용합니다.
        </p>
        <Button variant="outline" onClick={enable} disabled={pending} className="mt-4">
          {pending ? <Loader2 className="size-4 animate-spin" /> : "2FA 활성화"}
        </Button>
      </CardContent>
    </Card>
  );
}
