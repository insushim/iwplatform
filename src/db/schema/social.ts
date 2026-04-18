import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, index, uniqueIndex } from "drizzle-orm/sqlite-core";
import { users } from "./auth";

export const groups = sqliteTable(
  "groups",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    coverUrl: text("cover_url"),
    iconUrl: text("icon_url"),
    category: text("category"),
    ownerId: text("owner_id").references(() => users.id, { onDelete: "set null" }),
    isPrivate: integer("is_private", { mode: "boolean" }).notNull().default(false),
    requiresApproval: integer("requires_approval", { mode: "boolean" }).notNull().default(true),
    memberCount: integer("member_count").notNull().default(1),
    postCount: integer("post_count").notNull().default(0),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => ({
    slugIdx: uniqueIndex("groups_slug_idx").on(t.slug),
  }),
);

export const groupMembers = sqliteTable(
  "group_members",
  {
    groupId: text("group_id")
      .notNull()
      .references(() => groups.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: text("role", { enum: ["member", "moderator", "owner"] })
      .notNull()
      .default("member"),
    status: text("status", { enum: ["pending", "active", "banned"] })
      .notNull()
      .default("active"),
    joinedAt: integer("joined_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => ({
    pk: uniqueIndex("group_members_pk").on(t.groupId, t.userId),
  }),
);

export const events = sqliteTable(
  "events",
  {
    id: text("id").primaryKey(),
    organizerId: text("organizer_id")
      .notNull()
      .references(() => users.id),
    title: text("title").notNull(),
    description: text("description").notNull(),
    eventType: text("event_type", {
      enum: ["webinar", "workshop", "meetup", "ama", "other"],
    }).notNull(),
    coverUrl: text("cover_url"),
    startAt: integer("start_at", { mode: "timestamp" }).notNull(),
    endAt: integer("end_at", { mode: "timestamp" }).notNull(),
    timezone: text("timezone").notNull().default("Asia/Seoul"),
    locationType: text("location_type", {
      enum: ["online", "offline", "hybrid"],
    }).notNull(),
    locationDetails: text("location_details"),
    meetingUrl: text("meeting_url"),
    maxAttendees: integer("max_attendees"),
    isRecorded: integer("is_recorded", { mode: "boolean" }).notNull().default(false),
    recordingUrl: text("recording_url"),
    attendeeCount: integer("attendee_count").notNull().default(0),
    priceKrw: integer("price_krw").notNull().default(0),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => ({
    startIdx: index("events_start_idx").on(t.startAt),
  }),
);

export const eventAttendees = sqliteTable(
  "event_attendees",
  {
    eventId: text("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    status: text("status", { enum: ["registered", "attended", "cancelled"] })
      .notNull()
      .default("registered"),
    registeredAt: integer("registered_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => ({
    pk: uniqueIndex("event_attendees_pk").on(t.eventId, t.userId),
  }),
);

export const conversations = sqliteTable("conversations", {
  id: text("id").primaryKey(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  lastMessageAt: integer("last_message_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

export const conversationParticipants = sqliteTable(
  "conversation_participants",
  {
    conversationId: text("conversation_id")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    lastReadAt: integer("last_read_at", { mode: "timestamp" }),
    muted: integer("muted", { mode: "boolean" }).notNull().default(false),
  },
  (t) => ({
    pk: uniqueIndex("cp_pk").on(t.conversationId, t.userId),
  }),
);

export const messages = sqliteTable(
  "messages",
  {
    id: text("id").primaryKey(),
    conversationId: text("conversation_id")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    senderId: text("sender_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    attachmentUrl: text("attachment_url"),
    isDeleted: integer("is_deleted", { mode: "boolean" }).notNull().default(false),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => ({
    convIdx: index("messages_conv_idx").on(t.conversationId, t.createdAt),
  }),
);

export const notifications = sqliteTable(
  "notifications",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type", {
      enum: [
        "reply",
        "mention",
        "follow",
        "vote",
        "reaction",
        "dm",
        "badge",
        "launch",
        "system",
        "teacher_verified",
      ],
    }).notNull(),
    actorId: text("actor_id").references(() => users.id),
    targetType: text("target_type"),
    targetId: text("target_id"),
    title: text("title").notNull(),
    body: text("body"),
    link: text("link"),
    metadata: text("metadata", { mode: "json" }).$type<Record<string, unknown>>().default({}),
    isRead: integer("is_read", { mode: "boolean" }).notNull().default(false),
    readAt: integer("read_at", { mode: "timestamp" }),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => ({
    userIdx: index("notifications_user_idx").on(t.userId, t.createdAt),
    unreadIdx: index("notifications_unread_idx").on(t.userId, t.isRead),
  }),
);
