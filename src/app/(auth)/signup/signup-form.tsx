"use client";
import { useTransition, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { signUpSchema, type SignUpInput } from "@/lib/validators";
import { PasswordStrength } from "@/components/auth/password-strength";
import { authClient } from "@/lib/auth/client";
import { toast } from "sonner";

export function SignupForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [pwValue, setPwValue] = useState("");

  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
      displayName: "",
      agreeTerms: false,
    },
  });

  async function onSubmit(values: SignUpInput) {
    startTransition(async () => {
      const { error } = await authClient.signUp.email({
        email: values.email,
        password: values.password,
        name: values.displayName,
        callbackURL: "/verify-teacher",
      });
      if (error) {
        toast.error(error.message ?? "가입에 실패했습니다");
        return;
      }
      // 프로필 생성
      await fetch("/api/profile/bootstrap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: values.username,
          displayName: values.displayName,
        }),
      });
      toast.success("가입이 완료되었습니다! 교원 인증을 진행해 주세요.");
      router.push("/verify-teacher");
      router.refresh();
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <Field
        label="이메일"
        id="email"
        type="email"
        autoComplete="email"
        placeholder="teacher@school.kr"
        error={form.formState.errors.email?.message}
        registration={form.register("email")}
      />
      <div className="grid grid-cols-2 gap-3">
        <Field
          label="아이디"
          id="username"
          placeholder="indi_teacher"
          hint="2~20자 · 영문·한글·숫자"
          error={form.formState.errors.username?.message}
          registration={form.register("username")}
        />
        <Field
          label="표시 이름"
          id="displayName"
          placeholder="김선생"
          error={form.formState.errors.displayName?.message}
          registration={form.register("displayName")}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">비밀번호</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder="최소 12자, 영문+숫자 포함"
          aria-invalid={!!form.formState.errors.password}
          {...form.register("password", {
            onChange: (e) => setPwValue(e.target.value),
          })}
        />
        <PasswordStrength value={pwValue} />
        {form.formState.errors.password ? (
          <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
        ) : null}
      </div>

      <label className="flex items-start gap-2 text-sm">
        <Checkbox
          id="agree"
          onCheckedChange={(v) =>
            form.setValue("agreeTerms", Boolean(v), { shouldValidate: true })
          }
        />
        <span className="leading-relaxed">
          <Link href="/terms" target="_blank" className="underline">
            이용약관
          </Link>
          과{" "}
          <Link href="/privacy" target="_blank" className="underline">
            개인정보처리방침
          </Link>
          에 동의합니다.
        </span>
      </label>
      {form.formState.errors.agreeTerms ? (
        <p className="-mt-2 text-xs text-destructive">
          {form.formState.errors.agreeTerms.message}
        </p>
      ) : null}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? <Loader2 className="size-4 animate-spin" /> : "가입하기"}
      </Button>
    </form>
  );
}

function Field({
  label,
  id,
  type = "text",
  placeholder,
  hint,
  error,
  autoComplete,
  registration,
}: {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  hint?: string;
  error?: string;
  autoComplete?: string;
  registration: ReturnType<ReturnType<typeof useForm>["register"]>;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        {...registration}
      />
      {hint && !error ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
