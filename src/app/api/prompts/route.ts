import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { prompts } from "@/db/schema";
import { getSessionUser, requireVerifiedTeacher } from "@/lib/auth/session";
import { promptCreateSchema } from "@/lib/validators";
import { id as makeId } from "@/lib/utils/slug";
import { ipRateLimit } from "@/lib/security/rate-limit";


export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "UNAUTHENTICATED" }, { status: 401 });

  const rl = await ipRateLimit(req, "prompt-create", 10, 60 * 60);
  if (!rl.ok) return NextResponse.json({ message: "한도 초과" }, { status: 429 });

  try {
    await requireVerifiedTeacher();
  } catch {
    return NextResponse.json({ message: "교원 인증이 필요합니다" }, { status: 403 });
  }

  const parsed = promptCreateSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ message: "bad" }, { status: 400 });
  }

  const db = getDb();
  const id = makeId();
  await db.insert(prompts).values({
    id,
    authorId: user.id,
    ...parsed.data,
  });
  return NextResponse.json({ id });
}
