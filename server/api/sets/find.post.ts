import type { Set } from '~/utils/types'
import { db } from '~/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const embedding = body.embedding

  const script = `
    select
      id,
      title,
      cards,
      tags,
      createAt,
      vec_distance_cosine(embedding, ?) as distance
    from sets

    order by distance;
  `
  const response = db.prepare(script).all(JSON.stringify(embedding)) as any[]
  if (!response?.length)
    return []

  return response.map(s => ({
    id: s.id,
    title: s.title,
    cards: JSON.parse(s.cards),
    tags: JSON.parse(s.tags),
    createAt: s.createAt,
    match: Math.floor((1 - s.distance) * 100),
  } as Set))
})
