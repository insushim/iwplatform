"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { signInSchema, type SignInInput } from "@/lib/validators";
import { authClient } from "@/lib/auth/client";
import { toast } from "sonner";

export function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const redirect = search.get("redirect") ?? "/feed";
  const [showPw, setShowPw] = useState(false);
  const [pending, startTransition] = useTransition();

  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "", rememberMe: true },
  });

  async function onSubmit(values: SignInInput) {
    startTransition(async () => {
      const { error } = await authClient.signIn.email({
        email: values.email,
        password: values.password,
        rememberMe: values.rememberMe,
      });
      if (error) {
        toast.error(error.message ?? "로그인에 실패했습니다");
        return;
      }
      toast.success("환영합니다!");
      router.push(redirect);
      router.refresh();
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="email">이메일</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="teacher@school.kr"
          aria-invalid={!!form.formState.errors.email}
          {...form.register("email")}
        />
        {form.formState.errors.email ? (
          <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
        ) : null}
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">비밀번호</Label>
          <Link
            href="/forgot-password"
            className="text-xs text-muted-foreground hover:text-primary hover:underline"
          >
            비밀번호 찾기
          </Link>
        </div>
        <div className="relative">
          <Input
            id="password"
            type={showPw ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            className="pr-10"
            aria-invalid={!!form.formState.errors.password}
            {...form.register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPw((s) => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-muted-foreground hover:bg-muted"
            aria-label={showPw ? "비밀번호 숨기기" : "비밀번호 보이기"}
          >
            {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <Checkbox
          id="remember"
          defaultChecked
          onCheckedChange={(v) => form.setValue("rememberMe", Boolean(v))}
        />
        <span>로그인 상태 유지 (30일)</span>
      </label>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? <Loader2 className="size-4 animate-spin" /> : "로그인"}
      </Button>
    </form>
  );
}
