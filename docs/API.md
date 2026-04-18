# API 엔드포인트

모든 API는 Edge Runtime 에서 실행. 모든 `POST/PATCH/DELETE` 는 세션 필수.

## 인증

| Method | Path                    | 설명                             |
| ------ | ----------------------- | -------------------------------- |
| ALL    | `/api/auth/[...all]`    | Better Auth 전용 핸들러          |

## 프로필

| Method | Path                   | 설명                                           |
| ------ | ---------------------- | ---------------------------------------------- |
| POST   | `/api/profile/bootstrap` | 가입 직후 프로필 행 생성 (username/displayName) |
| PATCH  | `/api/profile`         | 내 프로필 수정                                 |

## 교원 인증

| Method | Path                   | 설명                     |
| ------ | ---------------------- | ------------------------ |
| POST   | `/api/teacher/verify`  | 교원 인증 요청 제출      |
| POST   | `/api/admin/teacher/approve` | 관리자: 승인        |
| POST   | `/api/admin/teacher/reject`  | 관리자: 거절        |

## 게시글

| Method | Path                    | 설명                    |
| ------ | ----------------------- | ----------------------- |
| GET    | `/api/posts`            | 목록                    |
| POST   | `/api/posts`            | 새 글 (교원 인증 필요)  |
| POST   | `/api/posts/:id/vote`   | 추천/비추천/취소        |

## 댓글

| Method | Path           | 설명                     |
| ------ | -------------- | ------------------------ |
| POST   | `/api/comments` | 댓글 작성 (교원 인증)   |

## 쇼케이스

| Method | Path                      | 설명                    |
| ------ | ------------------------- | ----------------------- |
| POST   | `/api/showcase`           | 앱 제출 (교원 인증)     |
| POST   | `/api/showcase/:id/upvote` | 업보트 토글            |

## 프롬프트

| Method | Path               | 설명                    |
| ------ | ------------------ | ----------------------- |
| POST   | `/api/prompts`     | 프롬프트 공유 (인증)    |

## 업로드

| Method | Path           | 설명                         |
| ------ | -------------- | ---------------------------- |
| POST   | `/api/upload`  | 파일 업로드 (multipart/form) |

## 신고

| Method | Path           | 설명           |
| ------ | -------------- | -------------- |
| POST   | `/api/reports` | 신고 접수      |

## 검색

| Method | Path                   | 설명                 |
| ------ | ---------------------- | -------------------- |
| GET    | `/api/search?q=<query>` | 제목·본문 검색       |

## 시스템

| Method | Path           | 설명                    |
| ------ | -------------- | ----------------------- |
| GET    | `/api/health`  | 헬스체크                |

## 공통 응답 형식

### 성공

```json
{ "ok": true, "data": {...} }
```

### 오류

```json
{ "message": "한글 오류 메시지", "issues": {...} }
```

상태 코드:
- `400` 유효성 실패
- `401` 미인증
- `403` 권한/교원인증 부족
- `413` 파일 크기 초과
- `415` 지원하지 않는 MIME
- `429` Rate limit 초과
