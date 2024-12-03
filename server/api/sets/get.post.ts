import type { Set } from '~/utils/types'
import { db } from '~/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const id = body.id

  const _set = db.prepare(`
  SELECT 
    id, 
    title, 
    json_extract(cards, '$') AS cards,
    json_extract(tags, '$') AS tags,
    createAt 
  FROM sets 
  WHERE id = ?;`)
    .get(id) as Set

  // @ts-expect-error no type
  _set.cards = JSON.parse(_set.cards) as Set['cards']
  // @ts-expect-error no type
  _set.tags = JSON.parse(_set.tags) as Set['tags']

  return _set
})
