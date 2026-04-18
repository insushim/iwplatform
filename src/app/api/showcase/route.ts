import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { showcaseProducts, profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSessionUser, requireVerifiedTeacher } from "@/lib/auth/session";
import { showcaseCreateSchema } from "@/lib/validators";
import { makeSlug, id as makeId } from "@/lib/utils/slug";
import { ipRateLimit } from "@/lib/security/rate-limit";


export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "UNAUTHENTICATED" }, { status: 401 });
  await ipRateLimit(req, "showcase-create", 3, 60 * 60 * 24);

  try {
    await requireVerifiedTeacher();
  } catch {
    return NextResponse.json({ message: "교원 인증이 필요합니다" }, { status: 403 });
  }

  const parsed = showcaseCreateSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json(
      { message: "유효성 검증 실패", issues: parsed.error.format() },
      { status: 400 },
    );
  }

  const db = getDb();
  const id = makeId();
  const slug = makeSlug(parsed.data.name);

  // 다음 월요일 KST 런치
  const nextMonday = new Date();
  const day = nextMonday.getDay();
  const diff = (8 - day) % 7 || 7;
  nextMonday.setDate(nextMonday.getDate() + diff);
  const launchWeek = nextMonday.toISOString().slice(0, 10);

  await db.insert(showcaseProducts).values({
    id,
    makerId: user.id,
    slug,
    ...parsed.data,
    status: "scheduled",
    launchWeek,
  });

  await db.update(profiles).set({ isMaker: true }).where(eq(profiles.userId, user.id));

  return NextResponse.json({ id, slug });
}
