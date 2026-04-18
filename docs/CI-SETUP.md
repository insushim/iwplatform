# CI/CD 설정 가이드

GitHub Actions 워크플로우는 `.github/workflows.manual/` 아래 준비되어 있습니다.
초기 커밋에 포함되지 못한 이유: 자동 배포에 사용된 토큰에 `workflow` 스코프가 없었어요.

## 활성화 방법

```bash
mv .github/workflows.manual .github/workflows
git add .github/workflows
git commit -m "chore: enable CI/CD workflows"

# workflow 권한이 있는 Personal Access Token으로 push
git push
```

또는 GitHub 웹 UI에서 `ci.yml`, `deploy-preview.yml` 내용을 복사해
`.github/workflows/` 아래 파일로 직접 생성해도 됩니다.

## 필요한 Repository Secrets

Cloudflare Pages 자동 배포 활성화 시:

- `CLOUDFLARE_API_TOKEN` — Workers & Pages 편집 권한
- `CLOUDFLARE_ACCOUNT_ID` — Dashboard → Workers & Pages에 표시

## 워크플로우 요약

### `ci.yml` — 매 push/PR
- pnpm install (frozen lockfile)
- `pnpm type-check`
- `pnpm lint` (경고는 비블로킹)
- `pnpm build`
- `pnpm audit --audit-level=high`

### `deploy-preview.yml` — PR별
- `pnpm cf:build`
- Cloudflare Pages에 `preview-<PR번호>` 브랜치로 배포
