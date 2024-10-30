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
