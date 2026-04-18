import type { Metadata } from "next";
import Link from "next/link";
import { requireAuth } from "@/lib/auth/session";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Compass, Pencil, Users, Rocket } from "lucide-react";

export const metadata: Metadata = { title: "환영합니다" };

export default async function OnboardingPage() {
  const { profile } = await requireAuth();

  const steps = [
    {
      icon: ShieldCheck,
      title: "교원 인증 완료하기",
      desc: "안전한 커뮤니티를 위해 필수입니다. 재직증명서 또는 학교 이메일로 간단히 인증하세요.",
      href: "/verify-teacher",
      done: profile.teacherStatus === "verified",
      cta: profile.teacherStatus === "verified" ? "완료됨" : "인증 시작",
    },
    {
      icon: Pencil,
      title: "프로필 꾸미기",
      desc: "사진, 소개, 담당 교과·경력을 입력하면 다른 선생님과 연결되기 쉬워집니다.",
      href: "/settings/profile",
      done: false,
      cta: "프로필 편집",
    },
    {
      icon: Compass,
      title: "피드 둘러보기",
      desc: "인기 글, 이번 주 런치 앱, 프롬프트 라이브러리를 구경해 보세요.",
      href: "/feed",
      done: false,
      cta: "피드로",
    },
    {
      icon: Users,
      title: "관심있는 선생님 팔로우",
      desc: "팔로우하면 그들의 새 글이 피드에 뜹니다.",
      href: "/leaderboard",
      done: false,
      cta: "리더보드 보기",
    },
    {
      icon: Rocket,
      title: "첫 글 · 앱 · 프롬프트 공유",
      desc: "나눔이 시작될 때 커뮤니티가 자라요. 작게 시작해도 충분합니다.",
      href: "/posts/new",
      done: false,
      cta: "글쓰기",
    },
  ];

  return (
    <div className="container-reading py-10">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        환영해요, 선생님 👋
      </h1>
      <p className="mt-3 text-lg text-muted-foreground">
        에듀메이커스를 시작하기 전에 몇 단계만 체크해 주세요.
      </p>

      <ol className="mt-8 space-y-4">
        {steps.map((s, idx) => (
          <li key={s.title}>
            <Card className={s.done ? "border-primary/40 bg-primary/5" : ""}>
              <CardContent className="flex items-center gap-4 p-5">
                <div
                  className={`flex size-10 shrink-0 items-center justify-center rounded-full font-bold ${
                    s.done
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {s.done ? "✓" : idx + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="flex items-center gap-2 font-semibold">
                    <s.icon className="size-4 text-primary" />
                    {s.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
                </div>
                <Button
                  asChild
                  variant={s.done ? "outline" : "default"}
                  size="sm"
                  disabled={s.done}
                >
                  <Link href={s.href}>{s.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          </li>
        ))}
      </ol>

      <div className="mt-10 text-center">
        <Button asChild variant="outline">
          <Link href="/feed">건너뛰고 피드로</Link>
        </Button>
      </div>
    </div>
  );
}
