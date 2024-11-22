import { db } from '~/db'
import type { Set } from '~/utils/types'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const embedding = body.embedding
  console.log(body)
  return [] as Set[]

  // const script = `
  //   select
  //     id,
  //     name,
  //     cards,
  //     tags,
  //     createAt,
  //     vec_distance_cosine(embedding, ?) as distance
  //   from sets

  //   order by distance
  //   limit 1;
  // `
  // const response = db.prepare(script).all(JSON.stringify(embedding))
  // return response
})
