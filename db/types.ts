import type { embeddings, sets } from './'

export type Embedding = typeof embeddings.$inferSelect
export type NewEmbedding = typeof embeddings.$inferInsert

export type Set = typeof sets.$inferSelect
export type NewSet = typeof sets.$inferInsert
