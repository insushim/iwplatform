"use client";
import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth/client";
import { toast } from "sonner";

export function TotpForm() {
  const router = useRouter();
  const redirect = useSearchParams().get("redirect") ?? "/feed";
  const [pending, startTransition] = useTransition();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const code = new FormData(e.currentTarget).get("code") as string;
    startTransition(async () => {
      try {
        const result = await authClient.twoFactor.verifyTotp({ code });
        if (result?.data) {
          toast.success("인증되었습니다");
          router.push(redirect);
          router.refresh();
        } else {
          toast.error("코드가 올바르지 않습니다");
        }
      } catch {
        toast.error("검증에 실패했습니다");
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="code">인증 코드</Label>
        <Input
          id="code"
          name="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="\d{6}"
          maxLength={6}
          required
          className="h-12 text-center text-2xl tracking-[0.5em]"
        />
      </div>
      <Button className="w-full" disabled={pending}>
        {pending ? <Loader2 className="size-4 animate-spin" /> : "확인"}
      </Button>
    </form>
  );
}
