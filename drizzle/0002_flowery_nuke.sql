ALTER TABLE user ADD `remaining_votes` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `remainig_votes`;