import { Resend } from "resend";
import { getCloudflareContext } from "@opennextjs/cloudflare";

let _resend: Resend | null = null;

function client(): Resend | null {
  if (_resend) return _resend;
  try {
    const { env } = getCloudflareContext();
    if (!env.RESEND_API_KEY) return null;
    _resend = new Resend(env.RESEND_API_KEY);
    return _resend;
  } catch {
    return null;
  }
}

export async function sendEmail(opts: {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
}): Promise<{ ok: boolean; id?: string; error?: string }> {
  const c = client();
  if (!c) return { ok: false, error: "Email client not configured" };
  try {
    const { env } = getCloudflareContext();
    const from = opts.from ?? env.EMAIL_FROM ?? "EduMakers <noreply@edumakers.kr>";
    const to = opts.to;
    const payload = opts.html
      ? { from, to, subject: opts.subject, html: opts.html }
      : { from, to, subject: opts.subject, text: opts.text ?? "" };
    const { data, error } = await c.emails.send(payload);
    if (error) return { ok: false, error: error.message };
    return { ok: true, id: data?.id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}
