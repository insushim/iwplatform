import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { users, profiles, posts, categories, showcaseProducts } from "@/db/schema";
import { and, desc, eq, gte } from "drizzle-orm";
import { sendEmail } from "@/lib/email/client";
import { SITE } from "@/lib/constants";
import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * 주간 다이제스트.
 * - Cloudflare cron 호출 시 `Authorization: Bearer <CRON_SECRET>` 필요.
 * - 사용자별 notificationPrefs.emailDigest = true 면 발송.
 */
export async function GET(req: Request) {
  const { env } = getCloudflareContext();
  const secret = req.headers.get("authorization");
  const expected = env.CRON_SECRET ? `Bearer ${env.CRON_SECRET}` : null;
  if (expected && secret !== expected) {
    return NextResponse.json({ message: "forbidden" }, { status: 403 });
  }

  const db = getDb();
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400_000);

  const [hotPosts, weeklyLaunches] = await Promise.all([
    db
      .select({
        title: posts.title,
        slug: posts.slug,
        excerpt: posts.excerpt,
        voteScore: posts.voteScore,
        category: categories.name,
      })
      .from(posts)
      .innerJoin(categories, eq(categories.id, posts.categoryId))
      .where(and(eq(posts.status, "published"), gte(posts.publishedAt, sevenDaysAgo)))
      .orderBy(desc(posts.voteScore))
      .limit(5)
      .catch(() => []),
    db
      .select({
        name: showcaseProducts.name,
        slug: showcaseProducts.slug,
        tagline: showcaseProducts.tagline,
        upvoteCount: showcaseProducts.upvoteCount,
      })
      .from(showcaseProducts)
      .where(eq(showcaseProducts.status, "launched"))
      .orderBy(desc(showcaseProducts.upvoteCount))
      .limit(3)
      .catch(() => []),
  ]);

  // 구독자 조회 (digest = true, deleted_at null)
  const subscribers = await db
    .select({
      userId: profiles.userId,
      displayName: profiles.displayName,
      email: users.email,
      prefs: profiles.notificationPrefs,
    })
    .from(profiles)
    .innerJoin(users, eq(users.id, profiles.userId))
    .limit(2000)
    .catch(() => []);

  const targets = subscribers.filter((s) => s.prefs?.emailDigest !== false);

  const html = renderDigestHtml({
    hotPosts,
    weeklyLaunches,
  });

  let sent = 0;
  await Promise.all(
    targets.map(async (t) => {
      const r = await sendEmail({
        to: t.email,
        subject: `${SITE.nameKo} · 이번 주 하이라이트`,
        html,
      });
      if (r.ok) sent += 1;
    }),
  );

  return NextResponse.json({ targets: targets.length, sent });
}

function renderDigestHtml({
  hotPosts,
  weeklyLaunches,
}: {
  hotPosts: Array<{ title: string; slug: string; excerpt: string | null; category: string }>;
  weeklyLaunches: Array<{ name: string; slug: string; tagline: string; upvoteCount: number }>;
}): string {
  const baseUrl = SITE.url;
  const postsHtml = hotPosts
    .map(
      (p) => `
      <li style="margin: 14px 0; padding: 14px; background: #f8fafc; border-radius: 8px;">
        <div style="color: #4F46E5; font-size: 12px; font-weight: 600;">${p.category}</div>
        <a href="${baseUrl}/posts/${p.slug}" style="color: #0f172a; font-weight: 700; text-decoration: none;">${p.title}</a>
        ${p.excerpt ? `<p style="margin: 6px 0 0; color: #64748b; font-size: 14px;">${p.excerpt}</p>` : ""}
      </li>`,
    )
    .join("");
  const showcaseHtml = weeklyLaunches
    .map(
      (s) => `
      <li style="margin: 12px 0;">
        <a href="${baseUrl}/showcase/${s.slug}" style="color: #0f172a; font-weight: 700; text-decoration: none;">${s.name}</a>
        <span style="color: #F59E0B; margin-left: 8px;">▲ ${s.upvoteCount}</span>
        <p style="margin: 4px 0 0; color: #64748b; font-size: 14px;">${s.tagline}</p>
      </li>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html><body style="margin:0; padding:24px; background:#f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif;">
<div style="max-width:600px; margin:0 auto; background:white; border-radius:16px; overflow:hidden;">
  <div style="padding:32px; background:linear-gradient(135deg,#4F46E5,#F59E0B); color:white;">
    <h1 style="margin:0; font-size:24px;">EduMakers · 이번 주 하이라이트</h1>
    <p style="margin:8px 0 0; opacity:0.9;">선생님들이 가장 많이 찾은 글과 이번 주 런치 앱</p>
  </div>
  <div style="padding:24px;">
    <h2 style="margin:0 0 12px; font-size:18px;">🔥 이번 주 인기 글</h2>
    <ol style="list-style:none; padding:0; margin:0;">${postsHtml || "<li>아직 글이 없어요</li>"}</ol>
    ${weeklyLaunches.length ? `<h2 style="margin:28px 0 12px; font-size:18px;">🚀 이번 주 런치</h2><ul style="list-style:none; padding:0; margin:0;">${showcaseHtml}</ul>` : ""}
    <div style="margin-top:28px; text-align:center;">
      <a href="${baseUrl}/feed" style="display:inline-block; padding:12px 24px; background:#4F46E5; color:white; border-radius:8px; text-decoration:none; font-weight:600;">에듀메이커스에서 더 보기</a>
    </div>
    <p style="margin-top:24px; font-size:12px; color:#94a3b8; text-align:center;">
      이 메일을 받기 싫다면 <a href="${baseUrl}/settings/notifications" style="color:#64748b;">알림 설정</a>에서 꺼주세요.
    </p>
  </div>
</div>
</body></html>`;
}
