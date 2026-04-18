"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LogOut, User, Settings, Bookmark, Bell, Shield } from "lucide-react";
import { authClient } from "@/lib/auth/client";
import { toast } from "sonner";

export function UserMenu({
  name,
  username,
  avatarUrl,
  role,
  teacherStatus,
}: {
  name: string;
  username: string;
  avatarUrl?: string | null;
  role: string;
  teacherStatus: string;
}) {
  const router = useRouter();
  const initial = name?.[0] ?? "E";

  async function handleSignOut() {
    await authClient.signOut();
    toast.success("로그아웃 되었습니다");
    router.push("/");
    router.refresh();
  }

  const isAdmin = role === "admin" || role === "super_admin" || role === "moderator";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            className="rounded-full outline-none ring-offset-background transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="사용자 메뉴"
          >
            <Avatar className="size-9">
              {avatarUrl ? <AvatarImage src={avatarUrl} alt={name} /> : null}
              <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                {initial}
              </AvatarFallback>
            </Avatar>
          </button>
        }
      />
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="flex flex-col gap-1">
          <span className="truncate text-sm font-semibold">{name}</span>
          {username ? (
            <span className="truncate text-xs text-muted-foreground">@{username}</span>
          ) : null}
          <div className="mt-1 flex gap-1.5">
            {teacherStatus === "verified" ? (
              <Badge variant="secondary" className="text-[10px]">
                ✓ 인증 교사
              </Badge>
            ) : teacherStatus === "pending" ? (
              <Badge variant="outline" className="text-[10px]">
                검토 중
              </Badge>
            ) : (
              <Badge variant="outline" className="text-[10px]">
                미인증
              </Badge>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          render={
            <Link href={username ? `/u/${username}` : "/settings/profile"}>
              <User className="size-4" />
              내 프로필
            </Link>
          }
        />
        <DropdownMenuItem
          render={
            <Link href="/notifications">
              <Bell className="size-4" />
              알림
            </Link>
          }
        />
        <DropdownMenuItem
          render={
            <Link href="/bookmarks">
              <Bookmark className="size-4" />
              북마크
            </Link>
          }
        />
        <DropdownMenuItem
          render={
            <Link href="/settings">
              <Settings className="size-4" />
              설정
            </Link>
          }
        />
        {isAdmin ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              render={
                <Link href="/admin">
                  <Shield className="size-4" />
                  관리자
                </Link>
              }
            />
          </>
        ) : null}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
          <LogOut className="size-4" />
          로그아웃
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
