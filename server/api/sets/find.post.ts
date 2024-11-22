import { db } from '~/db'

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
    limit 1;
  `
  const response = db.prepare(script).all(JSON.stringify(embedding))
  return response
})
