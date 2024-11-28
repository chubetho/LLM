import type { Set } from '~/utils/types'
import { db } from '~/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const set = body.set as Set

  const stmt = db.prepare(`INSERT INTO sets (title, cards, tags, embedding, createAt) VALUES (?, ?, ?, vec_f32(?), ?);`)
  const lastRowId = stmt.run(
    set.title,
    JSON.stringify(set.cards),
    JSON.stringify(set.tags),
    JSON.stringify(set.embedding),
    set.createAt,
  ).lastInsertRowid

  return lastRowId
})
