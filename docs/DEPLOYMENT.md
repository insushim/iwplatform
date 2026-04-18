# 배포 가이드

EduMakers v0.4 배포 현황 (2026-04-18):

- ✅ Cloudflare D1 `edumakers-db` 생성 완료 (`8696a8ef-afbb-47a5-b180-e9a2eadc40d4`, APAC)
- ✅ 마이그레이션 2개 (`0000_*`, `0001_push_*`) remote 적용 완료
- ✅ 시드 데이터 (10 카테고리 · 8 뱃지 · 15 태그) remote 주입 완료
- ✅ KV namespace `KV` 생성 완료 (`42d961d15bbf4e71b19a6655522ba246`, NEXT_INC_CACHE_KV 재사용)
- ⏸ R2 버킷 — 계정에 R2 미활성화 (대시보드에서 Enable 필요)
- ⏸ Worker 배포 — 번들 21MB로 Workers 무료 3MiB 한도 초과

## ⚠ 배포 제약 조건

Next.js 16 + React 19 + Tiptap + Drizzle + Better Auth 조합의 번들이 자연스레
20MB 수준입니다. 이는 Cloudflare의 무료 한도를 초과합니다:

| 플랜 | 한도 | 현재 번들 | 결과 |
| --- | --- | --- | --- |
| Workers Free | 3 MiB | ~21 MiB | ❌ |
| Pages Free `_worker.js` | 1 MiB | ~21 MiB | ❌ |
| **Workers Paid $5/월** | **10 MiB** | ~21 MiB | ❌ (gzip 시 통과 가능성) |
| Cloudflare Full-stack Paid | 제한 완화 | ~21 MiB | ✅ |

## 배포 경로 3가지

### A. Workers Paid ($5/월) — 권장

1. https://dash.cloudflare.com/d793b56b68116f5a38bbcfd202661f1a/workers/plans
2. **Workers Paid** Upgrade
3. 시크릿 등록 (아래 목록)
4. `pnpm cf:deploy`

### B. Cloudflare Pages Git 연동 (무료, 크기 제약)

1. https://dash.cloudflare.com/d793b56b68116f5a38bbcfd202661f1a/pages
2. **Create a project** → **Connect to Git** → `iw-lab/iwplatform`
3. Build 설정:
   - Framework preset: **None**
   - Build command: `pnpm cf:build`
   - Build output directory: `.open-next/assets`
   - Root directory: `/`
   - Environment variables: `NODE_VERSION=22`, `PNPM_VERSION=10`
4. 첫 배포 후 wrangler.toml의 D1·KV binding을 Pages 프로젝트에 연결
   (Pages > Settings > Functions > Bindings)
5. ⚠ 동일한 1MiB `_worker.js` 제약으로 실패 가능 — 이 경우 A 경로로

### C. Vercel 배포 (무료, 크기 제한 없음)

1. `@opennextjs/cloudflare` 제거 후 일반 Next.js 배포
2. D1 대신 Vercel Postgres + Drizzle PostgreSQL 어댑터
3. 스키마 `sqlite-core` → `pg-core` 재작성 필요 (상당한 변경)

## 시크릿 등록 (Workers Paid 경로)

```bash
# 32자 이상 랜덤 (Mac/Linux)
openssl rand -base64 48 | pnpm wrangler secret put BETTER_AUTH_SECRET

# 필수
pnpm wrangler secret put RESEND_API_KEY
pnpm wrangler secret put EMAIL_FROM       # "EduMakers <noreply@edumakers.kr>"
pnpm wrangler secret put TURNSTILE_SECRET_KEY

# OAuth (선택 — 없으면 소셜 로그인 비활성)
pnpm wrangler secret put GOOGLE_CLIENT_ID
pnpm wrangler secret put GOOGLE_CLIENT_SECRET
pnpm wrangler secret put KAKAO_CLIENT_ID
pnpm wrangler secret put KAKAO_CLIENT_SECRET

# Web Push (선택)
pnpm wrangler secret put VAPID_PUBLIC_KEY
pnpm wrangler secret put VAPID_PRIVATE_KEY
pnpm wrangler secret put VAPID_SUBJECT

# Cron (주간 다이제스트 인증)
pnpm wrangler secret put CRON_SECRET

# AI (OpenAI moderation 무료)
pnpm wrangler secret put OPENAI_API_KEY
```

## R2 활성화 (파일 업로드 사용 시)

1. https://dash.cloudflare.com/d793b56b68116f5a38bbcfd202661f1a/r2
2. Enable R2 (결제 정보 필요, 무료 할당량 10GB)
3. `pnpm r2:create`
4. `wrangler.toml`에서 `[[r2_buckets]]` 블록 주석 해제

## 초기 관리자 승격

첫 사용자가 가입한 뒤:

```bash
pnpm wrangler d1 execute edumakers-db --remote \
  --command "UPDATE profiles SET role='super_admin', teacher_status='verified' WHERE username='YOUR_USERNAME';"
```

## 환영 게시글 주입 (선택)

```bash
# drizzle/seed-welcome.sql 의 'REPLACE_ADMIN_USER_ID' 를 실제 user_id 로 치환 후:
pnpm wrangler d1 execute edumakers-db --remote --file=./drizzle/seed-welcome.sql
```

## 배포 검증 체크리스트

- [ ] https://securityheaders.com 에서 A+
- [ ] `/api/health` → 200 OK
- [ ] 회원가입 → 이메일 인증 → 로그인
- [ ] 교원 인증 제출 → 관리자 승인 → 이메일 수신
- [ ] 글 작성 → 댓글 → 투표 → 북마크
- [ ] 쇼케이스 제출 → 업보트 동작
- [ ] 다크모드 · 모바일 반응형
- [ ] PWA 설치 가능 (Chrome, Safari)

## 현재 적용된 자원 요약

```toml
# wrangler.toml (실제 값 반영됨)
[[d1_databases]]
binding = "DB"
database_name = "edumakers-db"
database_id = "8696a8ef-afbb-47a5-b180-e9a2eadc40d4"

[[kv_namespaces]]
binding = "KV"
id = "42d961d15bbf4e71b19a6655522ba246"

[[kv_namespaces]]
binding = "NEXT_INC_CACHE_KV"
id = "42d961d15bbf4e71b19a6655522ba246"
```
