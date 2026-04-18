import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "소개",
  description: "에듀메이커스는 교사를 위한, 교사가 만드는 AI 커뮤니티입니다.",
};

export default function AboutPage() {
  return (
    <div className="container-reading py-16 prose-kor">
      <h1 className="text-4xl font-bold tracking-tight">우리는 왜 이걸 만들었나</h1>
      <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
        AI가 교실의 풍경을 빠르게 바꾸고 있습니다. 그러나 정작 그 현장에서 아이들을 만나는 선생님들의
        목소리는 흩어져 있습니다. 인디스쿨이 20년간 지켜온 &ldquo;나눔의 문화&rdquo;, ProductHunt가 증명한
        &ldquo;메이커의 용기&rdquo;, 그리고 교사만이 알 수 있는 실전 감각 — 이 셋을 한 곳에 모으고자 했습니다.
      </p>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">우리가 믿는 것들</h2>
        <ul className="mt-4 space-y-3">
          <li className="flex gap-3">
            <span aria-hidden className="text-2xl">🤝</span>
            <div>
              <strong>혼자 만들지 말고, 함께 만들어요.</strong> 비슷한 문제로 고민하는 동료 교사가 반드시
              있습니다.
            </div>
          </li>
          <li className="flex gap-3">
            <span aria-hidden className="text-2xl">🎓</span>
            <div>
              <strong>교실에서 검증된 것만 나눕니다.</strong> 이론이 아닌, 실제 수업에서 써본 이야기.
            </div>
          </li>
          <li className="flex gap-3">
            <span aria-hidden className="text-2xl">🔓</span>
            <div>
              <strong>콘텐츠는 교사 공동체의 것입니다.</strong> 상업적 폐쇄가 아닌, 열린 공유를 지향합니다.
            </div>
          </li>
          <li className="flex gap-3">
            <span aria-hidden className="text-2xl">🛡️</span>
            <div>
              <strong>안전한 공간을 타협하지 않습니다.</strong> 엄격한 교원 인증과 투명한 모더레이션.
            </div>
          </li>
        </ul>
      </section>

      <section className="mt-12 grid gap-4 md:grid-cols-3">
        {[
          { n: "1,283+", l: "인증 교사" },
          { n: "47", l: "메이커 앱" },
          { n: "892", l: "프롬프트" },
        ].map((i) => (
          <Card key={i.l}>
            <CardContent className="p-6 text-center">
              <p className="text-3xl font-bold text-gradient-brand">{i.n}</p>
              <p className="mt-1 text-sm text-muted-foreground">{i.l}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">로드맵</h2>
        <ol className="mt-4 space-y-4">
          <li className="rounded-xl border bg-card p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              2026 Q2 · Now
            </p>
            <p className="mt-1 font-semibold">베타 오픈 — 인증, 게시판, 프롬프트, 쇼케이스</p>
          </li>
          <li className="rounded-xl border bg-card p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              2026 Q3
            </p>
            <p className="mt-1 font-semibold">인디모임 · 이벤트 · Web Push 알림</p>
          </li>
          <li className="rounded-xl border bg-card p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              2026 Q4
            </p>
            <p className="mt-1 font-semibold">iOS · Android 래퍼 앱, 지역 오프라인 모임 큐레이션</p>
          </li>
        </ol>
      </section>

      <div className="mt-12 flex gap-3">
        <Button asChild size="lg">
          <Link href="/signup">가입하기</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/contact">문의하기</Link>
        </Button>
      </div>
    </div>
  );
}
