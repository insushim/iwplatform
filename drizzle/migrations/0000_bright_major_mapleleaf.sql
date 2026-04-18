CREATE TABLE `accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`password` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `accounts_user_idx` ON `accounts` (`user_id`);--> statement-breakpoint
CREATE INDEX `accounts_provider_idx` ON `accounts` (`provider_id`,`account_id`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`token` text NOT NULL,
	`expires_at` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_token_unique` ON `sessions` (`token`);--> statement-breakpoint
CREATE INDEX `sessions_user_idx` ON `sessions` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_token_idx` ON `sessions` (`token`);--> statement-breakpoint
CREATE TABLE `two_factors` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`secret` text NOT NULL,
	`backup_codes` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `two_factors_user_idx` ON `two_factors` (`user_id`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer DEFAULT false NOT NULL,
	`image` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`two_factor_enabled` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_idx` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `verifications` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `verifications_identifier_idx` ON `verifications` (`identifier`);--> statement-breakpoint
CREATE TABLE `follows` (
	`follower_id` text NOT NULL,
	`following_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`follower_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`following_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `follows_pk` ON `follows` (`follower_id`,`following_id`);--> statement-breakpoint
CREATE INDEX `follows_following_idx` ON `follows` (`following_id`);--> statement-breakpoint
CREATE TABLE `profiles` (
	`user_id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`display_name` text NOT NULL,
	`avatar_url` text,
	`cover_url` text,
	`bio` text,
	`role` text DEFAULT 'user' NOT NULL,
	`trust_level` text DEFAULT 'new' NOT NULL,
	`teacher_status` text DEFAULT 'unverified' NOT NULL,
	`teacher_level` text,
	`school_name` text,
	`school_region` text,
	`subject` text,
	`years_of_teaching` integer,
	`tech_stack` text DEFAULT '[]',
	`website_url` text,
	`github_url` text,
	`linkedin_url` text,
	`karma` integer DEFAULT 0 NOT NULL,
	`post_count` integer DEFAULT 0 NOT NULL,
	`comment_count` integer DEFAULT 0 NOT NULL,
	`followers_count` integer DEFAULT 0 NOT NULL,
	`following_count` integer DEFAULT 0 NOT NULL,
	`is_maker` integer DEFAULT false NOT NULL,
	`is_suspended` integer DEFAULT false NOT NULL,
	`suspended_until` integer,
	`suspended_reason` text,
	`last_login_at` integer,
	`last_active_at` integer DEFAULT (unixepoch()),
	`phone_verified` integer DEFAULT false NOT NULL,
	`totp_enabled` integer DEFAULT false NOT NULL,
	`notification_prefs` text DEFAULT '{"emailMentions":true,"emailReplies":true,"emailDm":true,"emailDigest":true,"pushMentions":true,"pushReplies":true,"pushDm":true}',
	`privacy_prefs` text DEFAULT '{"profilePublic":true,"showSchool":false,"showEmail":false,"allowDmFrom":"verified"}',
	`deleted_at` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `profiles_username_unique` ON `profiles` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `profiles_username_idx` ON `profiles` (`username`);--> statement-breakpoint
CREATE INDEX `profiles_karma_idx` ON `profiles` (`karma`);--> statement-breakpoint
CREATE INDEX `profiles_trust_idx` ON `profiles` (`trust_level`);--> statement-breakpoint
CREATE INDEX `profiles_teacher_status_idx` ON `profiles` (`teacher_status`);--> statement-breakpoint
CREATE TABLE `teacher_verifications` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`method` text NOT NULL,
	`document_type` text,
	`document_url` text,
	`document_hash` text,
	`school_name` text,
	`teacher_level` text,
	`school_email` text,
	`school_email_verified_at` integer,
	`status` text DEFAULT 'pending' NOT NULL,
	`reviewed_by` text,
	`reviewed_at` integer,
	`review_notes` text,
	`rejection_reason` text,
	`ip_address` text,
	`user_agent` text,
	`expires_at` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`reviewed_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `tv_user_idx` ON `teacher_verifications` (`user_id`);--> statement-breakpoint
CREATE INDEX `tv_status_idx` ON `teacher_verifications` (`status`);--> statement-breakpoint
CREATE TABLE `bookmarks` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`post_id` text NOT NULL,
	`folder` text DEFAULT 'default' NOT NULL,
	`note` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `bookmarks_unique` ON `bookmarks` (`user_id`,`post_id`);--> statement-breakpoint
CREATE INDEX `bookmarks_user_idx` ON `bookmarks` (`user_id`);--> statement-breakpoint
CREATE TABLE `categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`icon` text,
	`color` text,
	`parent_id` integer,
	`display_order` integer DEFAULT 0 NOT NULL,
	`min_trust_level` text DEFAULT 'new' NOT NULL,
	`post_count` integer DEFAULT 0 NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_slug_unique` ON `categories` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `categories_slug_idx` ON `categories` (`slug`);--> statement-breakpoint
CREATE TABLE `comments` (
	`id` text PRIMARY KEY NOT NULL,
	`post_id` text NOT NULL,
	`author_id` text NOT NULL,
	`parent_id` text,
	`content` text NOT NULL,
	`is_anonymous` integer DEFAULT false NOT NULL,
	`vote_score` integer DEFAULT 0 NOT NULL,
	`upvote_count` integer DEFAULT 0 NOT NULL,
	`downvote_count` integer DEFAULT 0 NOT NULL,
	`reply_count` integer DEFAULT 0 NOT NULL,
	`depth` integer DEFAULT 0 NOT NULL,
	`is_deleted` integer DEFAULT false NOT NULL,
	`deleted_at` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `comments_post_idx` ON `comments` (`post_id`);--> statement-breakpoint
CREATE INDEX `comments_author_idx` ON `comments` (`author_id`);--> statement-breakpoint
CREATE INDEX `comments_parent_idx` ON `comments` (`parent_id`);--> statement-breakpoint
CREATE TABLE `post_tags` (
	`post_id` text NOT NULL,
	`tag_id` integer NOT NULL,
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `post_tags_pk` ON `post_tags` (`post_id`,`tag_id`);--> statement-breakpoint
CREATE INDEX `post_tags_tag_idx` ON `post_tags` (`tag_id`);--> statement-breakpoint
CREATE TABLE `posts` (
	`id` text PRIMARY KEY NOT NULL,
	`author_id` text NOT NULL,
	`category_id` integer NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`content_text` text NOT NULL,
	`excerpt` text,
	`cover_image_url` text,
	`status` text DEFAULT 'published' NOT NULL,
	`is_anonymous` integer DEFAULT false NOT NULL,
	`is_pinned` integer DEFAULT false NOT NULL,
	`is_locked` integer DEFAULT false NOT NULL,
	`is_featured` integer DEFAULT false NOT NULL,
	`vote_score` integer DEFAULT 0 NOT NULL,
	`upvote_count` integer DEFAULT 0 NOT NULL,
	`downvote_count` integer DEFAULT 0 NOT NULL,
	`view_count` integer DEFAULT 0 NOT NULL,
	`comment_count` integer DEFAULT 0 NOT NULL,
	`bookmark_count` integer DEFAULT 0 NOT NULL,
	`reaction_count` integer DEFAULT 0 NOT NULL,
	`hot_score` real DEFAULT 0 NOT NULL,
	`metadata` text DEFAULT '{}',
	`deleted_at` integer,
	`published_at` integer DEFAULT (unixepoch()) NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `posts_slug_unique` ON `posts` (`slug`);--> statement-breakpoint
CREATE INDEX `posts_author_idx` ON `posts` (`author_id`);--> statement-breakpoint
CREATE INDEX `posts_category_idx` ON `posts` (`category_id`);--> statement-breakpoint
CREATE INDEX `posts_status_idx` ON `posts` (`status`);--> statement-breakpoint
CREATE INDEX `posts_published_idx` ON `posts` (`published_at`);--> statement-breakpoint
CREATE INDEX `posts_hot_idx` ON `posts` (`hot_score`);--> statement-breakpoint
CREATE INDEX `posts_score_idx` ON `posts` (`vote_score`);--> statement-breakpoint
CREATE UNIQUE INDEX `posts_slug_idx` ON `posts` (`slug`);--> statement-breakpoint
CREATE TABLE `reactions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`target_type` text NOT NULL,
	`target_id` text NOT NULL,
	`reaction` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `reactions_unique` ON `reactions` (`user_id`,`target_type`,`target_id`,`reaction`);--> statement-breakpoint
CREATE INDEX `reactions_target_idx` ON `reactions` (`target_type`,`target_id`);--> statement-breakpoint
CREATE TABLE `tags` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`post_count` integer DEFAULT 0 NOT NULL,
	`is_featured` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tags_slug_unique` ON `tags` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `tags_slug_idx` ON `tags` (`slug`);--> statement-breakpoint
CREATE INDEX `tags_name_idx` ON `tags` (`name`);--> statement-breakpoint
CREATE TABLE `votes` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`target_type` text NOT NULL,
	`target_id` text NOT NULL,
	`vote` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `votes_unique` ON `votes` (`user_id`,`target_type`,`target_id`);--> statement-breakpoint
CREATE INDEX `votes_target_idx` ON `votes` (`target_type`,`target_id`);--> statement-breakpoint
CREATE TABLE `prompt_favorites` (
	`user_id` text NOT NULL,
	`prompt_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`prompt_id`) REFERENCES `prompts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `prompt_favorites_pk` ON `prompt_favorites` (`user_id`,`prompt_id`);--> statement-breakpoint
CREATE TABLE `prompts` (
	`id` text PRIMARY KEY NOT NULL,
	`author_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`content` text NOT NULL,
	`category` text NOT NULL,
	`tags` text DEFAULT '[]',
	`target_model` text NOT NULL,
	`use_case` text,
	`example_input` text,
	`example_output` text,
	`fork_count` integer DEFAULT 0 NOT NULL,
	`favorite_count` integer DEFAULT 0 NOT NULL,
	`view_count` integer DEFAULT 0 NOT NULL,
	`rating_sum` integer DEFAULT 0 NOT NULL,
	`rating_count` integer DEFAULT 0 NOT NULL,
	`forked_from` text,
	`is_public` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `prompts_author_idx` ON `prompts` (`author_id`);--> statement-breakpoint
CREATE INDEX `prompts_category_idx` ON `prompts` (`category`);--> statement-breakpoint
CREATE INDEX `prompts_favorites_idx` ON `prompts` (`favorite_count`);--> statement-breakpoint
CREATE TABLE `showcase_comments` (
	`id` text PRIMARY KEY NOT NULL,
	`product_id` text NOT NULL,
	`author_id` text NOT NULL,
	`parent_id` text,
	`content` text NOT NULL,
	`is_maker_reply` integer DEFAULT false NOT NULL,
	`is_deleted` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `showcase_products`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `sc_product_idx` ON `showcase_comments` (`product_id`);--> statement-breakpoint
CREATE TABLE `showcase_products` (
	`id` text PRIMARY KEY NOT NULL,
	`maker_id` text NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`tagline` text NOT NULL,
	`description` text NOT NULL,
	`category` text NOT NULL,
	`tags` text DEFAULT '[]',
	`logo_url` text,
	`cover_url` text,
	`screenshots` text DEFAULT '[]',
	`video_url` text,
	`website_url` text NOT NULL,
	`github_url` text,
	`app_store_url` text,
	`play_store_url` text,
	`pricing_model` text,
	`pricing_details` text,
	`tech_stack` text DEFAULT '[]',
	`build_story` text,
	`target_user` text,
	`problem_statement` text,
	`solution_statement` text,
	`mrr_visible` integer DEFAULT false NOT NULL,
	`mrr_usd` integer,
	`status` text DEFAULT 'draft' NOT NULL,
	`launch_week` text,
	`launched_at` integer,
	`upvote_count` integer DEFAULT 0 NOT NULL,
	`comment_count` integer DEFAULT 0 NOT NULL,
	`view_count` integer DEFAULT 0 NOT NULL,
	`click_count` integer DEFAULT 0 NOT NULL,
	`is_featured` integer DEFAULT false NOT NULL,
	`metadata` text DEFAULT '{}',
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`maker_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `showcase_products_slug_unique` ON `showcase_products` (`slug`);--> statement-breakpoint
CREATE INDEX `showcase_maker_idx` ON `showcase_products` (`maker_id`);--> statement-breakpoint
CREATE INDEX `showcase_status_idx` ON `showcase_products` (`status`);--> statement-breakpoint
CREATE INDEX `showcase_launch_idx` ON `showcase_products` (`launch_week`);--> statement-breakpoint
CREATE UNIQUE INDEX `showcase_slug_idx` ON `showcase_products` (`slug`);--> statement-breakpoint
CREATE TABLE `showcase_upvotes` (
	`user_id` text NOT NULL,
	`product_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`product_id`) REFERENCES `showcase_products`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `showcase_upvotes_pk` ON `showcase_upvotes` (`user_id`,`product_id`);--> statement-breakpoint
CREATE TABLE `conversation_participants` (
	`conversation_id` text NOT NULL,
	`user_id` text NOT NULL,
	`last_read_at` integer,
	`muted` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cp_pk` ON `conversation_participants` (`conversation_id`,`user_id`);--> statement-breakpoint
CREATE TABLE `conversations` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`last_message_at` integer DEFAULT (unixepoch())
);
--> statement-breakpoint
CREATE TABLE `event_attendees` (
	`event_id` text NOT NULL,
	`user_id` text NOT NULL,
	`status` text DEFAULT 'registered' NOT NULL,
	`registered_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `event_attendees_pk` ON `event_attendees` (`event_id`,`user_id`);--> statement-breakpoint
CREATE TABLE `events` (
	`id` text PRIMARY KEY NOT NULL,
	`organizer_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`event_type` text NOT NULL,
	`cover_url` text,
	`start_at` integer NOT NULL,
	`end_at` integer NOT NULL,
	`timezone` text DEFAULT 'Asia/Seoul' NOT NULL,
	`location_type` text NOT NULL,
	`location_details` text,
	`meeting_url` text,
	`max_attendees` integer,
	`is_recorded` integer DEFAULT false NOT NULL,
	`recording_url` text,
	`attendee_count` integer DEFAULT 0 NOT NULL,
	`price_krw` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`organizer_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `events_start_idx` ON `events` (`start_at`);--> statement-breakpoint
CREATE TABLE `group_members` (
	`group_id` text NOT NULL,
	`user_id` text NOT NULL,
	`role` text DEFAULT 'member' NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`joined_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `group_members_pk` ON `group_members` (`group_id`,`user_id`);--> statement-breakpoint
CREATE TABLE `groups` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`cover_url` text,
	`icon_url` text,
	`category` text,
	`owner_id` text,
	`is_private` integer DEFAULT false NOT NULL,
	`requires_approval` integer DEFAULT true NOT NULL,
	`member_count` integer DEFAULT 1 NOT NULL,
	`post_count` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `groups_slug_unique` ON `groups` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `groups_slug_idx` ON `groups` (`slug`);--> statement-breakpoint
CREATE TABLE `messages` (
	`id` text PRIMARY KEY NOT NULL,
	`conversation_id` text NOT NULL,
	`sender_id` text NOT NULL,
	`content` text NOT NULL,
	`attachment_url` text,
	`is_deleted` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `messages_conv_idx` ON `messages` (`conversation_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`type` text NOT NULL,
	`actor_id` text,
	`target_type` text,
	`target_id` text,
	`title` text NOT NULL,
	`body` text,
	`link` text,
	`metadata` text DEFAULT '{}',
	`is_read` integer DEFAULT false NOT NULL,
	`read_at` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`actor_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `notifications_user_idx` ON `notifications` (`user_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `notifications_unread_idx` ON `notifications` (`user_id`,`is_read`);--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`actor_id` text,
	`action` text NOT NULL,
	`target_type` text,
	`target_id` text,
	`changes` text,
	`ip_address` text,
	`user_agent` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`actor_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `audit_actor_idx` ON `audit_logs` (`actor_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `audit_action_idx` ON `audit_logs` (`action`,`created_at`);--> statement-breakpoint
CREATE TABLE `badges` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`icon_url` text NOT NULL,
	`rarity` text NOT NULL,
	`points` integer DEFAULT 0 NOT NULL,
	`criteria` text NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `badges_slug_unique` ON `badges` (`slug`);--> statement-breakpoint
CREATE TABLE `ip_blocklist` (
	`ip_address` text PRIMARY KEY NOT NULL,
	`reason` text NOT NULL,
	`blocked_by` text,
	`expires_at` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`blocked_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `karma_history` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`action` text NOT NULL,
	`delta` integer NOT NULL,
	`source_type` text,
	`source_id` text,
	`balance_after` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `karma_user_idx` ON `karma_history` (`user_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `reports` (
	`id` text PRIMARY KEY NOT NULL,
	`reporter_id` text,
	`target_type` text NOT NULL,
	`target_id` text NOT NULL,
	`reason` text NOT NULL,
	`details` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`reviewed_by` text,
	`reviewed_at` integer,
	`action_taken` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`reporter_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`reviewed_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `reports_status_idx` ON `reports` (`status`,`created_at`);--> statement-breakpoint
CREATE TABLE `security_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`event_type` text NOT NULL,
	`user_id` text,
	`email` text,
	`ip_address` text NOT NULL,
	`user_agent` text,
	`country_code` text,
	`details` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `security_user_idx` ON `security_events` (`user_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `security_ip_idx` ON `security_events` (`ip_address`,`created_at`);--> statement-breakpoint
CREATE INDEX `security_type_idx` ON `security_events` (`event_type`,`created_at`);--> statement-breakpoint
CREATE TABLE `user_badges` (
	`user_id` text NOT NULL,
	`badge_id` integer NOT NULL,
	`earned_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`badge_id`) REFERENCES `badges`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `user_badges_pk` ON `user_badges` (`user_id`,`badge_id`);