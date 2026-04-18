"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { resetPasswordSchema } from "@/lib/validators";
import { PasswordStrength } from "@/components/auth/password-strength";
import { authClient } from "@/lib/auth/client";
import { toast } from "sonner";

export function ResetForm({ token }: { token: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [pw, setPw] = useState("");
  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token, password: "" },
  });

  function onSubmit(values: { token: string; password: string }) {
    startTransition(async () => {
      const { error } = await authClient.resetPassword({
        newPassword: values.password,
        token: values.token,
      });
      if (error) {
        toast.error(error.message ?? "재설정에 실패했습니다");
        return;
      }
      toast.success("비밀번호가 변경되었습니다");
      router.push("/login");
    });
  }

  if (!token) {
    return (
      <p className="text-sm text-muted-foreground">
        유효한 토큰이 없습니다. 비밀번호 찾기 메일의 링크를 다시 클릭해 주세요.
      </p>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="password">새 비밀번호</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          {...form.register("password", { onChange: (e) => setPw(e.target.value) })}
        />
        <PasswordStrength value={pw} />
        {form.formState.errors.password ? (
          <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
        ) : null}
      </div>
      <Button className="w-full" disabled={pending}>
        {pending ? <Loader2 className="size-4 animate-spin" /> : "비밀번호 변경"}
      </Button>
    </form>
  );
}
