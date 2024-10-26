import { sql } from 'drizzle-orm'
import { AnySQLiteColumn, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const embeddings = sqliteTable('embeddings', {
  id: integer().primaryKey({ autoIncrement: true }).notNull(),
  input: text().notNull(),
  value: text().notNull(),
})
