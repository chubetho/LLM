import { db } from '~/db'
import { cosineSimilarity } from '~/server/utils'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const top = body.top || 3
  const embeddings = await db.query.embeddings.findMany()
  const similarities = embeddings.map(doc => ({
    ...doc,
    similarity: cosineSimilarity(body.value, doc.value),
  }))

  return similarities.sort((a, b) => b.similarity - a.similarity).slice(0, top)
})
