import { getCloudflareContext } from "@opennextjs/cloudflare";
import { requireRole } from "@/lib/auth/session";

/** 관리자·문서 소유자만 조회 가능 (교원 인증 서류) */
export async function GET(_req: Request, ctx: { params: Promise<{ name: string }> }) {
  const { name } = await ctx.params;
  const role = await requireRole(["admin", "super_admin", "moderator"]).catch(() => null);
  if (!role) return new Response("Forbidden", { status: 403 });

  const { env } = getCloudflareContext();
  const bucket = env.DOCS;
  if (!bucket) return new Response("Storage not configured", { status: 500 });
  const list = await bucket.list({ prefix: "teacher_doc/", limit: 1000 });
  const match = list.objects.find((o) => o.key.endsWith("/" + name));
  if (!match) return new Response("Not found", { status: 404 });
  const obj = await bucket.get(match.key);
  if (!obj) return new Response("Not found", { status: 404 });
  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set("Cache-Control", "private, max-age=60");
  return new Response(obj.body, { headers });
}
