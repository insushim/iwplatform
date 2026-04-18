import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";
import { getSessionProfile } from "@/lib/auth/session";
import { MobileNav } from "./mobile-nav";

const NAV = [
  { href: "/feed", label: "피드" },
  { href: "/posts", label: "게시판" },
  { href: "/showcase", label: "쇼케이스" },
  { href: "/prompts", label: "프롬프트" },
  { href: "/groups", label: "인디모임" },
  { href: "/events", label: "이벤트" },
];

export async function Header() {
  const session = await getSessionProfile().catch(() => null);
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center gap-4">
        <Link href="/" className="shrink-0" aria-label="EduMakers 홈">
          <Logo />
        </Link>
        <nav className="hidden flex-1 items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          {session?.user ? (
            <UserMenu
              name={session.profile?.displayName ?? session.user.name}
              username={session.profile?.username ?? ""}
              avatarUrl={session.profile?.avatarUrl ?? session.user.image}
              role={session.profile?.role ?? "user"}
              teacherStatus={session.profile?.teacherStatus ?? "unverified"}
            />
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link href="/login">로그인</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signup">가입하기</Link>
              </Button>
            </>
          )}
          <MobileNav items={NAV} isAuthed={Boolean(session?.user)} />
        </div>
      </div>
    </header>
  );
}
