# 보안 아키텍처

**"클로드 미토스가 와도 뚫지 못하는"** 다층 방어 — OWASP Top 10 2025 대응.

## 레이어 구조

1. **Network** — Cloudflare WAF + DDoS 보호 + Turnstile Captcha
2. **Application** — Next.js middleware, 보안 헤더
3. **Authentication** — Better Auth, bcrypt, JWT rotation, 2FA
4. **Authorization** — 앱 레벨 `requireAuth` / `requireVerifiedTeacher` / `requireRole`
5. **Input** — 모든 body/form Zod 검증
6. **Output** — DOMPurify 화이트리스트
7. **Audit** — `audit_logs` · `security_events` 테이블

## OWASP Top 10 2025 대응

| #   | 위협                    | 대응                                                                                               |
| --- | ----------------------- | -------------------------------------------------------------------------------------------------- |
| A01 | Broken Access Control   | 모든 서버 라우트 세션+역할 체크, SSRF 방지를 위해 외부 fetch 미사용                                |
| A02 | Cryptographic Failures  | HSTS `max-age=63072000`, bcrypt 해싱, Document SHA-256 hash, HTTPS 강제                            |
| A03 | Injection               | Drizzle ORM (prepared statements), Zod 검증, DOMPurify 출력 정화, 파일 MIME 검사 + 크기 제한       |
| A04 | Insecure Design         | 로그인 rate limit 5회/15분, 교원 인증 이중 채널 (문서 + 학교 이메일)                               |
| A05 | Security Misconfig      | 프로덕션 에러 상세 숨김, CSP header, X-Frame-Options, Referrer-Policy, Permissions-Policy         |
| A06 | Vulnerable Components   | `pnpm audit` CI 통합 가능, Dependabot 권장                                                          |
| A07 | ID/Auth Failures        | 비밀번호 zxcvbn 강도 검사 + 최소 12자, TOTP 2FA, 의심 로그인 감사                                  |
| A08 | Data Integrity Failures | 파일 업로드 SHA-256 hash 저장, lockfile 고정                                                       |
| A09 | Logging & Monitoring    | `audit_logs` (관리 액션), `security_events` (인증 시도), Cloudflare Analytics                     |
| A10 | SSRF                    | 외부 URL fetch 미사용, Turnstile remoteip 만 예외                                                   |

## HTTP 보안 헤더

`next.config.ts` 에서 전역 설정:

- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()`
- `Content-Security-Policy: <엄격한 정책>` (프로덕션만)

`src/middleware.ts` 추가 헤더:

- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Resource-Policy: same-site`
- `X-Permitted-Cross-Domain-Policies: none`

## Rate Limit 정책 (KV 기반)

| 엔드포인트      | 제한                      |
| --------------- | ------------------------- |
| 글쓰기          | 5회 / 1시간 / IP          |
| 댓글            | 30회 / 1시간 / IP         |
| 쇼케이스 제출   | 3회 / 1일 / IP            |
| 프롬프트 공유   | 10회 / 1시간 / IP         |
| 파일 업로드     | 20회 / 1시간 / IP, 10MB/파일 |
| 신고            | 10회 / 1일 / IP           |

## 파일 업로드 보안

- MIME 화이트리스트: JPEG/PNG/WebP/GIF/PDF
- 크기 제한: 10MB
- 저장: R2 (교원 문서는 별도 비공개 버킷 `DOCS`)
- 무결성: SHA-256 hash 저장

## 교원 인증 보안

- 2가지 방법 제공 (문서 / 학교 이메일)
- 문서 이미지는 비공개 버킷 + 해시 검증
- 관리자 검토 이력은 `audit_logs` 에 영구 기록
- 1년 유효기간, 만료 시 재인증 요구

## 버그 신고

취약점 발견 시 `security@edumakers.kr` 로 책임감 있는 공개 원칙에 따라 제보해 주세요.
