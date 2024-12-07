import type { Message, ModelDetails } from 'ollama'
import type { ZodSchema } from 'zod'
import ollama from 'ollama/browser'
import { zodToJsonSchema } from 'zod-to-json-schema'
import { DEFAULT_TOOLS_CONFIG } from './constants'

interface NonStreamOption<T = undefined> { schema?: ZodSchema<T> }
interface StreamOption { endSymbol?: boolean }

export function $abort() {
  ollama.abort()
}

function getConfig() {
  const toolsConfig = useLocalStorage('llm_tools', DEFAULT_TOOLS_CONFIG)
  return {
    model: toolsConfig.value.name,
    options: {
      temperature: toolsConfig.value.temperature,
      top_k: toolsConfig.value.topK,
      top_p: toolsConfig.value.topP,
    },
  }
}

export async function $generate<T = string>(prompt: string, opt?: NonStreamOption<T>): Promise<T> {
  $abort()

  const { schema } = opt || {}
  const format = schema ? zodToJsonSchema(schema) : undefined
  const config = getConfig()
  let remainingTries = 5

  const generate = async (): Promise<any> => {
    const response = await ollama.generate({
      prompt,
      format,
      ...config,
    })

    if (!schema)
      return response.response

    try {
      return schema.parse(JSON.parse(response.response))
    }
    catch (error) {
      console.error(`${error}\nResponse: ${response.response}`)
      if (remainingTries > 0) {
        remainingTries--
        return generate()
      }
      throw new Error('Exceeded maximum retry attempts for schema validation.')
    }
  }

  return generate()
}

export async function $chat<T = string>(messages: Message[], opt?: NonStreamOption<T>): Promise<T> {
  $abort()

  const { schema } = opt || {}
  const format = schema ? zodToJsonSchema(schema) : undefined
  const config = getConfig()
  let remainingTries = 5

  const chat = async (): Promise<any> => {
    const response = await ollama.chat({
      messages,
      format,
      ...config,
    })

    if (!schema)
      return response.message.content

    try {
      return schema.parse(JSON.parse(response.message.content))
    }
    catch (error) {
      console.error(`${error}\nResponse: ${response.message.content}`)
      if (remainingTries > 0) {
        remainingTries--
        return chat()
      }
      throw new Error('Exceeded maximum retry attempts for schema validation.')
    }
  }

  return chat()
}

export async function $generateStream(prompt: string, cb: (o: string) => void, opt?: StreamOption) {
  $abort()

  const { endSymbol } = opt || {}

  const response = await ollama.generate({
    prompt,
    stream: true,
    ...getConfig(),
  })

  for await (const r of response) {
    cb(r.response)
  }
  if (endSymbol)
    cb('__end__')
}

export async function $chatStream(messages: Message[], cb: (o: string) => void, opt?: StreamOption) {
  $abort()

  const { endSymbol } = opt || {}

  const response = await ollama.chat({
    messages,
    stream: true,
    ...getConfig(),
  })

  for await (const r of response) {
    cb(r.message.content)
  }
  if (endSymbol)
    cb('__end__')
}

export async function $embed(input: string) {
  const response = await ollama.embed({
    model: 'nomic-embed-text',
    input,
  })

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
