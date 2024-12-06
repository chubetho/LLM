import { db } from '~/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const id = body.id

  db.prepare('delete from sets where id = ?').run(id)
})
