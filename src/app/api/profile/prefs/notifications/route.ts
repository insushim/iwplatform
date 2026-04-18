import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth/session";
import { z } from "zod";

const schema = z.object({
  emailMentions: z.boolean(),
  emailReplies: z.boolean(),
  emailDm: z.boolean(),
  emailDigest: z.boolean(),
  pushMentions: z.boolean(),
  pushReplies: z.boolean(),
  pushDm: z.boolean(),
});

export async function PATCH(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "UNAUTHENTICATED" }, { status: 401 });
  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ message: "bad" }, { status: 400 });
  const db = getDb();
  await db
    .update(profiles)
    .set({ notificationPrefs: parsed.data })
    .where(eq(profiles.userId, user.id));
  return NextResponse.json({ ok: true });
}
