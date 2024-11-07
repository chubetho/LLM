import ollama from 'ollama'

interface ChatOption {
  format?: 'json'
  endSymbol?: boolean
}

export async function chat(input: string, opt?: ChatOption) {
  ollama.abort()

  const { format = undefined } = opt || {}

  const response = await ollama.chat({
    model: 'llama3.1:8b',
    messages: [{ role: 'user', content: input }],
    format,
  })

  return response.message.content
}

export function abort() {
  ollama.abort()
}

export async function chatStream(input: string, cb: (o: string) => void, opt?: ChatOption) {
  ollama.abort()

  const { format = undefined, endSymbol } = opt || {}

  const response = await ollama.chat({
    model: 'llama3.1:8b',
    messages: [{ role: 'user', content: input }],
    format,
    stream: true,
  })

  for await (const part of response) {
    cb(part.message.content)
  }
  if (endSymbol)
    cb('__end__')
}

export async function embed(input: string) {
  const response = await ollama.embed({
    model: 'nomic-embed-text',
    input,
  })

  return response.embeddings
}
