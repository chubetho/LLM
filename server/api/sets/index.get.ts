import type { Set } from '~/utils/types'
import { db } from '~/db'

export default defineEventHandler(async () => {
  const stmt = db.prepare('select * from sets;')
  const sets = stmt.all()
  return sets as Set[]
})
