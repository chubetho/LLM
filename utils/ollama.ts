import type { Message, ModelDetails } from 'ollama'
import ollama from 'ollama/browser'
import { DEFAULT_TOOLS_CONFIG } from './constants'

interface ChatOption {
  format?: 'json'
  endSymbol?: boolean
}

export function $abort() {
  ollama.abort()
}

export async function $gen(prompt: string, opt?: ChatOption) {
  const toolsConfig = useLocalStorage('llm_tools', DEFAULT_TOOLS_CONFIG)

  $abort()

  const { format = undefined } = opt || {}

  const response = await ollama.generate({
    model: toolsConfig.value.name,
    prompt,
    format,
    options: {
      temperature: toolsConfig.value.temperature,
      top_k: toolsConfig.value.topK,
      top_p: toolsConfig.value.topP,
    },
  })

  return response.response
}

export async function $genStream(prompt: string, cb: (o: string) => void, opt?: ChatOption) {
  const toolsConfig = useLocalStorage('llm_tools', DEFAULT_TOOLS_CONFIG)

  $abort()

  const { format = undefined, endSymbol } = opt || {}

  const response = await ollama.generate({
    model: toolsConfig.value.name,
    prompt,
    format,
    stream: true,
    options: {
      temperature: toolsConfig.value.temperature,
      top_k: toolsConfig.value.topK,
      top_p: toolsConfig.value.topP,
    },
  })

  for await (const r of response) {
    cb(r.response)
  }
  if (endSymbol)
    cb('__end__')
}

export async function $chat(messages: Message[], cb: (o: string) => void, opt?: ChatOption) {
  const toolsConfig = useLocalStorage('llm_tools', DEFAULT_TOOLS_CONFIG)

  $abort()

  const { format = undefined, endSymbol } = opt || {}

  const response = await ollama.chat({
    model: toolsConfig.value.name,
    messages,
    format,
    stream: true,
    options: {
      temperature: toolsConfig.value.temperature,
      top_k: toolsConfig.value.topK,
      top_p: toolsConfig.value.topP,
    },
  })

  for await (const part of response) {
    cb(part.message.content)
  }
  if (endSymbol)
    cb('__end__')
}

export async function $chatFast(messages: Message[], opt?: ChatOption) {
  const toolsConfig = useLocalStorage('llm_tools', DEFAULT_TOOLS_CONFIG)

  $abort()

  const { format = undefined } = opt || {}

  const response = await ollama.chat({
    model: toolsConfig.value.name,
    messages,
    format,
    options: {
      temperature: toolsConfig.value.temperature,
      top_k: toolsConfig.value.topK,
      top_p: toolsConfig.value.topP,
    },
  })

  return response.message.content
}

export async function $embed(input: string) {
  const response = await ollama.embed({
    model: 'nomic-embed-text',
    input,
  })

  if (response.embeddings.length > 1)
    throw new Error('expect length = 1')

  return response.embeddings[0]
}

type Model = { name: string, shortname: string } & Pick<ModelDetails, 'parameter_size' | 'quantization_level'>
export async function $list() {
  const { models } = await ollama.list()
  return models.reduce((acc, cur) => {
    const name = cur.name.split(':').at(0)
    const el: Model = {
      shortname: name ?? cur.name,
      name: cur.name,
      parameter_size: cur.details.parameter_size,
      quantization_level: cur.details.quantization_level,
    }

    if (cur.details.family === 'llama') {
      acc.tools.push(el)
      return acc
    }
    acc.embeddings.push(el)

    return acc
  }, { tools: [] as Model[], embeddings: [] as Model[] })
}
