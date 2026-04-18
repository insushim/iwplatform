import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { showcaseProducts, showcaseUpvotes } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth/session";


export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "UNAUTHENTICATED" }, { status: 401 });
  const { id } = await ctx.params;
  const db = getDb();
  const [existing] = await db
    .select()
    .from(showcaseUpvotes)
    .where(and(eq(showcaseUpvotes.userId, user.id), eq(showcaseUpvotes.productId, id)))
    .limit(1);
  if (existing) {
    await db
      .delete(showcaseUpvotes)
      .where(and(eq(showcaseUpvotes.userId, user.id), eq(showcaseUpvotes.productId, id)));
    await db
      .update(showcaseProducts)
      .set({ upvoteCount: sql`${showcaseProducts.upvoteCount} - 1` })
      .where(eq(showcaseProducts.id, id));
    return NextResponse.json({ upvoted: false });
  }
  await db.insert(showcaseUpvotes).values({ userId: user.id, productId: id });
  await db
    .update(showcaseProducts)
    .set({ upvoteCount: sql`${showcaseProducts.upvoteCount} + 1` })
    .where(eq(showcaseProducts.id, id));
  return NextResponse.json({ upvoted: true });
}
