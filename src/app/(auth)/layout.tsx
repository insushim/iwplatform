import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-background to-accent/5"
      />
      <header className="container-page flex h-16 items-center">
        <Link href="/" aria-label="홈으로">
          <Logo />
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">{children}</div>
      </main>
      <footer className="py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} EduMakers
      </footer>
    </div>
  );
}
