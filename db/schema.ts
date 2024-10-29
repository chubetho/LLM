import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const embeddings = sqliteTable('embeddings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  input: text('input').notNull(),
  value: text('value', { mode: 'json' }).$type<number[]>().notNull(),
})

export const sets = sqliteTable('sets', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  cards: text('cards', { mode: 'json' }).$type<{ id: number, term: string, def: string }[]>().notNull(),
  tags: text('tags', { mode: 'json' }).$type<string[]>(),
  createAt: text('createAt').notNull(),
})
