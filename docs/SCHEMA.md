# DB 스키마

Cloudflare D1 (SQLite) + Drizzle ORM.

## 테이블 개요

| 카테고리 | 테이블 |
| --- | --- |
| 인증 | `users`, `sessions`, `accounts`, `verifications`, `two_factors` |
| 프로필 | `profiles`, `teacher_verifications`, `follows` |
| 콘텐츠 | `categories`, `tags`, `posts`, `post_tags`, `comments`, `votes`, `reactions`, `bookmarks` |
| 메이커 | `showcase_products`, `showcase_upvotes`, `showcase_comments`, `prompts`, `prompt_favorites` |
| 소셜 | `groups`, `group_members`, `events`, `event_attendees`, `conversations`, `conversation_participants`, `messages`, `notifications` |
| 모더레이션 | `reports`, `badges`, `user_badges`, `karma_history`, `audit_logs`, `security_events`, `ip_blocklist` |

## 주요 설계 결정

- **ID 전략** — Better Auth 테이블은 문자열(nanoid), 정수 증가형이 필요한 `categories/tags/badges/user_badges/audit_logs/karma_history/security_events` 만 `INTEGER PRIMARY KEY AUTOINCREMENT`.
- **Enum** — SQLite 에는 enum 이 없으므로 Drizzle 의 `text({ enum: [...] })` 로 타입 레벨 제약.
- **RLS 없음** — SQLite 에 RLS 가 없어, 모든 권한은 **애플리케이션 계층**(`requireAuth/requireVerifiedTeacher/requireRole`)에서 강제. API 라우트마다 체크.
- **타임스탬프** — `integer({mode: 'timestamp'})` + `default (unixepoch())`.
- **JSON 칼럼** — `text({mode: 'json'})` 로 구조화된 데이터 (tags, techStack, metadata, notificationPrefs 등).

## 쿼리 패턴

- 읽기: `drizzle.select().from().leftJoin().where().orderBy().limit()`
- 쓰기: 항상 `drizzle.insert().values()` (prepared statements)
- 카운터 증감: `sql\`${col} + 1\`` 로 원자적 업데이트

## 마이그레이션

- `pnpm db:generate` — 스키마 변경 후 SQL 생성
- `pnpm d1:migrate:local` — 로컬 D1 적용
- `pnpm d1:migrate:remote` — 원격 D1 적용

상세 내용은 `src/db/schema/*.ts` 파일 참조.
