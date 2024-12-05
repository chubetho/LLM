export function useQuestionAsk(q: Question | undefined) {
  const explanation = ref('')

  async function ask() {
    if (!q || explanation.value)
      return

    const messages = [
      {
        role: 'system',
        content:
          'You are a knowledgeable teacher. Your task is to briefly and clearly explain why an answer to a question is correct or incorrect. Use logical reasoning and provide context. Do not ask follow-up questions or use markdown syntax.',
      },
      {
        role: 'user',
        content: q?.input
          ? `Can you explain why my answer "${q.input}" is ${
            q.input === q.answer ? 'correct' : 'incorrect'
          } for the question: "${q.question}"?`
          : `I don't know the input, so I cannot determine correctness. Can you help me with this question?\n${q.question}`,
      },
    ]

    await $chat(messages, o => explanation.value += o)
  }

  return { explanation, ask }
}
