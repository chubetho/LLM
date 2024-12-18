import pdf from 'pdf-parse'

export default defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event)
    if (!formData)
      return

    const data = formData[0].data
    const result = await pdf(data)
    return result.text.replaceAll('\n', '')
  }
  catch {
    return createError('cant read pdf.')
  }
})
