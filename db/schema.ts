import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const sets = sqliteTable('sets', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  cards: text('cards', { mode: 'json' }).$type<{ id: number, term: string, def: string }[]>().notNull(),
  tags: text('tags', { mode: 'json' }).$type<string[]>(),
  createAt: text('createAt').notNull(),
})

export const docs = sqliteTable('docs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  content: text('content').notNull(),
})

// export const docVecs = sqliteTable('doc_vecs',{
//   id: integer('id').references(() => docs.id),
//   vect
// })
