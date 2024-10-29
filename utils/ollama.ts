import ollama from 'ollama'

interface Option {
  format?: 'json'
}

export async function chat(input: string, opt?: Option) {
  ollama.abort()

  const { format = undefined } = opt || {}

  const response = await ollama.chat({
    model: 'llama3.2',
    messages: [{ role: 'user', content: input }],
    format,
  })

  return response.message.content
}
