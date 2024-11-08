import { sqlite } from '~/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const contents = body.contents
  const embedding = body.embedding

  if (!contents || !embedding)
    throw createError('contents or embedding is invalid')

  const script = `INSERT INTO documents (contents, embedding) VALUES (?, vec_f32(?));`
  const stmt = sqlite.prepare(script)
  stmt.run(contents, JSON.stringify(embedding))
})
