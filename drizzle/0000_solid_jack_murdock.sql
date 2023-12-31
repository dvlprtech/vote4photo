CREATE TABLE `contest` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`init_timestamp` integer NOT NULL,
	`end_timestamp` integer NOT NULL,
	`winning_photo_id` integer,
	`user_draw_winning_id` integer,
	`total_prize` real,
	`creation_timestamp` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`winning_photo_id`) REFERENCES `user_photo`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_draw_winning_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `contest_photo` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`photo_id` integer,
	`contest_id` integer,
	`votes` integer NOT NULL,
	`sale_price` real NOT NULL,
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
	`user_id` integer NOT NULL,
	`contest_photo_id` integer NOT NULL,
	`type` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`message` text NOT NULL,
	`destination_user_id` integer,
	`destination_account` text,
	`execution_timestamp` integer,
	`expiration_timestamp` integer NOT NULL,
	`rejection_timestamp` integer,
	`rejection_reason` text,
	`creation_timestamp` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`contest_photo_id`) REFERENCES `contest_photo`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`destination_user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`role` text DEFAULT 'user' NOT NULL,
	`full_name` text NOT NULL,
	`remaining_votes` integer DEFAULT 0 NOT NULL,
	`funds` real DEFAULT 0 NOT NULL,
	`last_used_account` text NOT NULL,
	`creation_timestamp` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user_photo` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`photo_key` text NOT NULL,
	`title` text NOT NULL,
	`size` integer NOT NULL,
	`md5` text NOT NULL,
	`account` text NOT NULL,
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
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_photo_photo_key_unique` ON `user_photo` (`photo_key`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_photo_md5_unique` ON `user_photo` (`md5`);