import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, index, uniqueIndex } from "drizzle-orm/sqlite-core";
import { users } from "./auth";

/**
 * 프로필 — users 와 1:1. Better Auth 가 관리하는 users 테이블을 보강.
 * username, 교원 인증 상태, Trust Level, karma, 프라이버시 설정 등.
 */
export const profiles = sqliteTable(
  "profiles",
  {
    userId: text("user_id")
      .primaryKey()
      .references(() => users.id, { onDelete: "cascade" }),
    username: text("username").notNull().unique(),
    displayName: text("display_name").notNull(),
    avatarUrl: text("avatar_url"),
    coverUrl: text("cover_url"),
    bio: text("bio"),

    role: text("role", { enum: ["user", "moderator", "admin", "super_admin"] })
      .notNull()
      .default("user"),

    trustLevel: text("trust_level", {
      enum: ["new", "basic", "member", "veteran", "leader"],
    })
      .notNull()
      .default("new"),

    teacherStatus: text("teacher_status", {
      enum: ["unverified", "pending", "verified", "rejected", "expired"],
    })
      .notNull()
      .default("unverified"),
    teacherLevel: text("teacher_level", {
      enum: ["elementary", "middle", "high", "special", "preschool", "other"],
    }),
    schoolName: text("school_name"),
    schoolRegion: text("school_region"),
    subject: text("subject"),
    yearsOfTeaching: integer("years_of_teaching"),
    techStack: text("tech_stack", { mode: "json" }).$type<string[]>().default([]),
    websiteUrl: text("website_url"),
    githubUrl: text("github_url"),
    linkedinUrl: text("linkedin_url"),

    karma: integer("karma").notNull().default(0),
    postCount: integer("post_count").notNull().default(0),
    commentCount: integer("comment_count").notNull().default(0),
    followersCount: integer("followers_count").notNull().default(0),
    followingCount: integer("following_count").notNull().default(0),

    isMaker: integer("is_maker", { mode: "boolean" }).notNull().default(false),
    isSuspended: integer("is_suspended", { mode: "boolean" }).notNull().default(false),
    suspendedUntil: integer("suspended_until", { mode: "timestamp" }),
    suspendedReason: text("suspended_reason"),

    lastLoginAt: integer("last_login_at", { mode: "timestamp" }),
    lastActiveAt: integer("last_active_at", { mode: "timestamp" }).default(sql`(unixepoch())`),

    phoneVerified: integer("phone_verified", { mode: "boolean" }).notNull().default(false),
    totpEnabled: integer("totp_enabled", { mode: "boolean" }).notNull().default(false),

    notificationPrefs: text("notification_prefs", { mode: "json" })
      .$type<{
        emailMentions: boolean;
        emailReplies: boolean;
        emailDm: boolean;
        emailDigest: boolean;
        pushMentions: boolean;
        pushReplies: boolean;
        pushDm: boolean;
      }>()
      .default({
        emailMentions: true,
        emailReplies: true,
        emailDm: true,
        emailDigest: true,
        pushMentions: true,
        pushReplies: true,
        pushDm: true,
      }),
    privacyPrefs: text("privacy_prefs", { mode: "json" })
      .$type<{
        profilePublic: boolean;
        showSchool: boolean;
        showEmail: boolean;
        allowDmFrom: "verified" | "all" | "none";
      }>()
      .default({
        profilePublic: true,
        showSchool: false,
        showEmail: false,
        allowDmFrom: "verified",
      }),

    deletedAt: integer("deleted_at", { mode: "timestamp" }),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => ({
    usernameIdx: uniqueIndex("profiles_username_idx").on(t.username),
    karmaIdx: index("profiles_karma_idx").on(t.karma),
    trustIdx: index("profiles_trust_idx").on(t.trustLevel),
    teacherStatusIdx: index("profiles_teacher_status_idx").on(t.teacherStatus),
  }),
);

export const teacherVerifications = sqliteTable(
  "teacher_verifications",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    method: text("method", { enum: ["document", "school_email", "official_cert"] }).notNull(),

    documentType: text("document_type"),
    documentUrl: text("document_url"),
    documentHash: text("document_hash"),
    schoolName: text("school_name"),
    teacherLevel: text("teacher_level"),

    schoolEmail: text("school_email"),
    schoolEmailVerifiedAt: integer("school_email_verified_at", { mode: "timestamp" }),

    status: text("status", {
      enum: ["unverified", "pending", "verified", "rejected", "expired"],
    })
      .notNull()
      .default("pending"),
    reviewedBy: text("reviewed_by").references(() => users.id),
    reviewedAt: integer("reviewed_at", { mode: "timestamp" }),
    reviewNotes: text("review_notes"),
    rejectionReason: text("rejection_reason"),

    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),

    expiresAt: integer("expires_at", { mode: "timestamp" }),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => ({
    userIdx: index("tv_user_idx").on(t.userId),
    statusIdx: index("tv_status_idx").on(t.status),
  }),
);

export const follows = sqliteTable(
  "follows",
  {
    followerId: text("follower_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    followingId: text("following_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => ({
    pk: uniqueIndex("follows_pk").on(t.followerId, t.followingId),
    followingIdx: index("follows_following_idx").on(t.followingId),
  }),
);
