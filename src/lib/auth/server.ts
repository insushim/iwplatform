import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { twoFactor } from "better-auth/plugins";
import { getDb } from "@/db";
import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Better Auth 인스턴스 — 요청 시점에 지연 초기화 (CF 바인딩 접근 때문).
 * Next.js 서버 컴포넌트/라우트 핸들러/서버 액션에서 import 해 사용.
 */
let _auth: ReturnType<typeof createAuth> | null = null;

function createAuth() {
  const { env } = getCloudflareContext();
  const db = getDb();

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
      usePlural: true,
    }),
    secret: env.BETTER_AUTH_SECRET ?? "dev-only-secret-replace-in-production",
    baseURL: env.BETTER_AUTH_URL ?? env.APP_URL ?? "http://localhost:3000",
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 12,
      maxPasswordLength: 128,
      requireEmailVerification: false,
      autoSignIn: true,
    },
    socialProviders: {
      ...(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
        ? {
            google: {
              clientId: env.GOOGLE_CLIENT_ID,
              clientSecret: env.GOOGLE_CLIENT_SECRET,
            },
          }
        : {}),
      ...(env.KAKAO_CLIENT_ID && env.KAKAO_CLIENT_SECRET
        ? {
            kakao: {
              clientId: env.KAKAO_CLIENT_ID,
              clientSecret: env.KAKAO_CLIENT_SECRET,
            },
          }
        : {}),
    },
    session: {
      expiresIn: 60 * 60 * 24 * 30, // 30일
      updateAge: 60 * 60 * 24, // 24시간마다 갱신
      cookieCache: { enabled: true, maxAge: 60 * 5 },
    },
    advanced: {
      cookiePrefix: "edumakers",
      useSecureCookies: env.APP_URL?.startsWith("https") ?? false,
    },
    plugins: [twoFactor()],
    user: {
      additionalFields: {
        twoFactorEnabled: { type: "boolean", defaultValue: false, input: false },
      },
    },
  });
}

export function getAuth() {
  if (!_auth) _auth = createAuth();
  return _auth;
}

export type Auth = ReturnType<typeof createAuth>;
