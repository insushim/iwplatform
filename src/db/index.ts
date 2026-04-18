import { drizzle } from "drizzle-orm/d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import * as schema from "./schema";

/**
 * 서버 런타임에서 Drizzle D1 인스턴스를 반환한다.
 * Cloudflare Pages 환경에서는 getCloudflareContext() 로 D1 바인딩을 꺼낸다.
 * 로컬 개발은 `wrangler dev` 또는 `opennextjs-cloudflare preview` 시 동작.
 */
export function getDb() {
  const { env } = getCloudflareContext();
  const d1 = env.DB as D1Database | undefined;
  if (!d1) {
    throw new Error(
      "D1 binding 'DB' not found. Ensure wrangler.toml binds it and `wrangler dev`/cf:preview is running.",
    );
  }
  return drizzle(d1, { schema });
}

export { schema };
export type Db = ReturnType<typeof getDb>;
