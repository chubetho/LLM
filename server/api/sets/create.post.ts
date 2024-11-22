import { db } from '~/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const set = body.set

  if (!set)
    throw createError('set is invalid')

  const stmt = db.prepare(`INSERT INTO sets (name, cards, tags, embedding, createAt) VALUES (?, ?, ?, vec_f32(?), ?);`)
  const lastRowId = stmt.run(
    set.name,
    JSON.stringify(set.cards),
    JSON.stringify(set.tags),
    JSON.stringify(set.embedding),
    set.createAt,
  ).lastInsertRowid

  return lastRowId
})
