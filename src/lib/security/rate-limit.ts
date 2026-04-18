import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Cloudflare KV 기반 간이 rate limiter.
 * 슬라이딩 윈도우 대신 고정 윈도우(간단, 비용 저렴) 사용.
 */
export async function rateLimit(opts: {
  key: string;
  limit: number;
  windowSec: number;
}): Promise<{ ok: boolean; remaining: number; resetAt: number }> {
  const { env } = getCloudflareContext();
  const kv = env.KV;
  if (!kv) return { ok: true, remaining: opts.limit, resetAt: 0 };

  const now = Math.floor(Date.now() / 1000);
  const bucket = Math.floor(now / opts.windowSec);
  const resetAt = (bucket + 1) * opts.windowSec;
  const k = `rl:${opts.key}:${bucket}`;

  const raw = await kv.get(k);
  const count = raw ? parseInt(raw, 10) : 0;
  if (count >= opts.limit) return { ok: false, remaining: 0, resetAt };
  await kv.put(k, String(count + 1), { expirationTtl: opts.windowSec + 10 });
  return { ok: true, remaining: opts.limit - count - 1, resetAt };
}

export async function ipRateLimit(
  req: Request,
  kind: string,
  limit: number,
  windowSec: number,
) {
  const ip =
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-real-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  return rateLimit({ key: `${kind}:${ip}`, limit, windowSec });
}
