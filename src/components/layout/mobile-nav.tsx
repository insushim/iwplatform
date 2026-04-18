"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MobileNav({
  items,
  isAuthed,
}: {
  items: ReadonlyArray<{ href: string; label: string }>;
  isAuthed: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setOpen(true)}
        aria-label="메뉴 열기"
      >
        <Menu className="size-5" />
      </Button>
      {open ? (
        <div
          className="fixed inset-0 z-50 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute right-0 top-0 h-full w-72 max-w-[85vw] bg-background p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <span className="font-semibold">메뉴</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                aria-label="메뉴 닫기"
              >
                <X className="size-5" />
              </Button>
            </div>
            <nav className="flex flex-col gap-1">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-muted"
                >
                  {item.label}
                </Link>
              ))}
              {!isAuthed ? (
                <div className="mt-4 flex flex-col gap-2 border-t pt-4">
                  <Button asChild variant="outline" onClick={() => setOpen(false)}>
                    <Link href="/login">로그인</Link>
                  </Button>
                  <Button asChild onClick={() => setOpen(false)}>
                    <Link href="/signup">가입하기</Link>
                  </Button>
                </div>
              ) : null}
            </nav>
          </div>
        </div>
      ) : null}
    </>
  );
}
