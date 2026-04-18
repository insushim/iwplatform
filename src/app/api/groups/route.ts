import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { groups, groupMembers } from "@/db/schema";
import { getSessionUser, requireVerifiedTeacher } from "@/lib/auth/session";
import { makeSlug, id as makeId } from "@/lib/utils/slug";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().min(10).max(1000),
  category: z.string().max(40).optional(),
  isPrivate: z.boolean().default(false),
  requiresApproval: z.boolean().default(true),
});

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "UNAUTHENTICATED" }, { status: 401 });
  try {
    await requireVerifiedTeacher();
  } catch {
    return NextResponse.json({ message: "교원 인증이 필요합니다" }, { status: 403 });
  }
  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ message: "bad" }, { status: 400 });

  const db = getDb();
  const gid = makeId();
  const slug = makeSlug(parsed.data.name);

  await db.insert(groups).values({
    id: gid,
    slug,
    name: parsed.data.name,
    description: parsed.data.description,
    category: parsed.data.category,
    ownerId: user.id,
    isPrivate: parsed.data.isPrivate,
    requiresApproval: parsed.data.requiresApproval,
    memberCount: 1,
  });
  await db.insert(groupMembers).values({
    groupId: gid,
    userId: user.id,
    role: "owner",
    status: "active",
  });
  return NextResponse.json({ id: gid, slug });
}
