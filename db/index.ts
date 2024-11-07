import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as sqliteVec from 'sqlite-vec'
import * as schema from './schema'

export const sqlite = new Database('./db/db.sqlite3', { fileMustExist: true })
sqliteVec.load(sqlite)

// @ts-expect-error no type on sqlite-vec
const { vec_version } = sqlite.prepare('select vec_version() as vec_version;').get()
if (!vec_version) {
  throw new Error('sqlite-vec is not installed')
}

export const db = drizzle({ client: sqlite, schema })

export * from './schema'
export * from './types'
