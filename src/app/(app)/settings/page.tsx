import type { Metadata } from "next";
import Link from "next/link";
import { User, Lock, Bell, Shield, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "설정" };

const items = [
  { href: "/settings/profile", label: "프로필", desc: "이름, 소개, 아바타", icon: User },
  { href: "/settings/account", label: "계정", desc: "이메일 · 비밀번호", icon: Lock },
  {
    href: "/settings/notifications",
    label: "알림",
    desc: "이메일 · 푸시 설정",
    icon: Bell,
  },
  { href: "/settings/privacy", label: "프라이버시", desc: "공개 범위 · DM 수신", icon: Shield },
  { href: "/settings/delete", label: "계정 삭제", desc: "돌이킬 수 없음", icon: Trash2 },
];

export default function SettingsPage() {
  return (
    <div className="container-reading py-8">
      <h1 className="text-3xl font-bold tracking-tight">설정</h1>
      <div className="mt-6 space-y-3">
        {items.map((it) => (
          <Link key={it.href} href={it.href}>
            <Card className="transition hover:border-primary/40">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <it.icon className="size-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{it.label}</p>
                  <p className="text-sm text-muted-foreground">{it.desc}</p>
                </div>
                <span aria-hidden className="text-muted-foreground">→</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
