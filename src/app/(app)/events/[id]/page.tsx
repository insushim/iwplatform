import { notFound } from "next/navigation";
import { getDb } from "@/db";
import { events, profiles, eventAttendees } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users } from "lucide-react";
import { formatDateTime } from "@/lib/utils/date";
import { getSessionUser } from "@/lib/auth/session";
import { RSVPButton } from "./rsvp-button";

export default async function EventDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const db = getDb();
  const rows = await db
    .select({ e: events, o: profiles })
    .from(events)
    .leftJoin(profiles, eq(profiles.userId, events.organizerId))
    .where(eq(events.id, id))
    .limit(1)
    .catch(() => []);
  const row = rows[0];
  if (!row) notFound();
  const { e, o } = row;

  const user = await getSessionUser();
  const registered = user
    ? Boolean(
        (
          await db
            .select({ s: eventAttendees.status })
            .from(eventAttendees)
            .where(and(eq(eventAttendees.eventId, e.id), eq(eventAttendees.userId, user.id)))
            .limit(1)
            .catch(() => [])
        )[0],
      )
    : false;

  return (
    <div className="container-page py-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <article>
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="outline">{e.eventType}</Badge>
            <Badge variant="outline">{e.locationType}</Badge>
            {e.priceKrw === 0 ? (
              <Badge variant="secondary">무료</Badge>
            ) : (
              <Badge variant="secondary">₩{e.priceKrw.toLocaleString("ko-KR")}</Badge>
            )}
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            {e.title}
          </h1>

          <div className="mt-6 space-y-3 rounded-xl border bg-muted/30 p-5">
            <Info icon={<Calendar className="size-4" />} label="일시" value={`${formatDateTime(e.startAt)} ~ ${formatDateTime(e.endAt)}`} />
            {e.locationDetails ? (
              <Info icon={<MapPin className="size-4" />} label="장소" value={e.locationDetails} />
            ) : null}
            <Info icon={<Users className="size-4" />} label="참가" value={`${e.attendeeCount}명${e.maxAttendees ? ` / ${e.maxAttendees}` : ""}`} />
          </div>

          <div className="prose-kor mt-8 whitespace-pre-wrap text-[15px] leading-relaxed">
            {e.description}
          </div>
        </article>

        <aside className="space-y-5">
          <div className="rounded-2xl border bg-card p-5">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              참가하기
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums">
              {e.attendeeCount}명 참가 중
            </p>
            {user ? (
              <RSVPButton eventId={e.id} initialRegistered={registered} />
            ) : (
              <Button asChild className="mt-3 w-full">
                <a href={`/login?redirect=/events/${e.id}`}>로그인 후 참가</a>
              </Button>
            )}
          </div>
          {o ? (
            <div className="rounded-2xl border bg-card p-5">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                주최자
              </p>
              <a
                href={o.username ? `/u/${o.username}` : "#"}
                className="mt-3 block font-semibold hover:text-primary"
              >
                {o.displayName}
              </a>
              {o.username ? (
                <p className="text-xs text-muted-foreground">@{o.username}</p>
              ) : null}
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}

function Info({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <span className="mt-0.5 text-muted-foreground">{icon}</span>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}
