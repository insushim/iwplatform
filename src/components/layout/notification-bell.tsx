"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { timeAgo } from "@/lib/utils/date";
import { toast } from "sonner";

interface Notif {
  id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  isRead: boolean;
  createdAt: string | Date;
}

export function NotificationBell() {
  const router = useRouter();
  const [items, setItems] = useState<Notif[]>([]);
  const [open, setOpen] = useState(false);
  const unread = items.filter((n) => !n.isRead).length;

  useEffect(() => {
    let mounted = true;
    async function fetchOnce() {
      try {
        const r = await fetch("/api/notifications", { cache: "no-store" });
        if (!r.ok) return;
        const j = (await r.json()) as { notifications: Notif[] };
        if (mounted) setItems(j.notifications ?? []);
      } catch {
        // noop
      }
    }
    fetchOnce();
    const iv = setInterval(fetchOnce, 45_000);
    const onVisible = () => {
      if (document.visibilityState === "visible") fetchOnce();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      mounted = false;
      clearInterval(iv);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  async function markAllRead() {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      });
      setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success("모두 읽음 처리");
    } catch {
      toast.error("실패");
    }
  }

  function openItem(n: Notif) {
    setItems((prev) =>
      prev.map((i) => (i.id === n.id ? { ...i, isRead: true } : i)),
    );
    fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: [n.id] }),
    }).catch(() => undefined);
    setOpen(false);
    if (n.link) router.push(n.link);
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        render={
          <button
            aria-label={`알림 ${unread > 0 ? `(읽지 않음 ${unread})` : ""}`}
            className="relative rounded-md p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <Bell className="size-5" />
            {unread > 0 ? (
              <span
                aria-hidden
                className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground"
              >
                {unread > 9 ? "9+" : unread}
              </span>
            ) : null}
          </button>
        }
      />
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b p-3">
          <h3 className="text-sm font-semibold">알림</h3>
          {unread > 0 ? (
            <Button variant="ghost" size="sm" onClick={markAllRead}>
              모두 읽음
            </Button>
          ) : null}
        </div>
        <ul className="max-h-[420px] overflow-y-auto">
          {items.length === 0 ? (
            <li className="p-8 text-center text-sm text-muted-foreground">
              새로운 알림이 없어요.
            </li>
          ) : (
            items.slice(0, 15).map((n) => (
              <li key={n.id}>
                <button
                  onClick={() => openItem(n)}
                  className={`flex w-full items-start gap-2 border-b px-3 py-2.5 text-left text-sm transition last:border-none hover:bg-muted/50 ${
                    n.isRead ? "" : "bg-primary/5"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`mt-1 size-2 shrink-0 rounded-full ${n.isRead ? "bg-muted" : "bg-primary"}`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{n.title}</p>
                    {n.body ? (
                      <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                        {n.body}
                      </p>
                    ) : null}
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      {timeAgo(new Date(n.createdAt))}
                    </p>
                  </div>
                </button>
              </li>
            ))
          )}
        </ul>
        <div className="border-t p-2">
          <Link
            href="/notifications"
            onClick={() => setOpen(false)}
            className="block rounded px-3 py-2 text-center text-xs font-medium text-primary hover:bg-primary/5"
          >
            모든 알림 보기
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
