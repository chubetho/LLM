PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_sets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`cards` text NOT NULL,
	`tags` text NOT NULL,
	`createAt` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_sets`("id", "name", "cards", "tags", "createAt") SELECT "id", "name", "cards", "tags", "createAt" FROM `sets`;--> statement-breakpoint
DROP TABLE `sets`;--> statement-breakpoint
ALTER TABLE `__new_sets` RENAME TO `sets`;--> statement-breakpoint
PRAGMA foreign_keys=ON;