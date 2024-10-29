import { eq } from 'drizzle-orm'
import { db, sets } from '~/db'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id)
    throw new Error('id is required')
  const set = await db.query.sets.findFirst({ where: eq(sets.id, +id) })
  if (!set)
    throw new Error('set not found')

  return set
})
