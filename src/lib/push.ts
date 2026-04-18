import "server-only";
import { getDb } from "@/db";
import { pushSubscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Web Push payload 발송. Cloudflare Workers 환경에서 동작하도록 VAPID JWT 직접 생성.
 * 라이브러리 의존성을 피하기 위해 최소 구현.
 */
async function signVapidJWT(endpoint: string, subject: string, privateKeyB64: string, publicKeyB64: string) {
  const url = new URL(endpoint);
  const aud = `${url.protocol}//${url.host}`;
  const header = { typ: "JWT", alg: "ES256" };
  const payload = {
    aud,
    exp: Math.floor(Date.now() / 1000) + 12 * 60 * 60,
    sub: subject,
  };
  const enc = (o: unknown) =>
    btoa(JSON.stringify(o)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  const body = `${enc(header)}.${enc(payload)}`;

  const raw = Uint8Array.from(atob(privateKeyB64.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));
  const key = await crypto.subtle.importKey(
    "pkcs8",
    raw,
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    key,
    new TextEncoder().encode(body),
  );
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  return { jwt: `${body}.${sigB64}`, publicKey: publicKeyB64 };
}

export async function sendPushToUser(
  userId: string,
  payload: { title: string; body?: string; url?: string },
) {
  try {
    const { env } = getCloudflareContext();
    const pub = env.VAPID_PUBLIC_KEY;
    const priv = env.VAPID_PRIVATE_KEY;
    const subject = env.VAPID_SUBJECT ?? "mailto:admin@edumakers.kr";
    if (!pub || !priv) return;

    const db = getDb();
    const subs = await db
      .select()
      .from(pushSubscriptions)
      .where(eq(pushSubscriptions.userId, userId));

    await Promise.all(
      subs.map(async (s) => {
        const { jwt } = await signVapidJWT(s.endpoint, subject, priv, pub);
        const r = await fetch(s.endpoint, {
          method: "POST",
          headers: {
            Authorization: `vapid t=${jwt}, k=${pub}`,
            "Content-Encoding": "aes128gcm",
            "Content-Type": "application/octet-stream",
            TTL: "86400",
          },
          body: new TextEncoder().encode(JSON.stringify(payload)),
        });
        if (r.status === 404 || r.status === 410) {
          // 만료된 구독 제거
          await db.delete(pushSubscriptions).where(eq(pushSubscriptions.id, s.id));
        }
      }),
    );
  } catch {
    // push 실패는 사용자에게 영향 주지 않음
  }
}
