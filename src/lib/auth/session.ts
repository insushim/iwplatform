import "server-only";
import { headers } from "next/headers";
import { getAuth } from "./server";
import { getDb } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  image: string | null;
  emailVerified: boolean;
};

export type ProfileSummary = {
  userId: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  role: "user" | "moderator" | "admin" | "super_admin";
  trustLevel: "new" | "basic" | "member" | "veteran" | "leader";
  teacherStatus: "unverified" | "pending" | "verified" | "rejected" | "expired";
  karma: number;
  isMaker: boolean;
  isSuspended: boolean;
};

export async function getSessionUser(): Promise<SessionUser | null> {
  try {
    const auth = getAuth();
    const h = await headers();
    const session = await auth.api.getSession({ headers: h });
    if (!session?.user) return null;
    const u = session.user;
    return {
      id: u.id,
      email: u.email,
      name: u.name ?? "",
      image: u.image ?? null,
      emailVerified: Boolean(u.emailVerified),
    };
  } catch {
    return null;
  }
}

export async function getSessionProfile(): Promise<
  { user: SessionUser; profile: ProfileSummary } | null
> {
  const user = await getSessionUser();
  if (!user) return null;
  const db = getDb();
  const rows = await db
    .select({
      userId: profiles.userId,
      username: profiles.username,
      displayName: profiles.displayName,
      avatarUrl: profiles.avatarUrl,
      role: profiles.role,
      trustLevel: profiles.trustLevel,
      teacherStatus: profiles.teacherStatus,
      karma: profiles.karma,
      isMaker: profiles.isMaker,
      isSuspended: profiles.isSuspended,
    })
    .from(profiles)
    .where(eq(profiles.userId, user.id))
    .limit(1);
  const profile = rows[0];
  if (!profile) return { user, profile: null as never };
  return { user, profile };
}

export async function requireAuth(): Promise<{ user: SessionUser; profile: ProfileSummary }> {
  const result = await getSessionProfile();
  if (!result) throw new Error("UNAUTHENTICATED");
  return result;
}

export async function requireRole(
  roles: ReadonlyArray<"moderator" | "admin" | "super_admin">,
) {
  const result = await requireAuth();
  if (!roles.includes(result.profile.role as "admin")) {
    throw new Error("FORBIDDEN");
  }
  return result;
}

export async function requireVerifiedTeacher() {
  const result = await requireAuth();
  if (result.profile.teacherStatus !== "verified") {
    throw new Error("TEACHER_VERIFICATION_REQUIRED");
  }
  return result;
}
