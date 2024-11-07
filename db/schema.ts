import { sql } from 'drizzle-orm'
import { blob, check, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const documents = sqliteTable('documents', {
  id: integer().primaryKey({ autoIncrement: true }).notNull(),
  contents: text().notNull(),
  embedding: blob(),
}, () => {
  return {
    documentsCheck1: check('documents_check_1', sql`vec_length(embedding)==768`),
  }
})

export const sets = sqliteTable('sets', {
  id: integer().primaryKey({ autoIncrement: true }).notNull(),
  name: text().notNull(),
  cards: text().notNull(),
  tags: text(),
  createAt: text().notNull(),
})
