import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { reports } from "@/db/schema";
import { getSessionUser } from "@/lib/auth/session";
import { reportCreateSchema } from "@/lib/validators";
import { id as makeId } from "@/lib/utils/slug";
import { ipRateLimit } from "@/lib/security/rate-limit";


export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "UNAUTHENTICATED" }, { status: 401 });
  const rl = await ipRateLimit(req, "report", 10, 60 * 60 * 24);
  if (!rl.ok) return NextResponse.json({ message: "한도 초과" }, { status: 429 });
  const parsed = reportCreateSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ message: "bad" }, { status: 400 });
  const db = getDb();
  await db.insert(reports).values({
    id: makeId(),
    reporterId: user.id,
    ...parsed.data,
  });
  return NextResponse.json({ ok: true });
}
