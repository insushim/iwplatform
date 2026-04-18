import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Users,
  Rocket,
  MessageSquare,
  ShieldCheck,
  Trophy,
  Heart,
  BookOpen,
} from "lucide-react";
import { CATEGORIES } from "@/lib/constants";

export default function HomePage() {
  return (
    <div>
      <Hero />
      <Logos />
      <Features />
      <CategoriesSection />
      <Showcase />
      <HowItWorks />
      <Testimonials />
      <Stats />
      <FAQ />
      <CTA />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[600px] bg-gradient-to-b from-primary/10 via-background to-background"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-20 -z-10 h-72 w-72 rounded-full bg-accent/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-40 -z-10 h-80 w-80 rounded-full bg-primary/20 blur-3xl"
      />
      <div className="container-page py-20 sm:py-28 lg:py-32">
        <div className="mx-auto max-w-3xl text-center animate-fade-in-up">
          <Badge variant="secondary" className="mb-6 rounded-full px-4 py-1.5">
            <Sparkles className="mr-1.5 size-3.5" /> 2026년 4월 베타 오픈
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            선생님들이 만들고,<br className="hidden sm:block" /> 선생님들이 나누는{" "}
            <span className="text-gradient-brand">AI 놀이터</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            초·중·고 교사를 위한 AI 커뮤니티. 바이브코딩으로 만든 앱을 공유하고,
            실전 프롬프트를 교환하고, 수업 노하우를 나누세요.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 px-8 text-base">
              <Link href="/signup">무료로 시작하기</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base">
              <Link href="/feed">둘러보기</Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            신용카드 필요 없음 · 교원 인증 후 전체 기능 이용 가능
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-5xl">
          <div className="relative rounded-2xl border bg-card shadow-2xl shadow-primary/10">
            <div className="flex items-center gap-1.5 border-b px-4 py-3">
              <span className="size-2.5 rounded-full bg-[#ff5f56]" />
              <span className="size-2.5 rounded-full bg-[#ffbd2e]" />
              <span className="size-2.5 rounded-full bg-[#27c93f]" />
              <span className="ml-4 text-xs text-muted-foreground">edumakers.kr</span>
            </div>
            <div className="grid gap-4 p-6 md:grid-cols-3">
              <div className="rounded-xl bg-muted/40 p-5">
                <Users className="size-6 text-primary" />
                <h3 className="mt-3 font-semibold">1,283명의 인증 교사</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  초·중·고 전 학년 · 전국 17개 시도
                </p>
              </div>
              <div className="rounded-xl bg-muted/40 p-5">
                <Rocket className="size-6 text-accent" />
                <h3 className="mt-3 font-semibold">47개 메이커 앱</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  선생님이 직접 만든 실전 교육 SaaS
                </p>
              </div>
              <div className="rounded-xl bg-muted/40 p-5">
                <MessageSquare className="size-6 text-[#10B981]" />
                <h3 className="mt-3 font-semibold">892개 프롬프트</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  검증된 수업용 프롬프트 아카이브
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Logos() {
  return (
    <section className="border-y bg-muted/20 py-10">
      <div className="container-page">
        <p className="text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
          전국 교사들이 함께합니다
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-lg font-semibold text-muted-foreground/80">
          <span>서울교대</span>
          <span>경인교대</span>
          <span>부산교대</span>
          <span>공주교대</span>
          <span>광주교대</span>
          <span>춘천교대</span>
          <span>대구교대</span>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    {
      icon: Rocket,
      title: "메이커 쇼케이스",
      description: "매주 월요일, 선생님이 만든 새로운 앱과 SaaS가 공개됩니다. 업보트로 응원하고 댓글로 피드백하세요.",
      tint: "from-primary/20 to-primary/5",
    },
    {
      icon: Sparkles,
      title: "프롬프트 라이브러리",
      description: "Claude · GPT · Gemini 별로 정리된 실전 수업 프롬프트. 포크해서 내 수업에 맞게 수정하세요.",
      tint: "from-accent/20 to-accent/5",
    },
    {
      icon: MessageSquare,
      title: "10개의 전문 카테고리",
      description: "AI 수업, 학급 운영, 평가 피드백, 수업자료까지. 내게 필요한 이야기만 골라 읽으세요.",
      tint: "from-[#10B981]/20 to-[#10B981]/5",
    },
    {
      icon: ShieldCheck,
      title: "엄격한 교원 인증",
      description: "공문서·재직증명서 기반 이중 인증. 진짜 선생님만 참여하는 안전한 커뮤니티.",
      tint: "from-[#3B82F6]/20 to-[#3B82F6]/5",
    },
    {
      icon: Trophy,
      title: "Trust Level & 뱃지",
      description: "활동에 따라 자동으로 부여되는 신뢰도. 꾸준한 나눔이 커뮤니티의 인정으로.",
      tint: "from-[#F97316]/20 to-[#F97316]/5",
    },
    {
      icon: Heart,
      title: "인디모임 & 멘토링",
      description: "관심사별 학습공동체를 만들고 멘토를 연결하세요. 혼자 만들지 말고, 함께.",
      tint: "from-[#EC4899]/20 to-[#EC4899]/5",
    },
  ];
  return (
    <section className="py-20 sm:py-28">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            교사가 교사에게, <span className="text-gradient-brand">진짜 도움</span>이 되는 것들
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            인디스쿨의 20년 커뮤니티 DNA에 ProductHunt의 메이커 문화, Discourse의 Trust Level을
            결합했습니다.
          </p>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((f) => (
            <Card key={f.title} className="group relative overflow-hidden border-border/60">
              <div
                aria-hidden
                className={`absolute inset-0 -z-10 bg-gradient-to-br ${f.tint} opacity-0 transition group-hover:opacity-100`}
              />
              <CardContent className="p-6">
                <div className="mb-4 inline-flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <f.icon className="size-5" />
                </div>
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {f.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoriesSection() {
  return (
    <section className="border-y bg-muted/20 py-20">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            관심사에 맞는 이야기를 찾아보세요
          </h2>
          <p className="mt-4 text-muted-foreground">10개의 전문 카테고리와 자유 태그</p>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/posts/category/${c.slug}`}
              className="group flex flex-col items-center rounded-xl border bg-card p-5 text-center transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
            >
              <span className="text-3xl">{c.icon}</span>
              <span className="mt-2 text-sm font-semibold">{c.name}</span>
              <span className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                {c.description}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Showcase() {
  const products = [
    {
      name: "수학톡톡",
      tagline: "초등 수학 개념을 친구에게 설명하게 하는 AI 튜터",
      tags: ["초등", "수학", "AI 튜터"],
      votes: 248,
    },
    {
      name: "수업 플래너",
      tagline: "교과서 목차만 넣으면 차시별 지도안을 생성",
      tags: ["수업 준비", "중·고"],
      votes: 189,
    },
    {
      name: "학급 알림장+",
      tagline: "학부모 알림장·사진 공유를 하나로",
      tags: ["학급 운영", "초등"],
      votes: 156,
    },
  ];
  return (
    <section className="py-20 sm:py-28">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Badge variant="secondary">이번 주 런치</Badge>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              선생님이 만든 이번 주의 앱
            </h2>
            <p className="mt-2 text-muted-foreground">
              매주 월요일 새로운 교육용 앱과 SaaS가 공개됩니다
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/showcase">전체 보기 →</Link>
          </Button>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {products.map((p, idx) => (
            <Card key={p.name} className="group overflow-hidden">
              <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-primary/20 via-accent/10 to-background">
                <span className="text-6xl">{["🧮", "📅", "📣"][idx]}</span>
              </div>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{p.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{p.tagline}</p>
                  </div>
                  <div className="flex flex-col items-center rounded-md border bg-muted/40 px-2.5 py-1.5">
                    <span className="text-[10px] text-muted-foreground">▲</span>
                    <span className="text-sm font-bold">{p.votes}</span>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.tags.map((t) => (
                    <Badge key={t} variant="outline" className="text-xs">
                      {t}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "가입 & 교원 인증",
      description:
        "이메일이나 소셜 로그인으로 가입. 재직증명서 또는 .go.kr 이메일로 교원 인증.",
    },
    {
      step: "02",
      title: "탐험 & 학습",
      description:
        "피드를 둘러보고 관심 태그를 설정. 프롬프트를 포크하고, 앱을 북마크.",
    },
    {
      step: "03",
      title: "공유 & 연결",
      description:
        "수업 후기·프롬프트·빌드 스토리를 올리세요. 팔로워가 생기고, Trust Level이 오릅니다.",
    },
  ];
  return (
    <section className="border-y bg-muted/20 py-20">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">이렇게 시작해요</h2>
          <p className="mt-4 text-muted-foreground">3분이면 커뮤니티의 일원이 됩니다</p>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.step} className="relative rounded-2xl border bg-card p-8">
              <span className="text-6xl font-bold text-primary/10">{s.step}</span>
              <h3 className="mt-3 text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const items = [
    {
      name: "김은정 선생님",
      role: "5학년 담임 · 서울",
      quote:
        "수업 준비하다 막힐 때마다 들르는 곳이에요. 실제 교실에서 검증된 프롬프트라 바로 써먹을 수 있어요.",
    },
    {
      name: "박지훈 선생님",
      role: "중등 과학 · 대전",
      quote:
        "바이브코딩 배우기 시작했는데 여기 메이커들이 다 친절해요. 제가 만든 앱도 여기서 처음 공개할 예정.",
    },
    {
      name: "이서연 선생님",
      role: "고등 국어 · 부산",
      quote:
        "서술형 평가 피드백 자동화 프롬프트 하나로 학기 끝났어요. 시간을 벌어준 커뮤니티에 매달 커피값 후원 중.",
    },
  ];
  return (
    <section className="py-20 sm:py-28">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            선생님들의 진짜 이야기
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((t) => (
            <Card key={t.name}>
              <CardContent className="p-6">
                <p className="text-[15px] leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    { label: "인증 교사", value: "1,283+" },
    { label: "게시글", value: "5,421" },
    { label: "메이커 앱", value: "47" },
    { label: "프롬프트", value: "892" },
  ];
  return (
    <section className="border-y bg-primary/5 py-14">
      <div className="container-page">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-4xl font-bold tracking-tight text-gradient-brand">{s.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const items = [
    {
      q: "정말 무료인가요?",
      a: "네, 핵심 기능은 전부 무료입니다. 운영비는 자발적 후원과 최소한의 기업 파트너십으로 충당합니다.",
    },
    {
      q: "교원 인증은 어떻게 하나요?",
      a: "① 학교 이메일(.go.kr / .sen.kr 등) 인증, ② 재직증명서나 공문서 업로드 중 편한 방법을 선택하세요. 관리자가 1~2일 내 검토합니다.",
    },
    {
      q: "예비교사·교대생도 가입할 수 있나요?",
      a: "가입은 가능하지만 글쓰기·댓글은 교원 인증 후 가능합니다. 임용 후 인증 바꿔주세요.",
    },
    {
      q: "제가 만든 앱을 어떻게 공유하나요?",
      a: "쇼케이스 메뉴에서 제출하시면 됩니다. 스크린샷 3장 이상, 1분 데모 영상 권장. 매주 월요일 런치 데이에 공개됩니다.",
    },
    {
      q: "인디스쿨과는 뭐가 다른가요?",
      a: "인디스쿨의 자생적 나눔 문화를 계승하되, 초등만이 아닌 전 급별 교사 대상이며 AI·메이커 콘텐츠에 특화되어 있습니다.",
    },
  ];
  return (
    <section className="py-20 sm:py-28">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">자주 묻는 질문</h2>
        </div>
        <div className="mx-auto mt-12 max-w-3xl space-y-3">
          {items.map((it) => (
            <details
              key={it.q}
              className="group rounded-xl border bg-card p-5 transition hover:border-primary/40"
            >
              <summary className="flex cursor-pointer items-center justify-between font-semibold">
                {it.q}
                <span className="ml-4 text-2xl text-muted-foreground transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{it.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-20 sm:py-28">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-accent p-10 text-center text-primary-foreground sm:p-16">
          <BookOpen
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 size-48 opacity-10"
          />
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            혼자 만들지 말고, 함께 만들어요
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg opacity-90">
            매주 새로운 프롬프트, 새로운 앱, 새로운 선생님을 만나세요.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" variant="secondary" className="h-12 px-8 text-base">
              <Link href="/signup">가입하고 둘러보기</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 border-white/30 bg-white/10 px-8 text-base text-white hover:bg-white/20"
            >
              <Link href="/about">소개 보기</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
