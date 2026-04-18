import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { events } from "@/db/schema";
import { getSessionUser, requireVerifiedTeacher } from "@/lib/auth/session";
import { id as makeId } from "@/lib/utils/slug";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().min(10).max(10_000),
  eventType: z.enum(["webinar", "workshop", "meetup", "ama", "other"]),
  locationType: z.enum(["online", "offline", "hybrid"]),
  locationDetails: z.string().max(300).optional(),
  meetingUrl: z.string().url().optional(),
  startAt: z.string().datetime(),
  endAt: z.string().datetime(),
  maxAttendees: z.number().int().min(1).optional(),
  priceKrw: z.number().int().min(0).default(0),
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
  if (!parsed.success)
    return NextResponse.json({ message: "bad", issues: parsed.error.format() }, { status: 400 });

  const db = getDb();
  const id = makeId();
  await db.insert(events).values({
    id,
    organizerId: user.id,
    title: parsed.data.title,
    description: parsed.data.description,
    eventType: parsed.data.eventType,
    locationType: parsed.data.locationType,
    locationDetails: parsed.data.locationDetails,
    meetingUrl: parsed.data.meetingUrl,
    startAt: new Date(parsed.data.startAt),
    endAt: new Date(parsed.data.endAt),
    maxAttendees: parsed.data.maxAttendees,
    priceKrw: parsed.data.priceKrw,
  });
  return NextResponse.json({ id });
}
