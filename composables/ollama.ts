import ollama from 'ollama'

type Status = 'idle' | 'pending' | 'done' | 'error'

export function useLLM() {
  const status = ref<Status>('idle')

  const chat = async (c: string) => {
    ollama.abort()
    status.value = 'pending'
    try {
      const response = await ollama.chat({
        model: 'llama3.2',
        messages: [{ role: 'user', content: c }],
        // stream: false,
        // format: 'json',
      })

      status.value = 'done'
      return response.message.content
    }
    catch (e) {
      status.value = 'error'
      console.error(e)
      return ''
    }
  }

  const sChat = async (c: string, cb: (text: string) => void) => {
    ollama.abort()
    status.value = 'pending'
    try {
      const response = await ollama.chat({
        model: 'llama3.2',
        messages: [{ role: 'user', content: c }],
        stream: true,
      })

      status.value = 'done'
      for await (const part of response) {
        cb(part.message.content)
      }
    }
    catch (e) {
      status.value = 'error'
      console.error(e)
    }
  }

  const embed = async (input: string) => {
    const response = await ollama.embed({
      model: 'nomic-embed-text',
      input,
    })
    return response.embeddings
  }

  return { status, chat, sChat, embed }
}
