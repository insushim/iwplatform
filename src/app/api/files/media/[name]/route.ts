import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * R2 media bucket serving. Public read. 업로드 시 key가 `media/<uid>/<name>` 형태이므로
 * [name] 만으로는 key를 못 찾는다. 대신 list prefix로 찾아 첫 매치 반환. (간단 구현)
 * 더 견고하게 하려면 DB에 파일 메타 저장 후 조회.
 */
export async function GET(_req: Request, ctx: { params: Promise<{ name: string }> }) {
  const { name } = await ctx.params;
  const { env } = getCloudflareContext();
  const bucket = env.MEDIA;
  if (!bucket) return new Response("Storage not configured", { status: 500 });

  const list = await bucket.list({ prefix: "media/", limit: 1000 });
  const match = list.objects.find((o) => o.key.endsWith("/" + name));
  if (!match) return new Response("Not found", { status: 404 });
  const obj = await bucket.get(match.key);
  if (!obj) return new Response("Not found", { status: 404 });
  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  return new Response(obj.body, { headers });
}
