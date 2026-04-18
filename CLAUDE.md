# EduMakers — 프로젝트 가이드

> Claude Code가 이 프로젝트에서 작업할 때 참조하는 규칙. 모든 하위 에이전트도 이 규칙을 따른다.

## 프로젝트 개요

- **이름**: EduMakers (에듀메이커스)
- **태그라인**: 선생님들이 만들고, 선생님들이 나누는 AI 놀이터
- **GitHub**: https://github.com/iw-lab/iwplatform
- **스택**: Next.js 16 + TS 5 + Tailwind v4 + shadcn/ui + Cloudflare Pages/D1/R2/KV + Better Auth

## 필수 준수 (위반 시 바로 거절)

1. **TypeScript strict**. `any` 금지. 모르면 `unknown` + narrowing.
2. **모든 DB 쓰기는 Drizzle ORM**. raw SQL 금지 (마이그레이션 제외).
3. **서버 라우트·서버 컴포넌트는 `getSessionUser/requireAuth/requireVerifiedTeacher/requireRole`** 중 적절한 것 사용.
4. **Service role / VAPID private / BETTER_AUTH_SECRET 클라이언트 노출 절대 금지**. `NEXT_PUBLIC_` 접두사 없는 env는 서버에서만.
5. **사용자 입력은 Zod로 검증**. `src/lib/validators/*`에 스키마 정의.
6. **HTML 출력은 DOMPurify** (`src/lib/utils/sanitize.ts`). `dangerouslySetInnerHTML` 직접 X.
7. **하드코딩된 시크릿 금지**. 모두 `getCloudflareContext().env.*`.
8. **한국어 UI**. 영문 혼용 시 명사만, 문장은 한국어.
9. **커밋 전에 `pnpm type-check && pnpm build`** 통과.
10. **에러는 `logger` 또는 `logAudit/logSecurityEvent`**에 기록.

## 파일·폴더 규칙

- 컴포넌트 파일: `kebab-case.tsx`
- 훅: `use-*.ts`
- 서버 라우트: `src/app/api/**/route.ts`
- 클라이언트 컴포넌트: 최상단에 `"use client"`
- DB 스키마: `src/db/schema/<domain>.ts` → `index.ts`에서 re-export

## 핵심 명령어

```bash
pnpm dev                 # 개발 서버
pnpm build               # 프로덕션 빌드 (Next.js)
pnpm cf:build            # Cloudflare Pages 빌드 (OpenNext)
pnpm cf:deploy           # Cloudflare Pages 배포
pnpm type-check          # tsc --noEmit
pnpm db:generate         # Drizzle 마이그레이션 생성
pnpm d1:migrate:local    # 로컬 D1 마이그레이션 적용
pnpm d1:seed:local       # 로컬 D1 시드
```

## 자주 하는 작업 — 체크리스트

### 새 API 라우트
1. `src/app/api/<path>/route.ts`
2. Zod 스키마 `src/lib/validators/index.ts`
3. 인증 체크 (`requireAuth`/`requireVerifiedTeacher`)
4. Rate limit (`ipRateLimit`)
5. 감사 로그 (중요 액션만)

### 새 DB 테이블
1. `src/db/schema/<domain>.ts` 추가 → `index.ts` re-export
2. `pnpm db:generate`
3. 생성된 `drizzle/migrations/*.sql` 확인
4. `cloudflare-env.d.ts` 에 새 env 있으면 선언 추가

### 새 알림 트리거
1. `createNotification()` 호출 — 자동으로 DB + Web Push 발송
2. 이메일도 보내야 하면 `sendEmail()` + `src/lib/email/templates.ts` 에 템플릿

## 배포 체크리스트

Cloudflare Pages 배포 전 필수:
- `wrangler.toml`의 `database_id`, KV `id` 를 실제 값으로 치환
- 시크릿 등록: BETTER_AUTH_SECRET, RESEND_API_KEY, VAPID_*, OAuth, TURNSTILE_*, CRON_SECRET
- `pnpm d1:migrate:remote && pnpm d1:seed:remote`
- 첫 가입자 → 관리자 승격: `UPDATE profiles SET role='super_admin', teacher_status='verified' WHERE username='...'`

## 보안 체크리스트 (변경 전 매번 확인)

- [ ] 신규 쓰기 경로에 Zod 검증 있음
- [ ] 신규 쓰기 경로에 auth 체크 있음
- [ ] Rate limit 필요성 판단 (반복 호출 가능한가)
- [ ] 사용자 HTML 입력 → DOMPurify 정화
- [ ] 민감한 액션 → audit_logs 기록
- [ ] 새 env var → cloudflare-env.d.ts 에 declare

## 금지사항

- `any`, `@ts-ignore` (극히 예외만 허용, 이유 주석 필수)
- `console.log` (logger 사용)
- `getSession()` (Better Auth 권장 `getClaims` 대체재 미지원이므로 `getSessionUser`/`requireAuth` 래퍼 사용)
- `sleep N` 후 상태 가정
- 프로덕션 시크릿을 `.env.local`에 커밋 (반드시 `.gitignore`)
