export const SAMPLE_PUZZLE = {
  grid: [
    [{ value: 'C', number: 1 }, { value: 'A' }, { value: 'S' }, { value: 'A' }],
    [{ value: 'O', number: 2 }, { value: 'S' }, { value: 'O' }, null],
    [{ value: 'S', number: 3 }, { value: 'O' }, { value: 'L' }, null],
    [{ value: 'A' }, null, null, null],
  ],
  clues: {
    across: [
      { number: 1, clue: 'Lugar donde vives' },
      { number: 2, clue: 'Animal que camina sobre sus huesos' },
      { number: 3, clue: 'Estrella que nos da luz' },
    ],
    down: [
      { number: 1, clue: 'Cosa' },
      { number: 2, clue: 'Hueso del cuerpo' },
    ],
  },
};
