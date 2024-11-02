import { db, sets } from '~/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const set = body.set
  const { lastInsertRowid } = await db.insert(sets).values(set)
  return Number(lastInsertRowid)
})
