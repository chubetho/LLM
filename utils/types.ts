import { z } from 'zod'

const fillBlankSchema = z.object({
  type: z.literal('fill_blank'),
  question: z.string().describe(
    'The question text in plain English, including the answer as a placeholder (e.g., "The capital of France is ___"). Ensure the placeholder aligns with the correct answer.',
  ),
  answer: z.string().describe('The correct answer that fills the placeholder in the question.'),
})

const multipleChoiceSchema = z.object({
  type: z.literal('multiple_choice'),
  question: z.string().describe(
    'The question text in plain English. Example: "What is the capital of France?"',
  ),
  options: z
    .array(z.string())
    .length(4)
    .describe('An array of exactly 4 unique and relevant options, one of which must be the correct answer.'),
  answer: z.string().describe('The correct answer that matches one of the options.'),
})

const trueFalseSchema = z.object({
  type: z.literal('true_false'),
  question: z.string().describe(
    'The question text in plain English. Example: "The Earth revolves around the Sun."',
  ),
  answer: z
    .string()
    .describe('The correct answer, which must strictly be either "true" or "false".')
    .refine(val => val === 'true' || val === 'false', {
      message: 'Answer must be either "true" or "false".',
    }),
})

export const questionSchema = z.union([
  trueFalseSchema,
  fillBlankSchema,
  multipleChoiceSchema,
])

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
  { role: 'system', type: 'text' | 'hidden' } |
  { role: 'system', type: 'file', name: string } |
  { role: 'assistant' | 'user' }
) &
{ content: string }
