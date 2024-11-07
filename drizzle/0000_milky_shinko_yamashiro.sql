CREATE TABLE `documents` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`contents` text NOT NULL,
	`embedding` blob
);
--> statement-breakpoint
CREATE TABLE `sets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`cards` text NOT NULL,
	`tags` text,
	`createAt` text NOT NULL
);
