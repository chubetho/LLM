import path from 'node:path'
import { fileURLToPath } from 'node:url'
import Database from 'better-sqlite3'

const parentPath = import.meta.dev ? './db' : path.join(fileURLToPath(import.meta.url), '..')
const dbPath = path.join(parentPath, 'db.sqlite')
const extensionPath = path.join(parentPath, 'vec0.dylib')

export const db = new Database(dbPath, { fileMustExist: true })
db.loadExtension(extensionPath)
