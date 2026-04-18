# 배포 가이드

EduMakers 는 **Cloudflare Pages + D1 + R2 + KV** 스택으로 배포한다.

## 1. 사전 준비

- Cloudflare 계정 + `wrangler login` 완료
- 도메인 (선택)
- GitHub 저장소 연결 (선택, 자동 배포용)

## 2. 리소스 생성

```bash
# D1 (SQLite DB)
pnpm d1:create
# → 출력된 database_id 를 wrangler.toml 에 반영

# KV (세션/레이트리밋/캐시)
pnpm kv:create
# → 출력된 id 를 wrangler.toml 에 반영

# R2 버킷 2개
pnpm r2:create
```

## 3. 스키마 적용

```bash
pnpm d1:migrate:remote
pnpm d1:seed:remote
```

## 4. 시크릿 등록

Cloudflare Pages Dashboard 또는 CLI로 등록:

```bash
pnpm wrangler pages secret put BETTER_AUTH_SECRET   # 32자 이상 랜덤
pnpm wrangler pages secret put RESEND_API_KEY
pnpm wrangler pages secret put TURNSTILE_SECRET_KEY
pnpm wrangler pages secret put GOOGLE_CLIENT_ID
pnpm wrangler pages secret put GOOGLE_CLIENT_SECRET
pnpm wrangler pages secret put KAKAO_CLIENT_ID
pnpm wrangler pages secret put KAKAO_CLIENT_SECRET
pnpm wrangler pages secret put OPENAI_API_KEY
```

## 5. 배포

### A. CLI 배포

```bash
pnpm cf:build
pnpm cf:deploy
```

### B. GitHub 연동 자동 배포

Dashboard → Pages → Connect to Git
- Build command: `pnpm cf:build`
- Build output: `.open-next`
- 환경 변수: `NODE_VERSION=22`, `NEXT_PUBLIC_APP_URL=https://edumakers.pages.dev`

## 6. 도메인 연결

Cloudflare Dashboard → Pages → Custom domains → 도메인 추가.
DNS 레코드는 Cloudflare가 자동으로 CNAME 으로 설정.

SSL/TLS → Full (strict), Always Use HTTPS ON.

## 7. 초기 관리자 지정

처음 가입한 사용자를 admin 으로 승격:

```bash
pnpm wrangler d1 execute edumakers-db --remote \
  --command "UPDATE profiles SET role='super_admin', teacher_status='verified' WHERE username='YOUR_USERNAME';"
```

## 8. 검증 체크리스트

- [ ] https://securityheaders.com 에서 A 등급 이상
- [ ] /api/health 200 OK
- [ ] 회원가입 → 로그인 작동
- [ ] 교원 인증 제출 → 관리자 대시보드에서 승인 작동
- [ ] 게시글 작성 → 댓글 · 투표 작동
- [ ] 쇼케이스 제출 작동
- [ ] 다크모드 · 모바일 반응형 작동
