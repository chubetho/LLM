import type { Set } from '~/db'
import { sqlite } from '~/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const embedding = body.embedding

  if (!embedding)
    throw createError('embedding is invalid')

  const script = `
    select
      id,
      name,
      cards,
      tags,
      createAt,
      vec_distance_cosine(embedding, ?) as distance
    from sets

    order by distance
    limit 5;
  `
  const response = sqlite.prepare(script).all(JSON.stringify(embedding)) as Set[]
  return response
})
