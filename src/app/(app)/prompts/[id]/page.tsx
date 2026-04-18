import { notFound } from "next/navigation";
import Link from "next/link";
import { getDb } from "@/db";
import { prompts, profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/common/copy-button";
import {
  PromptFavoriteButton,
  PromptForkButton,
} from "@/components/prompts/favorite-fork-buttons";

export default async function PromptDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const db = getDb();
  const rows = await db
    .select({ p: prompts, a: profiles })
    .from(prompts)
    .leftJoin(profiles, eq(profiles.userId, prompts.authorId))
    .where(eq(prompts.id, id))
    .limit(1)
    .catch(() => []);
  const row = rows[0];
  if (!row) notFound();
  const { p, a } = row;

  return (
    <div className="container-reading py-8">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline">{p.targetModel}</Badge>
        <Badge variant="outline">{p.category}</Badge>
        {(p.tags ?? []).map((t) => (
          <Badge key={t} variant="secondary" className="text-xs">
            #{t}
          </Badge>
        ))}
      </div>
      <h1 className="mt-3 text-3xl font-bold tracking-tight">{p.title}</h1>
      <p className="mt-2 text-muted-foreground">{p.description}</p>
      {p.useCase ? (
        <p className="mt-1 text-sm text-muted-foreground">
          사용 맥락: <span className="text-foreground">{p.useCase}</span>
        </p>
      ) : null}
      {a?.username ? (
        <p className="mt-3 text-sm">
          by{" "}
          <Link href={`/u/${a.username}`} className="text-primary hover:underline">
            @{a.username}
          </Link>
        </p>
      ) : null}

      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            프롬프트
          </h2>
          <CopyButton text={p.content} label="복사" />
        </div>
        <pre className="mt-2 overflow-x-auto rounded-xl border bg-muted/40 p-4 text-sm leading-relaxed">
          {p.content}
        </pre>
      </section>

      {p.exampleInput || p.exampleOutput ? (
        <section className="mt-8 grid gap-4 md:grid-cols-2">
          {p.exampleInput ? (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                예시 입력
              </h3>
              <pre className="mt-2 overflow-x-auto rounded-xl border bg-card p-4 text-sm">
                {p.exampleInput}
              </pre>
            </div>
          ) : null}
          {p.exampleOutput ? (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                예시 출력
              </h3>
              <pre className="mt-2 overflow-x-auto rounded-xl border bg-card p-4 text-sm">
                {p.exampleOutput}
              </pre>
            </div>
          ) : null}
        </section>
      ) : null}

      <div className="mt-8 flex gap-2">
        <PromptFavoriteButton promptId={p.id} initialCount={p.favoriteCount} />
        <PromptForkButton promptId={p.id} />
      </div>
    </div>
  );
}
