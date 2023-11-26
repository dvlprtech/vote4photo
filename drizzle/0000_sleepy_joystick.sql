CREATE TABLE `contest` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`status` text DEFAULT 'pending',
	`init_timestamp` integer NOT NULL,
	`end_timestamp` integer NOT NULL,
	`wining_photo_id` integer,
	`user_draw_winning_id` integer,
	`total_prize` integer NOT NULL,
	`creation_timestamp` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`wining_photo_id`) REFERENCES `user_photo`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_draw_winning_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `contest_photo` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`photo_id` integer,
	`contest_id` integer,
	`votes` integer NOT NULL,
	`sale_price` integer NOT NULL,
	`creation_timestamp` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`photo_id`) REFERENCES `user_photo`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`contest_id`) REFERENCES `contest`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `log_votes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`contest_photo_id` integer,
	`votes` integer NOT NULL,
	`execution_timestamp` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`contest_photo_id`) REFERENCES `contest_photo`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `operations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`contest_photo_id` integer,
	`type` text,
	`status` text DEFAULT 'pending',
	`execution_timestamp` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`expiration_timestamp` integer NOT NULL,
	`rejection_reason` text,
	`creation_timestamp` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`contest_photo_id`) REFERENCES `contest_photo`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`role` text DEFAULT 'user',
	`full_name` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`accounts` text,
	`creation_timestamp` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`remainig_votes` integer DEFAULT 0 NOT NULL,
	`funds` real DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user_photo` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`photo_uri` text NOT NULL,
	`title` text NOT NULL,
	`token_address` text NOT NULL,
	`token_id` integer NOT NULL,
	`owner_since` integer NOT NULL,
	`mint_tx` text NOT NULL,
	`last_transfer_tx` text NOT NULL,
	`creation_timestamp` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user_votes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`contest_photo_id` integer,
	`votes` integer NOT NULL,
	`want_buy` integer NOT NULL,
	`execution_timestamp` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`contest_photo_id`) REFERENCES `contest_photo`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `votes_pricing` (
	`num_votes` integer PRIMARY KEY NOT NULL,
	`price` integer NOT NULL
);
