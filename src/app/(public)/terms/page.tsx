import type { Metadata } from "next";

export const metadata: Metadata = { title: "이용약관" };

export default function TermsPage() {
  return (
    <div className="container-reading py-16 prose-kor">
      <h1 className="text-3xl font-bold tracking-tight">이용약관</h1>
      <p className="mt-2 text-sm text-muted-foreground">시행일: 2026년 4월 18일</p>

      <section className="mt-8 space-y-4 text-[15px] leading-relaxed">
        <h2 className="text-xl font-bold">제1조 (목적)</h2>
        <p>
          본 약관은 에듀메이커스(이하 &ldquo;회사&rdquo;)가 제공하는 교사 커뮤니티 서비스(이하
          &ldquo;서비스&rdquo;)의 이용과 관련하여 회사와 회원 간의 권리·의무·책임사항 및 기타 필요한
          사항을 정함을 목적으로 합니다.
        </p>

        <h2 className="text-xl font-bold">제2조 (회원의 의무)</h2>
        <ol className="list-decimal space-y-1 pl-5">
          <li>회원은 정확하고 진실된 정보로 회원 가입 및 교원 인증을 해야 합니다.</li>
          <li>타인의 정보를 도용하거나 허위 서류로 인증을 시도할 수 없습니다.</li>
          <li>
            게시물은 타인의 지적재산권·명예·프라이버시를 침해하지 않아야 하며, 학생 개인정보를
            포함해서는 안 됩니다.
          </li>
          <li>광고·스팸·다단계 홍보 등 커뮤니티 취지에 반하는 행위를 금합니다.</li>
        </ol>

        <h2 className="text-xl font-bold">제3조 (콘텐츠 저작권)</h2>
        <p>
          회원이 작성한 게시물의 저작권은 회원 본인에게 귀속합니다. 다만 회원은 회사에 대해 서비스
          내 게시·전시·복제·배포할 수 있는 비독점적 이용권을 부여합니다.
        </p>

        <h2 className="text-xl font-bold">제4조 (서비스 제한 및 해지)</h2>
        <p>
          회사는 본 약관 또는 커뮤니티 가이드라인 위반 시 경고·게시물 삭제·일시 정지·영구 정지 등의
          조치를 취할 수 있으며, 회원은 언제든 계정을 탈퇴할 수 있습니다.
        </p>

        <h2 className="text-xl font-bold">제5조 (면책)</h2>
        <p>
          회사는 천재지변·시스템 장애·회원의 귀책 사유로 인한 손해에 대해 책임지지 않습니다.
          회원 간 거래·분쟁에 대한 책임은 당사자에게 있습니다.
        </p>

        <h2 className="text-xl font-bold">제6조 (변경)</h2>
        <p>
          본 약관은 30일 전 공지 후 변경될 수 있으며, 중대한 변경의 경우 개별 동의를 받습니다.
        </p>
      </section>
    </div>
  );
}
