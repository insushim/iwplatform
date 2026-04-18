import { notFound } from "next/navigation";
import Link from "next/link";
import { getDb } from "@/db";
import { showcaseProducts, profiles, showcaseComments } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ExternalLink, Code2 as Github } from "lucide-react";
import { ShowcaseUpvoteButton } from "@/components/showcase/upvote-button";
import { ShowcaseComments } from "@/components/showcase/comment-section";
import { getSessionProfile } from "@/lib/auth/session";

export default async function ShowcaseDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const db = getDb();
  const rows = await db
    .select({ p: showcaseProducts, m: profiles })
    .from(showcaseProducts)
    .leftJoin(profiles, eq(profiles.userId, showcaseProducts.makerId))
    .where(eq(showcaseProducts.slug, slug))
    .limit(1)
    .catch(() => []);
  const row = rows[0];
  if (!row) notFound();
  const { p, m } = row;
  const screenshots = (p.screenshots ?? []) as string[];

  const [cmts, session] = await Promise.all([
    db
      .select({ c: showcaseComments, a: profiles })
      .from(showcaseComments)
      .leftJoin(profiles, eq(profiles.userId, showcaseComments.authorId))
      .where(eq(showcaseComments.productId, p.id))
      .orderBy(asc(showcaseComments.createdAt))
      .catch(() => []),
    getSessionProfile().catch(() => null),
  ]);
  const canComment = session?.profile?.teacherStatus === "verified";

  return (
    <div className="container-page py-8">
      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <article>
          <div className="flex items-start gap-4">
            {p.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.logoUrl} alt={p.name} className="size-16 rounded-xl border" />
            ) : (
              <div className="flex size-16 items-center justify-center rounded-xl border bg-muted text-3xl">
                🛠️
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-3xl font-bold tracking-tight">{p.name}</h1>
              <p className="mt-1 text-muted-foreground">{p.tagline}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {(p.tags ?? []).slice(0, 6).map((t) => (
                  <Badge key={t} variant="outline">
                    {t}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {screenshots.length > 0 ? (
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {screenshots.map((s, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={s}
                  alt={`${p.name} screenshot ${i + 1}`}
                  className="aspect-video w-full rounded-xl border object-cover"
                />
              ))}
            </div>
          ) : null}

          <section className="mt-10">
            <h2 className="text-xl font-bold">소개</h2>
            <p className="prose-kor mt-3 whitespace-pre-wrap text-[15px] leading-relaxed">
              {p.description}
            </p>
          </section>

          {p.buildStory ? (
            <section className="mt-10">
              <h2 className="text-xl font-bold">빌드 스토리</h2>
              <p className="prose-kor mt-3 whitespace-pre-wrap text-[15px] leading-relaxed">
                {p.buildStory}
              </p>
            </section>
          ) : null}

          <ShowcaseComments
            productId={p.id}
            canComment={canComment}
            initial={cmts.map(({ c, a }) => ({
              id: c.id,
              content: c.content,
              createdAt: c.createdAt,
              isMakerReply: c.isMakerReply,
              authorName: a?.displayName ?? "익명",
              authorUsername: a?.username ?? null,
              authorAvatar: a?.avatarUrl ?? null,
            }))}
          />
        </article>

        <aside className="space-y-5">
          <div className="rounded-2xl border bg-card p-5">
            <ShowcaseUpvoteButton productId={p.id} initialCount={p.upvoteCount} />
            <div className="mt-4 flex flex-col gap-2">
              {p.websiteUrl ? (
                <a
                  href={p.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  <ExternalLink className="size-4" /> 웹사이트
                </a>
              ) : null}
              {p.githubUrl ? (
                <a
                  href={p.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <Github className="size-4" /> GitHub
                </a>
              ) : null}
            </div>
          </div>

          {m ? (
            <div className="rounded-2xl border bg-card p-5">
              <h3 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                메이커
              </h3>
              <Link
                href={`/u/${m.username}`}
                className="mt-3 flex items-center gap-3"
              >
                <Avatar>
                  {m.avatarUrl ? <AvatarImage src={m.avatarUrl} alt={m.displayName} /> : null}
                  <AvatarFallback>{m.displayName[0]}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate font-semibold">{m.displayName}</p>
                  {m.username ? (
                    <p className="text-xs text-muted-foreground">@{m.username}</p>
                  ) : null}
                </div>
              </Link>
            </div>
          ) : null}

          <div className="rounded-2xl border bg-card p-5">
            <h3 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Tech Stack
            </h3>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {(p.techStack ?? []).map((t) => (
                <Badge key={t} variant="secondary">
                  {t}
                </Badge>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
