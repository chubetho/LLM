export const toolsProfileOpts = [
  {
    name: 'creative',
    temperature: 1.2,
    topK: 100,
    topP: 0.95,
  },
  {
    name: 'default',
    temperature: 0.8,
    topK: 40,
    topP: 0.9,
  },
  {
    name: 'concise',
    temperature: 0.4,
    topK: 20,
    topP: 0.8,
  },
  {
    name: 'custom',
    temperature: 0,
    topK: 0,
    topP: 0,
  },
] as const

export const DEFAULT_TOOLS_CONFIG = {
  name: 'llama3.1:8b',
  profile: 'default' as typeof toolsProfileOpts[number]['name'],
  temperature: 0.8,
  topK: 40,
  topP: 0.9,
}

export const DEFAULT_EMBEDDING_CONF = {
  name: 'nomic-embed-text:latest',
}
