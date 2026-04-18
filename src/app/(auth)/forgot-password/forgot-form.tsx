"use client";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2 } from "lucide-react";
import { forgotPasswordSchema } from "@/lib/validators";
import { authClient } from "@/lib/auth/client";
import { toast } from "sonner";

export function ForgotForm() {
  const [pending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);
  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  function onSubmit({ email }: { email: string }) {
    startTransition(async () => {
      try {
        const r = await fetch("/api/auth/forget-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, redirectTo: "/reset-password" }),
        });
        if (!r.ok) throw new Error("send failed");
        setSent(true);
      } catch {
        toast.error("발송에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      }
    });
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center text-center">
        <CheckCircle2 className="size-12 text-primary" />
        <p className="mt-4 text-sm">
          입력하신 이메일로 재설정 링크를 보냈습니다. 받은 편지함을 확인해 주세요.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email">이메일</Label>
        <Input id="email" type="email" autoComplete="email" {...form.register("email")} />
        {form.formState.errors.email ? (
          <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
        ) : null}
      </div>
      <Button className="w-full" disabled={pending}>
        {pending ? <Loader2 className="size-4 animate-spin" /> : "재설정 링크 보내기"}
      </Button>
    </form>
  );
}
