CREATE TABLE `docs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`content` text NOT NULL
);
--> statement-breakpoint
DROP TABLE `embeddings`;