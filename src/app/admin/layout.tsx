import { redirect } from "next/navigation";
import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { Header } from "@/components/layout/header";
import { Users, FileText, Flag, ShieldCheck, ClipboardList, Home } from "lucide-react";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const NAV = [
  { href: "/admin", label: "대시보드", icon: Home },
  { href: "/admin/teacher-verification", label: "교원 인증", icon: ShieldCheck },
  { href: "/admin/users", label: "사용자", icon: Users },
  { href: "/admin/posts", label: "게시글", icon: FileText },
  { href: "/admin/reports", label: "신고", icon: Flag },
  { href: "/admin/audit", label: "감사 로그", icon: ClipboardList },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireRole(["moderator", "admin", "super_admin"]).catch(() => {
    redirect("/");
  });
  return (
    <>
      <Header />
      <div className="container-page grid gap-8 py-8 lg:grid-cols-[240px_1fr]">
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            관리자
          </h2>
          <nav className="flex flex-col gap-1">
            {NAV.map((i) => (
              <Link
                key={i.href}
                href={i.href}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-muted"
              >
                <i.icon className="size-4" />
                {i.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main>{children}</main>
      </div>
    </>
  );
}
