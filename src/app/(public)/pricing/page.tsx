import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "후원하기",
  description: "에듀메이커스의 모든 기능은 무료입니다. 커피 한 잔으로 지속가능성에 힘을 보태주세요.",
};

const TIERS = [
  {
    name: "무료",
    price: "₩0",
    unit: "영원히",
    description: "핵심 기능을 모두 이용",
    features: [
      "게시판 · 댓글 · 투표 · 북마크",
      "메이커 쇼케이스 탐색",
      "프롬프트 라이브러리 이용",
      "인디모임 참여 (무제한)",
      "월 10회 이미지 업로드",
    ],
    cta: "무료로 시작하기",
    href: "/signup",
    highlight: false,
  },
  {
    name: "커피 한 잔",
    price: "₩4,900",
    unit: "/월",
    description: "지속가능성을 응원하고 약간의 혜택",
    features: [
      "무료 플랜의 모든 것",
      "월 500MB 이미지/파일 업로드",
      "후원자 전용 뱃지",
      "신규 기능 베타 우선 접근",
      "광고 제거 (유일한 광고는 교육부 공지)",
    ],
    cta: "월 ₩4,900 후원",
    href: "/signup?plan=coffee",
    highlight: true,
  },
  {
    name: "서포터",
    price: "₩19,900",
    unit: "/월",
    description: "커뮤니티를 깊이 후원하는 분들께",
    features: [
      "커피 한 잔의 모든 것",
      "무제한 이미지/파일 업로드",
      "DM 전송 제한 해제",
      "연간 결산 리포트 이름 등재",
      "오프라인 모임 우선 초대",
    ],
    cta: "월 ₩19,900 후원",
    href: "/signup?plan=supporter",
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className="container-page py-20">
      <div className="mx-auto max-w-2xl text-center">
        <Badge variant="secondary" className="rounded-full px-4 py-1.5">
          <Heart className="mr-1.5 size-3.5" /> 무료 커뮤니티
        </Badge>
        <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
          모든 기능은 무료입니다
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          지속가능성을 위한 후원은 자발적이며, 후원자와 무료 회원이 같은 콘텐츠를 봅니다.
          나눔 문화를 타협하지 않으려는 우리의 약속입니다.
        </p>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {TIERS.map((t) => (
          <Card
            key={t.name}
            className={
              t.highlight
                ? "relative border-primary shadow-xl shadow-primary/10"
                : "relative"
            }
          >
            {t.highlight ? (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                가장 많이 선택
              </Badge>
            ) : null}
            <CardContent className="p-8">
              <h3 className="text-lg font-semibold">{t.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t.description}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight">{t.price}</span>
                <span className="text-sm text-muted-foreground">{t.unit}</span>
              </div>
              <Button
                asChild
                className="mt-6 w-full"
                variant={t.highlight ? "default" : "outline"}
              >
                <Link href={t.href}>{t.cta}</Link>
              </Button>
              <ul className="mt-6 space-y-2.5">
                {t.features.map((f) => (
                  <li key={f} className="flex gap-2 text-sm">
                    <Check className="size-5 shrink-0 text-primary" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mx-auto mt-20 max-w-2xl rounded-2xl border bg-muted/30 p-8 text-center">
        <h3 className="text-xl font-bold">후원금은 어디에 쓰이나요?</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          서버 비용(Cloudflare · 도메인), 이메일 발송, 교원 인증 검토 인건비, 오프라인 모임 지원에
          투명하게 사용됩니다. 연 1회 결산 리포트를 공개합니다.
        </p>
      </div>
    </div>
  );
}
