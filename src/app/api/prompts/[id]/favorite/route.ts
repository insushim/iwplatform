import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { promptFavorites, prompts } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth/session";

export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "UNAUTHENTICATED" }, { status: 401 });
  const { id } = await ctx.params;
  const db = getDb();
  const [existing] = await db
    .select()
    .from(promptFavorites)
    .where(and(eq(promptFavorites.userId, user.id), eq(promptFavorites.promptId, id)))
    .limit(1);
  if (existing) {
    await db
      .delete(promptFavorites)
      .where(
        and(eq(promptFavorites.userId, user.id), eq(promptFavorites.promptId, id)),
      );
    await db
      .update(prompts)
      .set({ favoriteCount: sql`max(${prompts.favoriteCount} - 1, 0)` })
      .where(eq(prompts.id, id));
    return NextResponse.json({ favorited: false });
  }
  await db.insert(promptFavorites).values({ userId: user.id, promptId: id });
  await db
    .update(prompts)
    .set({ favoriteCount: sql`${prompts.favoriteCount} + 1` })
    .where(eq(prompts.id, id));
  return NextResponse.json({ favorited: true });
}
