import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { prompts } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { getSessionUser, requireVerifiedTeacher } from "@/lib/auth/session";
import { id as makeId } from "@/lib/utils/slug";

export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "UNAUTHENTICATED" }, { status: 401 });
  try {
    await requireVerifiedTeacher();
  } catch {
    return NextResponse.json({ message: "교원 인증이 필요합니다" }, { status: 403 });
  }
  const { id } = await ctx.params;
  const db = getDb();
  const [orig] = await db.select().from(prompts).where(eq(prompts.id, id)).limit(1);
  if (!orig) return NextResponse.json({ message: "not found" }, { status: 404 });

  const nid = makeId();
  await db.insert(prompts).values({
    id: nid,
    authorId: user.id,
    title: `${orig.title} (포크)`,
    description: orig.description,
    content: orig.content,
    category: orig.category,
    tags: orig.tags,
    targetModel: orig.targetModel,
    useCase: orig.useCase,
    exampleInput: orig.exampleInput,
    exampleOutput: orig.exampleOutput,
    forkedFrom: orig.id,
    isPublic: true,
  });
  await db
    .update(prompts)
    .set({ forkCount: sql`${prompts.forkCount} + 1` })
    .where(eq(prompts.id, id));
  return NextResponse.json({ id: nid });
}
