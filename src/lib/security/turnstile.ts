import { getCloudflareContext } from "@opennextjs/cloudflare";

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstile(token: string, ip?: string): Promise<boolean> {
  try {
    const { env } = getCloudflareContext();
    const secret = env.TURNSTILE_SECRET_KEY;
    if (!secret) return true; // 개발 중 captcha 미설정 → 통과
    const body = new URLSearchParams({ secret, response: token });
    if (ip) body.append("remoteip", ip);
    const r = await fetch(VERIFY_URL, { method: "POST", body });
    const j = (await r.json()) as { success: boolean };
    return j.success;
  } catch {
    return false;
  }
}
