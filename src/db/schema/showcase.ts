import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, index, uniqueIndex } from "drizzle-orm/sqlite-core";
import { users } from "./auth";

export const showcaseProducts = sqliteTable(
  "showcase_products",
  {
    id: text("id").primaryKey(),
    makerId: text("maker_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    tagline: text("tagline").notNull(),
    description: text("description").notNull(),

    category: text("category").notNull(),
    tags: text("tags", { mode: "json" }).$type<string[]>().default([]),
    logoUrl: text("logo_url"),
    coverUrl: text("cover_url"),
    screenshots: text("screenshots", { mode: "json" }).$type<string[]>().default([]),
    videoUrl: text("video_url"),

    websiteUrl: text("website_url").notNull(),
    githubUrl: text("github_url"),
    appStoreUrl: text("app_store_url"),
    playStoreUrl: text("play_store_url"),

    pricingModel: text("pricing_model", {
      enum: ["free", "freemium", "paid", "open_source"],
    }),
    pricingDetails: text("pricing_details"),

    techStack: text("tech_stack", { mode: "json" }).$type<string[]>().default([]),
    buildStory: text("build_story"),

    targetUser: text("target_user"),
    problemStatement: text("problem_statement"),
    solutionStatement: text("solution_statement"),

    mrrVisible: integer("mrr_visible", { mode: "boolean" }).notNull().default(false),
    mrrUsd: integer("mrr_usd"),

    status: text("status", { enum: ["draft", "scheduled", "launched", "archived"] })
      .notNull()
      .default("draft"),
    launchWeek: text("launch_week"),
    launchedAt: integer("launched_at", { mode: "timestamp" }),

    upvoteCount: integer("upvote_count").notNull().default(0),
    commentCount: integer("comment_count").notNull().default(0),
    viewCount: integer("view_count").notNull().default(0),
    clickCount: integer("click_count").notNull().default(0),

    isFeatured: integer("is_featured", { mode: "boolean" }).notNull().default(false),

    metadata: text("metadata", { mode: "json" }).$type<Record<string, unknown>>().default({}),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => ({
    makerIdx: index("showcase_maker_idx").on(t.makerId),
    statusIdx: index("showcase_status_idx").on(t.status),
    launchIdx: index("showcase_launch_idx").on(t.launchWeek),
    slugIdx: uniqueIndex("showcase_slug_idx").on(t.slug),
  }),
);

export const showcaseUpvotes = sqliteTable(
  "showcase_upvotes",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    productId: text("product_id")
      .notNull()
      .references(() => showcaseProducts.id, { onDelete: "cascade" }),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => ({
    pk: uniqueIndex("showcase_upvotes_pk").on(t.userId, t.productId),
  }),
);

export const showcaseComments = sqliteTable(
  "showcase_comments",
  {
    id: text("id").primaryKey(),
    productId: text("product_id")
      .notNull()
      .references(() => showcaseProducts.id, { onDelete: "cascade" }),
    authorId: text("author_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    parentId: text("parent_id"),
    content: text("content").notNull(),
    isMakerReply: integer("is_maker_reply", { mode: "boolean" }).notNull().default(false),
    isDeleted: integer("is_deleted", { mode: "boolean" }).notNull().default(false),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => ({
    productIdx: index("sc_product_idx").on(t.productId),
  }),
);

export const prompts = sqliteTable(
  "prompts",
  {
    id: text("id").primaryKey(),
    authorId: text("author_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description").notNull(),
    content: text("content").notNull(),
    category: text("category").notNull(),
    tags: text("tags", { mode: "json" }).$type<string[]>().default([]),
    targetModel: text("target_model").notNull(),
    useCase: text("use_case"),
    exampleInput: text("example_input"),
    exampleOutput: text("example_output"),

    forkCount: integer("fork_count").notNull().default(0),
    favoriteCount: integer("favorite_count").notNull().default(0),
    viewCount: integer("view_count").notNull().default(0),
    ratingSum: integer("rating_sum").notNull().default(0),
    ratingCount: integer("rating_count").notNull().default(0),

    forkedFrom: text("forked_from"),
    isPublic: integer("is_public", { mode: "boolean" }).notNull().default(true),

    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => ({
    authorIdx: index("prompts_author_idx").on(t.authorId),
    categoryIdx: index("prompts_category_idx").on(t.category),
    favoritesIdx: index("prompts_favorites_idx").on(t.favoriteCount),
  }),
);

export const promptFavorites = sqliteTable(
  "prompt_favorites",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    promptId: text("prompt_id")
      .notNull()
      .references(() => prompts.id, { onDelete: "cascade" }),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => ({
    pk: uniqueIndex("prompt_favorites_pk").on(t.userId, t.promptId),
  }),
);
