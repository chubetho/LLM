import { db, embeddings } from '~/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  await db.insert(embeddings).values({
    input: body.input,
    value: body.value,
  })
})
