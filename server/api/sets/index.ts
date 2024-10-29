import { db } from '~/db'

export default defineEventHandler(async () => {
  const sets = db.query.sets.findMany()
  return sets
})
