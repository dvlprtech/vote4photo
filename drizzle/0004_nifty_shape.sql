ALTER TABLE `user_photo` RENAME COLUMN `photo_uri` TO `photo_key`;--> statement-breakpoint
ALTER TABLE user_photo ADD `size` integer NOT NULL;--> statement-breakpoint
ALTER TABLE user_photo ADD `md5` text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `user_photo_md5_unique` ON `user_photo` (`md5`);