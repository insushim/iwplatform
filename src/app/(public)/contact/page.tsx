import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MessageSquare, Code2 as Github } from "lucide-react";

export const metadata: Metadata = { title: "문의" };

export default function ContactPage() {
  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight">연락하고 싶어요</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          버그 제보, 기능 제안, 협업 제의 — 편한 채널로 연락 주세요.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-3">
        {[
          {
            icon: Mail,
            title: "이메일",
            value: "admin@edumakers.kr",
            href: "mailto:admin@edumakers.kr",
            hint: "평일 1~2일 내 회신",
          },
          {
            icon: MessageSquare,
            title: "커뮤니티 게시판",
            value: "자유게시판에 남기기",
            href: "/posts/category/free-board",
            hint: "공개 토론 가능한 주제",
          },
          {
            icon: Github,
            title: "GitHub Issues",
            value: "iw-lab/iwplatform",
            href: "https://github.com/iw-lab/iwplatform/issues",
            hint: "버그 · 기능 제안",
          },
        ].map((i) => (
          <a key={i.title} href={i.href} className="block">
            <Card className="h-full transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
              <CardContent className="p-6 text-center">
                <div className="mx-auto flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <i.icon className="size-5" />
                </div>
                <h3 className="mt-4 font-semibold">{i.title}</h3>
                <p className="mt-1 text-sm font-medium">{i.value}</p>
                <p className="mt-2 text-xs text-muted-foreground">{i.hint}</p>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
}
