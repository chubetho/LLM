import { z } from 'zod'

const fillBlankSchema = z.object({
  type: z.literal('fill_blank'),
  question: z.string(),
  answer: z.string(),
})

const multipleChoiceSchema = z.object({
  type: z.literal('multiple_choice'),
  question: z.string(),
  options: z.array(z.string()).length(4),
  answer: z.string(),
})

const trueFalseSchema = z.object({
  type: z.literal('true_false'),
  question: z.string(),
  answer: z.string(),
})

export const questionSchema = z.union([fillBlankSchema, multipleChoiceSchema, trueFalseSchema])

export type Question = z.infer<typeof questionSchema> & { id: number, input: string | undefined }

export interface Set {
  id: number
  title: string
  cards: { id: number, term: string, def: string }[]
  tags: string[]
  embedding?: any
  createAt: string
  match?: number
}

export type NewSet = Omit<Set, 'id'>

export type Message =
(
  { role: 'assistant' | 'user' } |
  { role: 'system', type: 'text' } |
  { role: 'system', type: 'file', name: string } |
  { role: 'system', type: 'hidden' }
) &
{ content: string }
