import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { posts, profiles } from "@/db/schema";
import { sql, and, eq, desc } from "drizzle-orm";
import { getSessionUser, requireVerifiedTeacher } from "@/lib/auth/session";
import { postCreateSchema } from "@/lib/validators";
import { makeSlug, id as makeId } from "@/lib/utils/slug";
import { sanitizeHtml } from "@/lib/utils/sanitize";
import { ipRateLimit } from "@/lib/security/rate-limit";
import { logAudit } from "@/lib/security/audit";


export async function GET(req: Request) {
  const url = new URL(req.url);
  const limit = Math.min(Number(url.searchParams.get("limit") ?? 20), 50);
  const db = getDb();
  const rows = await db
    .select({ p: posts, a: profiles })
    .from(posts)
    .leftJoin(profiles, eq(profiles.userId, posts.authorId))
    .where(eq(posts.status, "published"))
    .orderBy(desc(posts.publishedAt))
    .limit(limit);
  return NextResponse.json({ posts: rows });
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "UNAUTHENTICATED" }, { status: 401 });

  const rl = await ipRateLimit(req, "post-create", 5, 60 * 60);
  if (!rl.ok) {
    return NextResponse.json(
      { message: "글쓰기 한도를 초과했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 429 },
    );
  }

  try {
    await requireVerifiedTeacher();
  } catch {
    return NextResponse.json(
      { message: "교원 인증이 필요합니다" },
      { status: 403 },
    );
  }

  const parsed = postCreateSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json(
      { message: "유효성 검증 실패", issues: parsed.error.format() },
      { status: 400 },
    );
  }

  const db = getDb();
  const slug = makeSlug(parsed.data.title);
  const pid = makeId();

  await db.insert(posts).values({
    id: pid,
    authorId: user.id,
    categoryId: parsed.data.categoryId,
    slug,
    title: parsed.data.title,
    content: sanitizeHtml(parsed.data.content),
    contentText: parsed.data.contentText,
    excerpt: parsed.data.excerpt,
    coverImageUrl: parsed.data.coverImageUrl,
    isAnonymous: parsed.data.isAnonymous,
    status: parsed.data.status,
  });

  await db
    .update(profiles)
    .set({ postCount: sql`${profiles.postCount} + 1` })
    .where(eq(profiles.userId, user.id));

  await logAudit({
    actorId: user.id,
    action: "post.created",
    targetType: "post",
    targetId: pid,
  });

  return NextResponse.json({ id: pid, slug });
}
