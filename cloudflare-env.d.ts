/// <reference types="@cloudflare/workers-types" />

// Augment the global CloudflareEnv used by @opennextjs/cloudflare
declare global {
  interface CloudflareEnv {
    DB: D1Database;
    MEDIA: R2Bucket;
    DOCS: R2Bucket;
    KV: KVNamespace;
    ASSETS: Fetcher;

    APP_NAME: string;
    APP_URL: string;

    BETTER_AUTH_SECRET?: string;
    BETTER_AUTH_URL?: string;
    RESEND_API_KEY?: string;
    EMAIL_FROM?: string;
    GOOGLE_CLIENT_ID?: string;
    GOOGLE_CLIENT_SECRET?: string;
    KAKAO_CLIENT_ID?: string;
    KAKAO_CLIENT_SECRET?: string;
    TURNSTILE_SITE_KEY?: string;
    TURNSTILE_SECRET_KEY?: string;
    OPENAI_API_KEY?: string;
  }
}

export {};
