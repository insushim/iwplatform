import type { Metadata } from "next";

export const metadata: Metadata = { title: "개인정보처리방침" };

export default function PrivacyPage() {
  return (
    <div className="container-reading py-16 prose-kor">
      <h1 className="text-3xl font-bold tracking-tight">개인정보처리방침</h1>
      <p className="mt-2 text-sm text-muted-foreground">시행일: 2026년 4월 18일</p>

      <section className="mt-8 space-y-4 text-[15px] leading-relaxed">
        <h2 className="text-xl font-bold">1. 수집 항목</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>필수: 이메일, 암호화된 비밀번호, 표시 이름, 닉네임, IP 주소</li>
          <li>교원 인증: 재직증명서 또는 공문서 이미지(해시화 후 원본 폐기 옵션 제공), 학교명, 학년</li>
          <li>선택: 프로필 사진, 자기소개, 교과목, 경력, 외부 링크</li>
          <li>자동 수집: 쿠키, 접속 기기 정보, 서비스 이용 기록</li>
        </ul>

        <h2 className="text-xl font-bold">2. 이용 목적</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>회원 가입·인증 및 서비스 제공</li>
          <li>스팸·어뷰징 방지 및 보안 로그 기록</li>
          <li>공지사항 전달, 알림 발송(선택 가능)</li>
          <li>통계 분석 (개인 식별 불가능한 집계 형태)</li>
        </ul>

        <h2 className="text-xl font-bold">3. 보관 기간</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>회원 탈퇴 시 즉시 파기 (법령상 보관 의무 외)</li>
          <li>로그인/보안 이벤트 로그: 3년</li>
          <li>감사 로그(관리 액션): 7년</li>
        </ul>

        <h2 className="text-xl font-bold">4. 제3자 제공</h2>
        <p>
          법령에 따른 요구 또는 회원의 명시적 동의 없이는 제3자에게 제공하지 않습니다. 단 다음의
          클라우드 서비스 업체를 처리 위탁합니다.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Cloudflare (호스팅·CDN·DDoS 방어)</li>
          <li>Resend (트랜잭션 이메일)</li>
          <li>Cloudflare D1/R2 (데이터베이스·파일 저장, Asia-Pacific 리전)</li>
        </ul>

        <h2 className="text-xl font-bold">5. 이용자 권리</h2>
        <p>
          회원은 언제든 개인정보 열람·정정·삭제·처리정지를 요청할 수 있으며, 설정 &gt; 계정 메뉴에서
          직접 수행할 수 있습니다.
        </p>

        <h2 className="text-xl font-bold">6. 보안 조치</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>TLS 1.3 전 구간 암호화</li>
          <li>비밀번호 bcrypt 해싱 (cost 10+)</li>
          <li>Rate limiting, 2FA 옵션 제공</li>
          <li>의심 로그인 이메일 알림, IP 블록리스트</li>
        </ul>

        <h2 className="text-xl font-bold">7. 문의</h2>
        <p>개인정보 보호책임자: admin@edumakers.kr</p>
      </section>
    </div>
  );
}
