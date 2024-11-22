import { db } from '~/db'

export default defineEventHandler(async () => {
  const stmt = db.prepare('select * from sets order by createAt;')
  const sets = stmt.all()
  return sets
})
