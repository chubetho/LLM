import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from './schema'

const sqlite = new Database('./db/db.sqlite3', { fileMustExist: true })
export const db = drizzle({ client: sqlite, schema })

export * from './schema'
export * from './types'
