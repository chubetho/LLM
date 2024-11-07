import { blob, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const documents = sqliteTable('documents', {
  id: integer().primaryKey({ autoIncrement: true }).notNull(),
  contents: text().notNull(),
  embedding: blob(),
})

export const sets = sqliteTable('sets', {
  id: integer().primaryKey({ autoIncrement: true }).notNull(),
  name: text().notNull(),
  cards: text().notNull(),
  tags: text(),
  createAt: text().notNull(),
})
