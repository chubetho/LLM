import Database from 'better-sqlite3'

export const db = new Database('./db/db.sqlite', { fileMustExist: true })
db.loadExtension('./db/vec0.dylib')
