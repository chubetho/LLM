export default defineEventHandler(async (event) => {
  return [
    {
      name: 'Essential Knowledge Flashcards',
      cards: [
        {
          term: 'What is the function of mitochondria in a cell?',
          def: 'They produce energy for the cell.',
        },
        {
          term: 'Name the capital city of France.',
          def: 'Paris.',
        },
        {
          term: 'Who is the author of \'To Kill a Mockingbird\'?',
          def: 'Harper Lee.',
        },
        {
          term: 'What is the result of 5 + 7?',
          def: '12.',
        },
        {
          term: 'Describe Newton\'s First Law of Motion.',
          def: 'An object in motion stays in motion unless acted upon by an external force.',
        },
        {
          term: 'List the primary colors in art.',
          def: 'Red, blue, and yellow.',
        },
        {
          term: 'What is the chemical formula for water?',
          def: 'H₂O.',
        },
        {
          term: 'Who was the first president of the United States?',
          def: 'George Washington.',
        },
        {
          term: 'Identify the longest river in the world.',
          def: 'The Nile River.',
        },
        {
          term: 'What is the boiling point of water in Celsius?',
          def: '100°C.',
        },
      ],
      hashtags: ['#Science', '#History', '#Geography', '#Literature'],
      createdAt: '2024-10-28',
      id: 1,
    },
  ]
})
