import { sqlite } from '~/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { id, embedding } = body

  // const columns = sqlite.prepare(`PRAGMA table_info(vec_docs)`).all()
  // console.log(columns)

  // // Print out each column's information
  // columns.forEach((column) => {
  //   console.log(`Column Name: ${column.name}, Type: ${column.type}, Not Null: ${column.notnull}, Default Value: ${column.dflt_value}`)
  // })

  // console.log(JSON.stringify(embedding))

  // const stmt = sqlite.prepare(`INSERT INTO vec_docs (id, embedding) VALUES (${id}, vec_f32(${embedding}))`)
  // stmt.run()

  const script = `
    create table documents(
      id integer primary key,
      embedding float[4]
        check(
          typeof(embedding) == 'blob'
          and vec_length(embedding) == 768
        )
    );
  `
  sqlite.prepare(script).run()
})
