import { eq } from 'drizzle-orm'
import { db, sets } from '~/db'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id)
    return

  await db.delete(sets).where(eq(sets.id, +id))
})
