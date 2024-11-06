import { desc } from 'drizzle-orm'
import { db, sets } from '~/db'

export default defineEventHandler(async () => {
  const _sets = db.query.sets.findMany({
    orderBy: [desc(sets.createAt)],
  })
  return _sets
})
