"use client";
import { useEffect, useState, useTransition } from "react";
import { Bell, BellOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const str = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(str);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

export function PushSubscribeButton() {
  const [supported, setSupported] = useState<boolean | null>(null);
  const [subscribed, setSubscribed] = useState(false);
  const [pending, start] = useTransition();
  const vapidPub = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";

  useEffect(() => {
    const ok =
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      "PushManager" in window;
    setSupported(ok);
    if (!ok) return;
    navigator.serviceWorker.ready
      .then((reg) => reg.pushManager.getSubscription())
      .then((sub) => setSubscribed(!!sub))
      .catch(() => undefined);
  }, []);

  async function subscribe() {
    start(async () => {
      try {
        if (!vapidPub) {
          toast.error("푸시 설정이 아직 완료되지 않았습니다 (관리자 설정 필요)");
          return;
        }
        const perm = await Notification.requestPermission();
        if (perm !== "granted") {
          toast.error("브라우저 알림 권한이 거부되었어요");
          return;
        }
        const reg = await navigator.serviceWorker.ready;
        const key = urlBase64ToUint8Array(vapidPub);
        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: key as BufferSource,
        });
        const sj = sub.toJSON();
        const r = await fetch("/api/push/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            endpoint: sj.endpoint,
            keys: { p256dh: sj.keys?.p256dh ?? "", auth: sj.keys?.auth ?? "" },
          }),
        });
        if (!r.ok) throw new Error("server save failed");
        setSubscribed(true);
        toast.success("이 기기에서 푸시를 받도록 설정했습니다");
      } catch {
        toast.error("구독 실패");
      }
    });
  }

  async function unsubscribe() {
    start(async () => {
      try {
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();
        if (sub) {
          const endpoint = sub.endpoint;
          await sub.unsubscribe();
          await fetch("/api/push/subscribe", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ endpoint }),
          });
        }
        setSubscribed(false);
        toast.success("푸시를 해제했습니다");
      } catch {
        toast.error("해제 실패");
      }
    });
  }

  if (supported === false) {
    return (
      <p className="text-xs text-muted-foreground">
        이 브라우저는 푸시 알림을 지원하지 않습니다.
      </p>
    );
  }

  return (
    <Button
      variant={subscribed ? "outline" : "default"}
      onClick={subscribed ? unsubscribe : subscribe}
      disabled={pending || supported === null}
    >
      {pending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : subscribed ? (
        <BellOff className="size-4" />
      ) : (
        <Bell className="size-4" />
      )}
      {subscribed ? "이 기기에서 푸시 끄기" : "이 기기에서 푸시 받기"}
    </Button>
  );
}
