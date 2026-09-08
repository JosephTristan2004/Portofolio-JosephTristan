CREATE TABLE IF NOT EXISTS `community_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`room` text NOT NULL,
	`name` text NOT NULL,
	`body` text NOT NULL,
	`link` text DEFAULT '' NOT NULL,
	`session_id` text NOT NULL,
	`created_at` integer NOT NULL
);

CREATE INDEX IF NOT EXISTS `idx_messages_room_created` ON `community_messages` (`room`,`created_at`);
CREATE INDEX IF NOT EXISTS `idx_messages_session_created` ON `community_messages` (`session_id`,`created_at`);