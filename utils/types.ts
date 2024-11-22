export type Question = {
  type: 'fill_blank'
  question: string
  answer: string
} | {
  type: 'multiple_choice'
  question: string
  options: string[]
  answer: string
} | {
  type: 'true_false'
  question: string
  answer: string
}

export interface QuestionAnswer {
  nth: number
  isTrue: boolean
  givenAnswer: string | undefined
}

export interface Set {
  id: number
  title: string
  cards: { id: number, term: string, def: string }[]
  tags: string[]
  embedding?: any
  createAt: string
}

export type NewSet = Omit<Set, 'id'>
