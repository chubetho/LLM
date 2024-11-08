import { sql } from 'drizzle-orm'
import { blob, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const documents = sqliteTable('documents', {
  id: integer().primaryKey({ autoIncrement: true }).notNull(),
  contents: text().notNull(),
  embedding: blob(),
})

export const sets = sqliteTable('sets', {
  id: integer().primaryKey({ autoIncrement: true }).notNull(),
  name: text().notNull(),
  cards: text({ mode: 'json' }).$type<{ id: number, term: string, def: string }[]>().notNull(),
  tags: text({ mode: 'json' }).$type<string[]>().notNull(),
  createAt: text().notNull(),
})
