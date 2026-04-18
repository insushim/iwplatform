import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth/session";
import { profileUpdateSchema } from "@/lib/validators";


export async function PATCH(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "UNAUTHENTICATED" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const parsed = profileUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "잘못된 요청" }, { status: 400 });
  }
  const db = getDb();
  await db.update(profiles).set(parsed.data).where(eq(profiles.userId, user.id));
  return NextResponse.json({ ok: true });
}
