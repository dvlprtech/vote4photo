ALTER TABLE user_photo ADD `account` text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `user_photo_photo_key_unique` ON `user_photo` (`photo_key`);--> statement-breakpoint
ALTER TABLE `user_photo` DROP COLUMN `token_address`;