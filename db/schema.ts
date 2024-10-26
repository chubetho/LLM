import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const embeddings = sqliteTable('embeddings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  input: text('input').notNull(),
  value: text('value', { mode: 'json' }).$type<number[]>().notNull(),
})
