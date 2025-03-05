// GameLogic.js - Módulo para manejar la lógica del juego de crucigrama

// Niveles de dificultad para crucigramas
const DIFFICULTY_LEVELS = {
  EASY: 'fácil',
  MEDIUM: 'medio',
  HARD: 'difícil',
  EXPERT: 'experto',
};

// Generador de puntuación basado en tiempo y dificultad
const calculateScore = (timeInSeconds, difficulty, errorsCount, hintsUsed) => {
  // Base de puntos según dificultad
  let basePoints = 0;
  switch (difficulty) {
    case DIFFICULTY_LEVELS.EASY:
      basePoints = 100;
      break;
    case DIFFICULTY_LEVELS.MEDIUM:
      basePoints = 200;
      break;
    case DIFFICULTY_LEVELS.HARD:
      basePoints = 300;
      break;
    case DIFFICULTY_LEVELS.EXPERT:
      basePoints = 500;
      break;
    default:
      basePoints = 100;
  }

  // Factor de tiempo (menos tiempo = mejor puntuación)
  const timeFactor = Math.max(0.1, 1 - timeInSeconds / (15 * 60)); // 15 minutos como referencia

  // Penalización por errores y pistas
  const errorPenalty = errorsCount * 10;
  const hintPenalty = hintsUsed * 20;

  // Cálculo final
  const finalScore = Math.max(
    0,
    Math.floor(basePoints * timeFactor) - errorPenalty - hintPenalty
  );

  return finalScore;
};

// Funciones de navegación dentro del crucigrama
const findNextCell = (grid, currentRow, currentCol, direction) => {
  const maxRow = grid.length;
  const maxCol = grid[0].length;

  if (direction === 'across') {
    // Buscar la siguiente celda horizontal
    let nextCol = currentCol + 1;
    while (nextCol < maxCol) {
      if (grid[currentRow][nextCol]) {
        return { row: currentRow, col: nextCol };
      }
      nextCol++;
    }

    // Si llegamos al final de la fila, intentar la siguiente fila
    let nextRow = currentRow + 1;
    while (nextRow < maxRow) {
      for (let col = 0; col < maxCol; col++) {
        if (grid[nextRow][col]) {
          return { row: nextRow, col };
        }
      }
      nextRow++;
    }
  } else {
    // Buscar la siguiente celda vertical
    let nextRow = currentRow + 1;
    while (nextRow < maxRow) {
      if (grid[nextRow] && grid[nextRow][currentCol]) {
        return { row: nextRow, col: currentCol };
      }
      nextRow++;
    }

    // Si llegamos al final de la columna, intentar la siguiente columna
    let nextCol = currentCol + 1;
    while (nextCol < maxCol) {
      for (let row = 0; row < maxRow; row++) {
        if (grid[row][nextCol]) {
          return { row, col: nextCol };
        }
      }
      nextCol++;
    }
  }

  // Si no hay más celdas, volver al inicio
  for (let row = 0; row < maxRow; row++) {
    for (let col = 0; col < maxCol; col++) {
      if (grid[row][col]) {
        return { row, col };
      }
    }
  }

  return { row: currentRow, col: currentCol };
};

// Funciones de validación
const validatePuzzleCompletion = grid => {
  return grid.every(row =>
    row.every(cell => {
      if (!cell) return true; // Ignorar celdas bloqueadas
      return (
        cell.value && cell.value.toUpperCase() === cell.solution.toUpperCase()
      );
    })
  );
};

const validateWord = (grid, wordCells) => {
  return wordCells.every(({ row, col }) => {
    const cell = grid[row][col];
    return (
      cell &&
      cell.value &&
      cell.value.toUpperCase() === cell.solution.toUpperCase()
    );
  });
};

// Función para encontrar todas las celdas de una palabra
const getWordCells = (grid, number, direction) => {
  // Primero encontramos la celda inicial con el número
  let startCell = null;
  let startRow = -1;
  let startCol = -1;

  // Buscar la celda inicial
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const cell = grid[row][col];
      if (cell && cell.number === number) {
        startCell = cell;
        startRow = row;
        startCol = col;
        break;
      }
    }
    if (startCell) break;
  }

  if (!startCell) return [];

  // Recolectar celdas de la palabra
  const wordCells = [{ row: startRow, col: startCol }];

  if (direction === 'across') {
    // Recorrer horizontalmente
    let col = startCol + 1;
    while (col < grid[startRow].length && grid[startRow][col]) {
      wordCells.push({ row: startRow, col });
      col++;
    }
  } else {
    // Recorrer verticalmente
    let row = startRow + 1;
    while (row < grid.length && grid[row] && grid[row][startCol]) {
      wordCells.push({ row, col: startCol });
      row++;
    }
  }

  return wordCells;
};

// Sistema de pistas
const getHint = (grid, row, col) => {
  if (!grid[row][col]) return null;
  return grid[row][col].solution;
};

// Para generar sugerencias de palabras en caso de que el usuario se atasque
const suggestWord = (clue, length) => {
  // En una implementación real, esto podría conectarse a una API o base de datos
  // de palabras cruzadas. Aquí simplemente devolvemos un mensaje genérico.
  return `Esta pista tiene ${length} letras.`;
};

// Exportamos todas las funciones y constantes
const GameLogic = {
  DIFFICULTY_LEVELS,
  calculateScore,
  findNextCell,
  validatePuzzleCompletion,
  validateWord,
  getWordCells,
  getHint,
  suggestWord,

  // Método para verificar si una letra es correcta
  checkLetter: (grid, row, col, letter) => {
    if (!grid[row][col]) return false;
    return letter.toUpperCase() === grid[row][col].solution.toUpperCase();
  },

  // Método para obtener estadísticas del juego actual
  getGameStats: (grid, startTime, hintsUsed = 0) => {
    const totalCells = grid.flat().filter(cell => cell !== null).length;
    const filledCells = grid.flat().filter(cell => cell && cell.value).length;
    const correctCells = grid
      .flat()
      .filter(
        cell =>
          cell &&
          cell.value &&
          cell.value.toUpperCase() === cell.solution.toUpperCase()
      ).length;

    const progress = Math.floor((filledCells / totalCells) * 100);
    const accuracy =
      filledCells > 0 ? Math.floor((correctCells / filledCells) * 100) : 0;
    const timeElapsed = Math.floor((Date.now() - startTime) / 1000);

    return {
      progress,
      accuracy,
      timeElapsed,
      hintsUsed,
      totalCells,
      filledCells,
      correctCells,
    };
  },
};

export default GameLogic;
