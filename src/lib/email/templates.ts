import { SITE } from "@/lib/constants";

const BASE = SITE.url;

function wrap(title: string, body: string, cta?: { label: string; href: string }): string {
  return `<!DOCTYPE html>
<html><body style="margin:0; padding:24px; background:#f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif;">
<div style="max-width:560px; margin:0 auto; background:white; border-radius:16px; overflow:hidden;">
  <div style="padding:24px 32px; background:linear-gradient(135deg,#4F46E5,#F59E0B); color:white;">
    <div style="font-size:14px; opacity:0.9; font-weight:600;">EduMakers · 에듀메이커스</div>
    <h1 style="margin:6px 0 0; font-size:22px;">${title}</h1>
  </div>
  <div style="padding:28px 32px; color:#0f172a; line-height:1.65; font-size:15px;">
    ${body}
    ${
      cta
        ? `<div style="margin-top:28px;"><a href="${cta.href}" style="display:inline-block; padding:12px 24px; background:#4F46E5; color:white; border-radius:8px; text-decoration:none; font-weight:600;">${cta.label}</a></div>`
        : ""
    }
    <p style="margin-top:32px; font-size:12px; color:#94a3b8;">
      이 메일은 ${SITE.nameKo}의 시스템 메일입니다. <a href="${BASE}/settings/notifications" style="color:#64748b;">알림 설정</a>에서 수신을 관리할 수 있습니다.
    </p>
  </div>
</div>
</body></html>`;
}

export function welcomeEmail(displayName: string) {
  return {
    subject: `${SITE.nameKo}에 오신 것을 환영합니다 🎉`,
    html: wrap(
      `${displayName} 선생님, 반가워요!`,
      `
      <p>에듀메이커스에 가입해 주셔서 감사합니다. 더 풍부한 경험을 위해 몇 가지를 완료해 주세요.</p>
      <ul style="padding-left:20px;">
        <li><strong>교원 인증</strong> — 재직증명서 또는 학교 이메일로 인증하면 글쓰기·메이커 쇼케이스·DM이 열립니다.</li>
        <li><strong>프로필 꾸미기</strong> — 담당 교과·경력·소개를 적어 주세요.</li>
        <li><strong>피드 둘러보기</strong> — 이번 주 인기 글과 새로 런치된 앱을 만나보세요.</li>
      </ul>`,
      { label: "시작하기", href: `${BASE}/onboarding` },
    ),
  };
}

export function teacherVerifiedEmail(displayName: string) {
  return {
    subject: "교원 인증이 승인되었습니다 ✓",
    html: wrap(
      "교원 인증 완료!",
      `
      <p>${displayName} 선생님, 교원 인증이 <strong style="color:#10B981;">승인</strong>되었습니다.</p>
      <p>이제 글쓰기, 메이커 앱 제출, 프롬프트 공유, 인디모임 개설, DM 주고받기가 모두 가능해졌어요.</p>`,
      { label: "글쓰기 시작", href: `${BASE}/posts/new` },
    ),
  };
}

export function teacherRejectedEmail(displayName: string, reason: string) {
  return {
    subject: "교원 인증 추가 확인이 필요합니다",
    html: wrap(
      "교원 인증 미승인",
      `
      <p>${displayName} 선생님, 제출해 주신 서류로는 교원 여부를 확정할 수 없었습니다.</p>
      <p><strong>사유</strong>: ${reason}</p>
      <p>재직증명서 전체가 선명히 보이도록 다시 업로드하시거나, 학교 공식 이메일(.go.kr · .sen.kr 등)로 인증해 주세요.</p>`,
      { label: "다시 인증하기", href: `${BASE}/verify-teacher` },
    ),
  };
}

export function replyEmail(
  recipientName: string,
  actorName: string,
  postTitle: string,
  preview: string,
  link: string,
) {
  return {
    subject: `${actorName}님이 답글을 남겼어요`,
    html: wrap(
      `${recipientName} 선생님께 새 답글`,
      `
      <p><strong>${actorName}</strong>님이 <em>&ldquo;${postTitle}&rdquo;</em> 에 답글을 남겼습니다.</p>
      <blockquote style="margin:16px 0; padding:12px 16px; background:#f8fafc; border-left:3px solid #4F46E5; color:#475569;">
        ${preview}
      </blockquote>`,
      { label: "답글 보기", href: `${BASE}${link}` },
    ),
  };
}

export function mentionEmail(
  recipientName: string,
  actorName: string,
  preview: string,
  link: string,
) {
  return {
    subject: `${actorName}님이 회원님을 언급했어요`,
    html: wrap(
      `${recipientName} 선생님께 멘션`,
      `
      <p><strong>${actorName}</strong>님이 댓글·글에서 회원님을 언급했습니다.</p>
      <blockquote style="margin:16px 0; padding:12px 16px; background:#f8fafc; border-left:3px solid #F59E0B; color:#475569;">
        ${preview}
      </blockquote>`,
      { label: "보러 가기", href: `${BASE}${link}` },
    ),
  };
}

export function loginAlertEmail(
  displayName: string,
  ipAddress: string,
  userAgent: string,
) {
  return {
    subject: "새로운 기기에서 로그인 감지",
    html: wrap(
      "새 기기 로그인 알림",
      `
      <p>${displayName} 선생님, 새로운 기기에서 로그인이 감지되었습니다.</p>
      <p style="padding:12px 16px; background:#f8fafc; border-radius:8px; font-family: monospace; font-size:13px;">
        IP: ${ipAddress}<br/>기기: ${userAgent}
      </p>
      <p>본인이 아니라면 즉시 비밀번호를 변경하고 2단계 인증을 활성화하세요.</p>`,
      { label: "보안 설정", href: `${BASE}/settings/account` },
    ),
  };
}
