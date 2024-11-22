import { db } from '~/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const embedding = body.embedding

  if (!embedding)
    throw createError('embedding is invalid')

  const script = `
    select
      id,
      contents,
      vec_distance_cosine(embedding, ?) as distance
    from documents
    where distance < 0.5
    order by distance
    limit 5;
  `
  const response = db.prepare(script).all(JSON.stringify(embedding)) as { id: number, contents: string, distance: number }[]
  return response
})
