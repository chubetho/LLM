import { db, sqlite } from '~/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // const script = `
  //   INSERT INTO documents (contents, embedding) VALUES (?, vec_f32(?));
  // `
  // const stmt = sqlite.prepare(script)
  // stmt.run(body.contents, JSON.stringify(body.embedding))

  // const script = `
  //   select
  //     id,
  //     vec_distance_cosine(embedding, ?) as distance
  //   from documents
  //   order by distance;
  // `
  // const a = sqlite.prepare(script).all(JSON.stringify(body.embedding))
  // console.log(a)
})
