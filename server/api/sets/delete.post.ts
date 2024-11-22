import { db } from '~/db'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id)
    return

  db.prepare('delete from table sets where id = ?').run(id)
})
