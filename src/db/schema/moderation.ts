import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { users } from "./auth";

export const reports = sqliteTable(
  "reports",
  {
    id: text("id").primaryKey(),
    reporterId: text("reporter_id").references(() => users.id, { onDelete: "set null" }),
    targetType: text("target_type", {
      enum: ["post", "comment", "user", "product", "message"],
    }).notNull(),
    targetId: text("target_id").notNull(),
    reason: text("reason", {
      enum: ["spam", "abuse", "inappropriate", "misinformation", "copyright", "other"],
    }).notNull(),
    details: text("details"),
    status: text("status", { enum: ["pending", "reviewing", "resolved", "dismissed"] })
      .notNull()
      .default("pending"),
    reviewedBy: text("reviewed_by").references(() => users.id),
    reviewedAt: integer("reviewed_at", { mode: "timestamp" }),
    actionTaken: text("action_taken"),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => ({
    statusIdx: index("reports_status_idx").on(t.status, t.createdAt),
  }),
);

export const badges = sqliteTable("badges", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  iconUrl: text("icon_url").notNull(),
  rarity: text("rarity", { enum: ["common", "rare", "epic", "legendary"] }).notNull(),
  points: integer("points").notNull().default(0),
  criteria: text("criteria", { mode: "json" }).$type<Record<string, unknown>>().notNull(),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const userBadges = sqliteTable(
  "user_badges",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    badgeId: integer("badge_id")
      .notNull()
      .references(() => badges.id, { onDelete: "cascade" }),
    earnedAt: integer("earned_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => ({
    pk: index("user_badges_pk").on(t.userId, t.badgeId),
  }),
);

export const karmaHistory = sqliteTable(
  "karma_history",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    action: text("action").notNull(),
    delta: integer("delta").notNull(),
    sourceType: text("source_type"),
    sourceId: text("source_id"),
    balanceAfter: integer("balance_after").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => ({
    userIdx: index("karma_user_idx").on(t.userId, t.createdAt),
  }),
);

export const auditLogs = sqliteTable(
  "audit_logs",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    actorId: text("actor_id").references(() => users.id),
    action: text("action").notNull(),
    targetType: text("target_type"),
    targetId: text("target_id"),
    changes: text("changes", { mode: "json" }).$type<Record<string, unknown>>(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => ({
    actorIdx: index("audit_actor_idx").on(t.actorId, t.createdAt),
    actionIdx: index("audit_action_idx").on(t.action, t.createdAt),
  }),
);

export const securityEvents = sqliteTable(
  "security_events",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    eventType: text("event_type").notNull(),
    userId: text("user_id").references(() => users.id),
    email: text("email"),
    ipAddress: text("ip_address").notNull(),
    userAgent: text("user_agent"),
    countryCode: text("country_code"),
    details: text("details", { mode: "json" }).$type<Record<string, unknown>>(),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => ({
    userIdx: index("security_user_idx").on(t.userId, t.createdAt),
    ipIdx: index("security_ip_idx").on(t.ipAddress, t.createdAt),
    typeIdx: index("security_type_idx").on(t.eventType, t.createdAt),
  }),
);

export const ipBlocklist = sqliteTable("ip_blocklist", {
  ipAddress: text("ip_address").primaryKey(),
  reason: text("reason").notNull(),
  blockedBy: text("blocked_by").references(() => users.id),
  expiresAt: integer("expires_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});
