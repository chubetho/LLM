-- CREATE TABLE `documents` (
-- 	`id` integer PRIMARY KEY AUTOINCREMENT not null,
-- 	`contents` text not null,
-- 	`embedding` blob
-- );

create virtual table "sets" using vec0 (
	id integer primary key autoincrement,
	createAt text,
	embedding float[768],
	+title text,
	+cards text,
	+tags text,
);

