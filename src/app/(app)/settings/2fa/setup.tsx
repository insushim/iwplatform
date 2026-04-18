"use client";
import { useState, useTransition } from "react";
import QRCode from "qrcode";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Shield, Check } from "lucide-react";
import { toast } from "sonner";

type Stage = "idle" | "enroll" | "verify" | "done";

interface EnrollResult {
  uri: string;
  secret: string;
  backupCodes?: string[];
}

export function TwoFactorSetup({
  email,
  enabled,
  alreadyEnabled,
}: {
  email: string;
  enabled: boolean;
  alreadyEnabled: boolean;
}) {
  const [stage, setStage] = useState<Stage>(alreadyEnabled ? "done" : "idle");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [qr, setQr] = useState<string | null>(null);
  const [backup, setBackup] = useState<string[]>([]);
  const [pending, start] = useTransition();

  async function enroll() {
    start(async () => {
      const r = await fetch("/api/auth/2fa/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!r.ok) {
        toast.error("시작 실패 — 비밀번호를 확인해 주세요");
        return;
      }
      const data = (await r.json()) as EnrollResult;
      const dataUrl = await QRCode.toDataURL(data.uri);
      setQr(dataUrl);
      setBackup(data.backupCodes ?? []);
      setStage("enroll");
    });
  }

  async function verify() {
    start(async () => {
      const r = await fetch("/api/auth/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (!r.ok) {
        toast.error("코드가 올바르지 않습니다");
        return;
      }
      setStage("done");
      toast.success("2FA가 활성화되었습니다");
    });
  }

  if (stage === "done") {
    return (
      <Card>
        <CardContent className="flex items-center gap-4 p-6">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Check className="size-6" />
          </div>
          <div>
            <p className="font-semibold">2FA가 활성화되어 있습니다</p>
            <p className="text-sm text-muted-foreground">로그인 시 인증 코드가 필요합니다.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (stage === "idle") {
    return (
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="flex items-center gap-3">
            <Shield className="size-5 text-primary" />
            <p className="text-sm">
              Google Authenticator · 1Password · Authy 등 TOTP 앱을 사용합니다.
            </p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pw">현재 비밀번호</Label>
            <Input
              id="pw"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button onClick={enroll} disabled={pending || !password}>
            {pending ? <Loader2 className="size-4 animate-spin" /> : "시작하기"}
          </Button>
          {!enabled ? (
            <p className="text-xs text-muted-foreground">{email}</p>
          ) : null}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <div>
          <p className="font-semibold">1. 인증 앱에서 QR 코드를 스캔하세요</p>
          {qr ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={qr}
              alt="TOTP QR code"
              className="mt-3 size-48 rounded-lg border bg-white p-2"
            />
          ) : null}
        </div>
        {backup.length > 0 ? (
          <div>
            <p className="font-semibold">2. 백업 코드를 안전한 곳에 저장</p>
            <p className="text-xs text-muted-foreground">앱을 잃어버렸을 때 사용합니다.</p>
            <ul className="mt-2 grid grid-cols-2 gap-2 rounded-md border bg-muted/40 p-3 font-mono text-xs">
              {backup.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        ) : null}
        <div className="space-y-1.5">
          <Label htmlFor="code">3. 앱에 표시된 6자리 코드</Label>
          <Input
            id="code"
            inputMode="numeric"
            pattern="\d{6}"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="font-mono"
          />
        </div>
        <Button onClick={verify} disabled={pending || code.length !== 6}>
          {pending ? <Loader2 className="size-4 animate-spin" /> : "확인 & 활성화"}
        </Button>
      </CardContent>
    </Card>
  );
}
