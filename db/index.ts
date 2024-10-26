import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from './schema'

const sqlite = new Database('./db/db.sqlite3')
export const db = drizzle({ client: sqlite, schema })
console.log(db.run('SELECT * FROM embeddings;'))
export * from './schema'
export * from './types'
