<div align="center">

# 🎓 EduMakers · 에듀메이커스

**선생님들이 만들고, 선생님들이 나누는 AI 놀이터**

_초·중·고 교사를 위한 AI 커뮤니티 — 메이커 쇼케이스 · 프롬프트 라이브러리 · 수업 노하우 공유_

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages-F38020?logo=cloudflare)](https://pages.cloudflare.com)
[![D1](https://img.shields.io/badge/Cloudflare-D1-F38020?logo=cloudflare)](https://developers.cloudflare.com/d1/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

---

## ✨ 특징

- 🤖 **AI 네이티브** — Claude · GPT · Gemini 프롬프트 라이브러리, AI 도구 리뷰
- 🚀 **메이커 쇼케이스** — 매주 월요일 교사들이 만든 앱/SaaS 런치
- 🎓 **엄격한 교원 인증** — 재직증명서 업로드 + 학교 이메일 이중 인증
- 🏆 **Trust Level & 뱃지** — Discourse 스타일 게이미피케이션
- 💬 **10개 카테고리 게시판** — 투표·댓글·북마크·신고
- 🛡️ **OWASP Top 10 2025 대응** — Rate limit, CSP, 감사 로그, 2FA
- 📱 **모바일 퍼스트** — PWA, 반응형, 다크모드
- 🌐 **Cloudflare 스택** — Pages + D1(SQLite) + R2 + KV · 글로벌 엣지

## 🛠️ 기술 스택

| 레이어          | 기술                                                               |
| --------------- | ------------------------------------------------------------------ |
| Framework       | Next.js 16 (App Router, React 19, Turbopack)                       |
| Language        | TypeScript 5 (strict)                                              |
| Styling         | Tailwind CSS v4 + shadcn/ui (Radix)                                |
| Auth            | [Better Auth](https://better-auth.com) (email/password, OAuth, 2FA) |
| Database        | Cloudflare D1 (SQLite) + [Drizzle ORM](https://orm.drizzle.team)   |
| Storage         | Cloudflare R2 (이미지·문서)                                        |
| Cache / RateLim | Cloudflare KV                                                      |
| Email           | Resend                                                             |
| Captcha         | Cloudflare Turnstile                                               |
| Deploy          | Cloudflare Pages via `@opennextjs/cloudflare`                      |
| Monitoring      | Sentry (선택)                                                      |

## 🚀 로컬에서 시작하기

### 1. 의존성 설치

```bash
pnpm install
```

### 2. 환경 변수

```bash
cp .env.example .env.local
cp .dev.vars.example .dev.vars
# 편집해서 최소한 BETTER_AUTH_SECRET 은 32자 이상 랜덤 값으로
```

### 3. Cloudflare 리소스 생성

```bash
pnpm wrangler login
pnpm d1:create       # DB ID를 wrangler.toml 에 반영
pnpm kv:create       # KV ID를 wrangler.toml 에 반영
pnpm r2:create       # 버킷 2개 생성 (edumakers-media, edumakers-docs)
```

### 4. 스키마 마이그레이션 + 시드

```bash
pnpm d1:migrate:local   # 로컬 D1 에 마이그레이션 적용
pnpm d1:seed:local      # 카테고리 · 뱃지 · 태그 시드
```

### 5. 개발 서버

```bash
pnpm dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인.

## 🌩️ Cloudflare Pages 배포

### 준비

```bash
pnpm d1:migrate:remote   # 원격 D1 에 마이그레이션
pnpm d1:seed:remote      # 원격 시드
```

### 시크릿 등록

```bash
pnpm wrangler pages secret put BETTER_AUTH_SECRET
pnpm wrangler pages secret put RESEND_API_KEY
pnpm wrangler pages secret put GOOGLE_CLIENT_ID
pnpm wrangler pages secret put GOOGLE_CLIENT_SECRET
pnpm wrangler pages secret put KAKAO_CLIENT_ID
pnpm wrangler pages secret put KAKAO_CLIENT_SECRET
pnpm wrangler pages secret put TURNSTILE_SECRET_KEY
pnpm wrangler pages secret put OPENAI_API_KEY
```

### 배포

```bash
pnpm cf:build    # OpenNext Cloudflare 빌드
pnpm cf:deploy   # 배포
```

또는 Cloudflare Dashboard 에서 GitHub 리포 연결 후:

- **Build command**: `pnpm cf:build`
- **Build output**: `.open-next/`
- **Root directory**: `/`

## 📂 프로젝트 구조

```
src/
  app/
    (public)/      # 공개 라우트 (홈, 소개, 후원, 약관, 정책, 문의)
    (auth)/        # 인증 플로우 (로그인, 가입, 비번찾기, 2FA, 교원인증)
    (app)/         # 로그인 필요 (피드, 글, 쇼케이스, 프롬프트, 프로필, 설정)
    admin/         # 관리자 (대시보드, 교원승인, 신고처리, 감사)
    api/           # REST API routes (edge runtime)
  components/
    ui/            # shadcn/ui primitives
    layout/        # Header/Footer/Nav
    brand/         # 로고
    auth/          # 인증 전용 컴포넌트
    posts/         # 게시글 관련
    providers/     # Theme/Query Provider
  db/
    schema/        # Drizzle 스키마 (auth, profiles, content, showcase, social, moderation)
  lib/
    auth/          # Better Auth 서버/클라이언트
    security/      # rate-limit, audit, turnstile
    validators/    # Zod 스키마 (전체 입력)
    utils/         # slug, date, text, sanitize
drizzle/
  migrations/      # SQL 마이그레이션
  seed.sql         # 실제 초기 데이터
```

## 🔒 보안

- **OWASP Top 10 2025** 전 항목 방어 — `docs/SECURITY.md` 참조
- **권한 검사** 서버 컴포넌트·API 라우트마다 `requireAuth` / `requireVerifiedTeacher` / `requireRole`
- **Rate Limiting** KV 기반, 엔드포인트별 차등
- **입력 검증** 모든 body/form 은 Zod 로 검증
- **출력 정화** DOMPurify 화이트리스트
- **CSP** `next.config.ts` 프로덕션 빌드에만 적용
- **감사 로그** 관리 액션·교원 인증·정책 변경 전부

취약점을 발견하셨나요? `security@edumakers.kr` 로 제보해 주세요.

## 📜 라이선스

MIT — [LICENSE](LICENSE)

## 🙏 함께하고 싶다면

이슈 · PR 환영합니다. 한국 교사 커뮤니티를 위한 오픈소스.

**혼자 만들지 말고, 함께 만들어요.**
