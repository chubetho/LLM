import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'sqlite',
  schema: './db/schema.ts',
  dbCredentials: {
    url: './db/db.sqlite3',
  },
  verbose: true,
  strict: true,
})
