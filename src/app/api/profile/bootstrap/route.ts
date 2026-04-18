import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth/session";
import { usernameSchema } from "@/lib/validators";
import { logAudit } from "@/lib/security/audit";
import { sendEmail } from "@/lib/email/client";
import { welcomeEmail } from "@/lib/email/templates";


const schema = z.object({
  username: usernameSchema,
  displayName: z.string().min(1).max(50),
});

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "UNAUTHENTICATED" }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ message: "잘못된 요청" }, { status: 400 });
  }

  const db = getDb();
  const existing = await db.select().from(profiles).where(eq(profiles.userId, user.id)).limit(1);
  if (existing[0]) {
    return NextResponse.json({ ok: true, already: true });
  }

  const dupUsername = await db
    .select({ u: profiles.username })
    .from(profiles)
    .where(eq(profiles.username, parsed.data.username))
    .limit(1);
  if (dupUsername[0]) {
    return NextResponse.json(
      { message: "이미 사용 중인 아이디입니다" },
      { status: 409 },
    );
  }

  await db.insert(profiles).values({
    userId: user.id,
    username: parsed.data.username,
    displayName: parsed.data.displayName,
  });

  await logAudit({
    actorId: user.id,
    action: "profile.created",
    targetType: "profile",
    targetId: user.id,
  });

  const tpl = welcomeEmail(parsed.data.displayName);
  void sendEmail({ to: user.email, subject: tpl.subject, html: tpl.html });

  return NextResponse.json({ ok: true });
}
