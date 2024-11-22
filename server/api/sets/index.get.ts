import { db } from '~/db'
import type { Set } from '~/utils/types'

export default defineEventHandler(async () => {
  const stmt = db.prepare('select * from sets;')
  const sets = stmt.all()
  return sets as Set[]
})
