import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/lib/utils/text";

interface User {
  userId: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  teacherStatus: string;
  karma: number;
}

export function UserList({ users }: { users: User[] }) {
  if (users.length === 0) {
    return (
      <p className="rounded-xl border bg-card p-12 text-center text-muted-foreground">
        아직 없습니다.
      </p>
    );
  }
  return (
    <ul className="space-y-2">
      {users.map((u) => (
        <li key={u.userId}>
          <Link href={`/u/${u.username}`}>
            <div className="flex items-center gap-3 rounded-xl border bg-card p-3 transition hover:border-primary/40">
              <Avatar className="size-10">
                {u.avatarUrl ? <AvatarImage src={u.avatarUrl} alt={u.displayName} /> : null}
                <AvatarFallback>{u.displayName[0]}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">
                  {u.displayName}
                  {u.teacherStatus === "verified" ? (
                    <Badge variant="outline" className="ml-1 text-[9px]">
                      ✓
                    </Badge>
                  ) : null}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  @{u.username}
                  {u.bio ? ` · ${u.bio}` : ""}
                </p>
              </div>
              <span className="text-sm font-bold tabular-nums text-muted-foreground">
                {formatNumber(u.karma)}
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
