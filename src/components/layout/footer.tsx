import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { SITE } from "@/lib/constants";

const LINKS = {
  product: [
    { href: "/feed", label: "피드" },
    { href: "/showcase", label: "메이커 쇼케이스" },
    { href: "/prompts", label: "프롬프트 라이브러리" },
    { href: "/groups", label: "인디모임" },
  ],
  community: [
    { href: "/about", label: "소개" },
    { href: "/pricing", label: "후원하기" },
    { href: "/contact", label: "문의" },
    { href: SITE.githubRepo, label: "GitHub", external: true },
  ],
  legal: [
    { href: "/terms", label: "이용약관" },
    { href: "/privacy", label: "개인정보처리방침" },
  ],
};

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-muted/30">
      <div className="container-page py-12">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Logo />
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {SITE.tagline}
            </p>
          </div>
          <FooterColumn title="서비스" items={LINKS.product} />
          <FooterColumn title="커뮤니티" items={LINKS.community} />
          <FooterColumn title="약관" items={LINKS.legal} />
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {SITE.nameKo}. All rights reserved.</p>
          <p>
            made with <span aria-label="love">💜</span> by teachers, for teachers
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: ReadonlyArray<{ href: string; label: string; external?: boolean }>;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <ul className="mt-3 space-y-2">
        {items.map((it) => (
          <li key={it.href}>
            {it.external ? (
              <a
                href={it.href}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {it.label}
              </a>
            ) : (
              <Link href={it.href} className="text-sm text-muted-foreground hover:text-foreground">
                {it.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
