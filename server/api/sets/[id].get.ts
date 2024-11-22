import { db } from '~/db'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id)
    throw new Error('id is required')
  const set = db.prepare('select * from sets where id = ?').run(id)
  if (!set)
    throw new Error('set not found')

  return set
})
