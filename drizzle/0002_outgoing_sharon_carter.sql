PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_documents` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`contents` text NOT NULL,
	`embedding` blob NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_documents`("id", "contents", "embedding") SELECT "id", "contents", "embedding" FROM `documents`;--> statement-breakpoint
DROP TABLE `documents`;--> statement-breakpoint
ALTER TABLE `__new_documents` RENAME TO `documents`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `sets` ADD `embedding` blob NOT NULL;