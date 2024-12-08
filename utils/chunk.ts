interface Option {
  max: number
}

export function $chunk(text: string, opt: Partial<Option> = {}) {
  const { max = 1024 } = opt

  const result: string[] = []
  for (let i = 0; true; i++) {
    const from = i * max
    if (from > text.length)
      break
    result.push(text.substring(from, from + max))
  }

  return result
}
