import type { Metadata } from "next";
import Link from "next/link";
import { getDb } from "@/db";
import { profiles } from "@/db/schema";
import { and, desc, eq, gt } from "drizzle-orm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TRUST_LEVELS } from "@/lib/constants";
import { formatNumber } from "@/lib/utils/text";
import { Trophy } from "lucide-react";

export const metadata: Metadata = { title: "리더보드" };

async function top(kind: "karma" | "posts" | "comments") {
  try {
    const db = getDb();
    const col =
      kind === "karma"
        ? profiles.karma
        : kind === "posts"
          ? profiles.postCount
          : profiles.commentCount;
    return await db
      .select({
        userId: profiles.userId,
        username: profiles.username,
        displayName: profiles.displayName,
        avatarUrl: profiles.avatarUrl,
        karma: profiles.karma,
        postCount: profiles.postCount,
        commentCount: profiles.commentCount,
        trustLevel: profiles.trustLevel,
        teacherStatus: profiles.teacherStatus,
      })
      .from(profiles)
      .where(and(gt(col, 0), eq(profiles.isSuspended, false)))
      .orderBy(desc(col))
      .limit(50);
  } catch {
    return [];
  }
}

export default async function LeaderboardPage() {
  const [karma, postsTop, commentsTop] = await Promise.all([
    top("karma"),
    top("posts"),
    top("comments"),
  ]);

  return (
    <div className="container-reading py-8">
      <header className="mb-6 flex items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground">
          <Trophy className="size-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">리더보드</h1>
          <p className="text-sm text-muted-foreground">
            이번 시즌 가장 열심히 나눈 선생님들
          </p>
        </div>
      </header>

      <Tabs defaultValue="karma">
        <TabsList>
          <TabsTrigger value="karma">Karma</TabsTrigger>
          <TabsTrigger value="posts">글</TabsTrigger>
          <TabsTrigger value="comments">댓글</TabsTrigger>
        </TabsList>
        <TabsContent value="karma">
          <RankingList rows={karma} metric="karma" />
        </TabsContent>
        <TabsContent value="posts">
          <RankingList rows={postsTop} metric="postCount" />
        </TabsContent>
        <TabsContent value="comments">
          <RankingList rows={commentsTop} metric="commentCount" />
        </TabsContent>
      </Tabs>
    </div>
  );
}

type Row = {
  userId: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  karma: number;
  postCount: number;
  commentCount: number;
  trustLevel: keyof typeof TRUST_LEVELS;
  teacherStatus: string;
};

function RankingList({ rows, metric }: { rows: Row[]; metric: "karma" | "postCount" | "commentCount" }) {
  if (rows.length === 0) {
    return (
      <div className="mt-4 rounded-xl border bg-card p-12 text-center text-muted-foreground">
        아직 순위가 없어요.
      </div>
    );
  }
  return (
    <ol className="mt-4 space-y-2">
      {rows.map((r, idx) => {
        const trust = TRUST_LEVELS[r.trustLevel];
        return (
          <li key={r.userId}>
            <Link
              href={`/u/${r.username}`}
              className="flex items-center gap-3 rounded-xl border bg-card p-3 transition hover:border-primary/40"
            >
              <span
                className={`inline-flex size-8 shrink-0 items-center justify-center rounded-full font-bold ${
                  idx === 0
                    ? "bg-[#FFD700] text-black"
                    : idx === 1
                      ? "bg-[#C0C0C0] text-black"
                      : idx === 2
                        ? "bg-[#CD7F32] text-white"
                        : "bg-muted text-muted-foreground"
                }`}
              >
                {idx + 1}
              </span>
              <Avatar className="size-10">
                {r.avatarUrl ? <AvatarImage src={r.avatarUrl} alt={r.displayName} /> : null}
                <AvatarFallback>{r.displayName[0]}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">
                  {r.displayName}
                  {r.teacherStatus === "verified" ? (
                    <Badge variant="outline" className="ml-1 text-[9px]">
                      ✓
                    </Badge>
                  ) : null}
                </p>
                <p className="truncate text-xs text-muted-foreground">@{r.username}</p>
              </div>
              <Badge variant="outline" style={{ borderColor: trust.color, color: trust.color }}>
                {trust.label}
              </Badge>
              <span className="text-lg font-bold tabular-nums">
                {formatNumber(r[metric])}
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
