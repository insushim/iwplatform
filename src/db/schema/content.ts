import { sql } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  real,
  index,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { users } from "./auth";

export const categories = sqliteTable(
  "categories",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    description: text("description"),
    icon: text("icon"),
    color: text("color"),
    parentId: integer("parent_id"),
    displayOrder: integer("display_order").notNull().default(0),
    minTrustLevel: text("min_trust_level", {
      enum: ["new", "basic", "member", "veteran", "leader"],
    })
      .notNull()
      .default("new"),
    postCount: integer("post_count").notNull().default(0),
    isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => ({
    slugIdx: uniqueIndex("categories_slug_idx").on(t.slug),
  }),
);

export const tags = sqliteTable(
  "tags",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    description: text("description"),
    postCount: integer("post_count").notNull().default(0),
    isFeatured: integer("is_featured", { mode: "boolean" }).notNull().default(false),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => ({
    slugIdx: uniqueIndex("tags_slug_idx").on(t.slug),
    nameIdx: index("tags_name_idx").on(t.name),
  }),
);

export const posts = sqliteTable(
  "posts",
  {
    id: text("id").primaryKey(),
    authorId: text("author_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id),

    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    content: text("content").notNull(),
    contentText: text("content_text").notNull(),
    excerpt: text("excerpt"),
    coverImageUrl: text("cover_image_url"),

    status: text("status", { enum: ["draft", "published", "hidden", "deleted"] })
      .notNull()
      .default("published"),
    isAnonymous: integer("is_anonymous", { mode: "boolean" }).notNull().default(false),
    isPinned: integer("is_pinned", { mode: "boolean" }).notNull().default(false),
    isLocked: integer("is_locked", { mode: "boolean" }).notNull().default(false),
    isFeatured: integer("is_featured", { mode: "boolean" }).notNull().default(false),

    voteScore: integer("vote_score").notNull().default(0),
    upvoteCount: integer("upvote_count").notNull().default(0),
    downvoteCount: integer("downvote_count").notNull().default(0),
    viewCount: integer("view_count").notNull().default(0),
    commentCount: integer("comment_count").notNull().default(0),
    bookmarkCount: integer("bookmark_count").notNull().default(0),
    reactionCount: integer("reaction_count").notNull().default(0),
    hotScore: real("hot_score").notNull().default(0),

    metadata: text("metadata", { mode: "json" }).$type<Record<string, unknown>>().default({}),
    deletedAt: integer("deleted_at", { mode: "timestamp" }),
    publishedAt: integer("published_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => ({
    authorIdx: index("posts_author_idx").on(t.authorId),
    categoryIdx: index("posts_category_idx").on(t.categoryId),
    statusIdx: index("posts_status_idx").on(t.status),
    publishedIdx: index("posts_published_idx").on(t.publishedAt),
    hotIdx: index("posts_hot_idx").on(t.hotScore),
    scoreIdx: index("posts_score_idx").on(t.voteScore),
    slugIdx: uniqueIndex("posts_slug_idx").on(t.slug),
  }),
);

export const postTags = sqliteTable(
  "post_tags",
  {
    postId: text("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    tagId: integer("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: uniqueIndex("post_tags_pk").on(t.postId, t.tagId),
    tagIdx: index("post_tags_tag_idx").on(t.tagId),
  }),
);

export const comments = sqliteTable(
  "comments",
  {
    id: text("id").primaryKey(),
    postId: text("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    authorId: text("author_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    parentId: text("parent_id"),

    content: text("content").notNull(),
    isAnonymous: integer("is_anonymous", { mode: "boolean" }).notNull().default(false),

    voteScore: integer("vote_score").notNull().default(0),
    upvoteCount: integer("upvote_count").notNull().default(0),
    downvoteCount: integer("downvote_count").notNull().default(0),
    replyCount: integer("reply_count").notNull().default(0),
    depth: integer("depth").notNull().default(0),

    isDeleted: integer("is_deleted", { mode: "boolean" }).notNull().default(false),
    deletedAt: integer("deleted_at", { mode: "timestamp" }),

    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => ({
    postIdx: index("comments_post_idx").on(t.postId),
    authorIdx: index("comments_author_idx").on(t.authorId),
    parentIdx: index("comments_parent_idx").on(t.parentId),
  }),
);

export const votes = sqliteTable(
  "votes",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    targetType: text("target_type", { enum: ["post", "comment"] }).notNull(),
    targetId: text("target_id").notNull(),
    vote: text("vote", { enum: ["up", "down"] }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => ({
    uniqueUserTarget: uniqueIndex("votes_unique").on(t.userId, t.targetType, t.targetId),
    targetIdx: index("votes_target_idx").on(t.targetType, t.targetId),
  }),
);

export const reactions = sqliteTable(
  "reactions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    targetType: text("target_type", { enum: ["post", "comment"] }).notNull(),
    targetId: text("target_id").notNull(),
    reaction: text("reaction", {
      enum: ["like", "thanks", "insightful", "agree", "surprise"],
    }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => ({
    uniq: uniqueIndex("reactions_unique").on(t.userId, t.targetType, t.targetId, t.reaction),
    targetIdx: index("reactions_target_idx").on(t.targetType, t.targetId),
  }),
);

export const bookmarks = sqliteTable(
  "bookmarks",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    postId: text("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    folder: text("folder").notNull().default("default"),
    note: text("note"),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => ({
    uniq: uniqueIndex("bookmarks_unique").on(t.userId, t.postId),
    userIdx: index("bookmarks_user_idx").on(t.userId),
  }),
);
