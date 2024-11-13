import type { NewSet } from '~/db'
import { sqlite } from '~/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const set = body.set as NewSet

  if (!set)
    throw createError('set is invalid')

  sqlite.prepare('begin transaction;').run()
  const stmt = sqlite.prepare(`INSERT INTO sets (name, cards, tags, embedding, createAt) VALUES (?, ?, ?, vec_f32(?), ?);`)
  stmt.run(
    set.name,
    JSON.stringify(set.cards),
    JSON.stringify(set.tags),
    JSON.stringify(set.embedding),
    set.createAt,
  )
  const lastRowId = sqlite.prepare('SELECT last_insert_rowid();').get() as { 'last_insert_rowid()': number }
  sqlite.prepare('commit;').run()

  return lastRowId['last_insert_rowid()']
})
