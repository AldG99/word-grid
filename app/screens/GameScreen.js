import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  Modal,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Board from '../components/Board';
import Keyboard from '../components/Keyboard';
import Clues from '../components/Clues';
import Colors from '../constants/colors';
import Layout from '../constants/layout';
import GameLogic from '../utils/gameLogic';
import Storage from '../utils/storage';

const GameScreen = () => {
  const initialPuzzleState = {
    grid: [
      [
        { value: '', number: 1, solution: 'C' },
        { value: '', number: 2, solution: 'A' },
        { value: '', solution: 'S' },
        { value: '', solution: 'A' },
      ],
      [
        { value: '', number: 3, solution: 'O' },
        { value: '', solution: 'S' },
        { value: '', solution: 'O' },
        null,
      ],
      [
        { value: '', number: 4, solution: 'S' },
        { value: '', solution: 'O' },
        { value: '', solution: 'L' },
        null,
      ],
      [{ value: '', solution: 'A' }, null, null, null],
    ],
    clues: {
      across: [
        { number: 1, clue: 'Lugar donde vives (4 letras)' },
        { number: 3, clue: 'Animal que camina sobre sus huesos (3 letras)' },
        { number: 4, clue: 'Astro que nos da luz (3 letras)' },
      ],
      down: [
        { number: 1, clue: 'Objeto o elemento que existe (4 letras)' },
        { number: 2, clue: 'Parte dura del esqueleto (4 letras)' },
      ],
    },
  };

  // Estado para tracking del tiempo
  const [gameStartTime] = useState(Date.now());
  const [gameId] = useState(`puzzle-${Date.now()}`); // ID único para este juego
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hintsRemaining, setHintsRemaining] = useState(2); // Limitamos a 2 pistas

  // Estados existentes
  const [puzzle, setPuzzle] = useState(initialPuzzleState);
  const [selectedCell, setSelectedCell] = useState({ row: 0, col: 0 });
  const [direction, setDirection] = useState('across');
  const [selectedClue, setSelectedClue] = useState({
    number: 1,
    direction: 'across',
  });
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [gameStats, setGameStats] = useState(null);

  // Cargar partida guardada al iniciar
  useEffect(() => {
    const loadSavedGame = async () => {
      const savedGame = await Storage.loadGameProgress();
      if (savedGame && savedGame.puzzleState) {
        setPuzzle(savedGame.puzzleState);

        // Restaurar estado de pistas si existe
        if (savedGame.hintsUsed !== undefined) {
          setHintsUsed(savedGame.hintsUsed);
          setHintsRemaining(Math.max(0, 2 - savedGame.hintsUsed));
        }
      }
    };

    loadSavedGame();
  }, []);

  // Guardar progreso automáticamente cuando cambia el estado
  useEffect(() => {
    const saveGame = async () => {
      const timeElapsed = Math.floor((Date.now() - gameStartTime) / 1000);
      await Storage.saveGameProgress(gameId, puzzle, timeElapsed, hintsUsed);
    };

    saveGame();
  }, [puzzle, gameId, gameStartTime, hintsUsed]);

  // Función modificada para resetear el juego
  const resetGame = () => {
    setPuzzle(initialPuzzleState);
    setSelectedCell({ row: 0, col: 0 });
    setDirection('across');
    setSelectedClue({ number: 1, direction: 'across' });
    setShowCompletionModal(false);
    setHintsUsed(0);
    setHintsRemaining(2); // Restaurar las 2 pistas disponibles
  };

  const handleCluePress = (number, dir) => {
    setDirection(dir);
    setSelectedClue({ number, direction: dir });

    // Find first cell of selected clue
    for (let row = 0; row < puzzle.grid.length; row++) {
      for (let col = 0; col < puzzle.grid[row].length; col++) {
        const cell = puzzle.grid[row][col];
        if (cell && cell.number === number) {
          setSelectedCell({ row, col });
          return;
        }
      }
    }
  };

  const handleCellPress = (rowIndex, colIndex) => {
    if (puzzle.grid[rowIndex][colIndex]) {
      if (rowIndex === selectedCell.row && colIndex === selectedCell.col) {
        const newDirection = direction === 'across' ? 'down' : 'across';
        setDirection(newDirection);

        const cell = puzzle.grid[rowIndex][colIndex];
        if (cell.number) {
          setSelectedClue({ number: cell.number, direction: newDirection });
        }
      } else {
        setSelectedCell({ row: rowIndex, col: colIndex });

        const cell = puzzle.grid[rowIndex][colIndex];
        if (cell.number) {
          setSelectedClue({ number: cell.number, direction });
        }
      }
    }
  };

  // Usar GameLogic para la navegación entre celdas
  const moveToNextCell = () => {
    const nextPosition = GameLogic.findNextCell(
      puzzle.grid,
      selectedCell.row,
      selectedCell.col,
      direction
    );
    setSelectedCell(nextPosition);
  };

  const moveToPreviousCell = () => {
    const { row, col } = selectedCell;
    if (direction === 'across') {
      let prevCol = col - 1;
      while (prevCol >= 0) {
        if (puzzle.grid[row][prevCol]) {
          setSelectedCell({ row, col: prevCol });
          return;
        }
        prevCol--;
      }
    } else {
      let prevRow = row - 1;
      while (prevRow >= 0) {
        if (puzzle.grid[prevRow][col]) {
          setSelectedCell({ row: prevRow, col });
          return;
        }
        prevRow--;
      }
    }
  };

  const handleKeyPress = key => {
    if (!puzzle.grid[selectedCell.row][selectedCell.col]) return;

    const newPuzzle = {
      ...puzzle,
      grid: puzzle.grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          if (rowIndex === selectedCell.row && colIndex === selectedCell.col) {
            if (key === '⌫') {
              if (cell.value === '') {
                moveToPreviousCell();
              }
              return { ...cell, value: '' };
            } else {
              return { ...cell, value: key.toUpperCase() };
            }
          }
          return cell;
        })
      ),
    };

    setPuzzle(newPuzzle);

    if (key !== '⌫') {
      moveToNextCell();
      checkWin(newPuzzle.grid);
    }
  };

  // Comprobar victoria usando GameLogic
  const checkWin = grid => {
    const isComplete = GameLogic.validatePuzzleCompletion(grid);

    if (isComplete) {
      const timeElapsed = Math.floor((Date.now() - gameStartTime) / 1000);
      const stats = GameLogic.getGameStats(grid, gameStartTime, hintsUsed);

      // Calcular puntuación final
      const score = GameLogic.calculateScore(
        timeElapsed,
        GameLogic.DIFFICULTY_LEVELS.MEDIUM, // Ajustar según el puzzle
        0, // Contar errores si los tienes
        hintsUsed
      );

      const finalStats = {
        ...stats,
        score,
        difficulty: GameLogic.DIFFICULTY_LEVELS.MEDIUM,
      };

      setGameStats(finalStats);

      // Guardar estadísticas y puntuación
      Storage.saveGameStats(gameId, finalStats);

      setShowCompletionModal(true);
    }
  };

  // Función para obtener pista (modificada para limitar a 2 pistas)
  const getHint = () => {
    // Verificar si quedan pistas disponibles
    if (hintsRemaining <= 0) {
      Alert.alert(
        'Sin pistas disponibles',
        'Has agotado tus 2 pistas para este crucigrama.',
        [{ text: 'Entendido', style: 'default' }]
      );
      return;
    }

    // Mostrar confirmación antes de usar la pista
    Alert.alert(
      '¿Usar pista?',
      `Te quedan ${hintsRemaining} ${
        hintsRemaining === 1 ? 'pista' : 'pistas'
      }. ¿Quieres usarla?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Usar pista',
          style: 'default',
          onPress: () => {
            const { row, col } = selectedCell;
            if (puzzle.grid[row][col]) {
              const solution = GameLogic.getHint(puzzle.grid, row, col);

              // Actualizar el puzzle con la pista
              const newPuzzle = {
                ...puzzle,
                grid: puzzle.grid.map((gridRow, rowIndex) =>
                  gridRow.map((cell, colIndex) => {
                    if (rowIndex === row && colIndex === col) {
                      return { ...cell, value: solution };
                    }
                    return cell;
                  })
                ),
              };

              setPuzzle(newPuzzle);
              setHintsUsed(prev => prev + 1);
              setHintsRemaining(prev => prev - 1); // Reducir el número de pistas disponibles
              moveToNextCell();

              // Verificar si la pista completó el crucigrama
              checkWin(newPuzzle.grid);
            }
          },
        },
      ]
    );
  };

  // Componente para mostrar el contador de pistas
  const HintCounter = () => (
    <View style={styles.hintCounterContainer}>
      <Text style={styles.hintCounterText}>Pistas: {hintsRemaining}/2</Text>
    </View>
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: Colors.MAIN_THEME.background },
      ]}
    >
      <View
        style={[
          styles.gameContainer,
          Layout.getOrientationStyles().gameContainer,
        ]}
      >
        <Clues
          clues={puzzle.clues}
          onCluePress={handleCluePress}
          selectedClue={selectedClue}
        />
        <Board
          puzzle={{
            ...puzzle,
            grid: puzzle.grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => {
                if (!cell) return null;
                return {
                  ...cell,
                  isSelected:
                    rowIndex === selectedCell.row &&
                    colIndex === selectedCell.col,
                  isActive:
                    direction === 'across'
                      ? rowIndex === selectedCell.row
                      : colIndex === selectedCell.col,
                };
              })
            ),
          }}
          onCellPress={handleCellPress}
        />

        {/* Contador de pistas */}
        <HintCounter />

        {/* Botón de pista con estilo condicional según disponibilidad */}
        <TouchableOpacity
          style={[
            styles.hintButton,
            hintsRemaining <= 0 && styles.disabledHintButton,
          ]}
          onPress={getHint}
          disabled={hintsRemaining <= 0}
        >
          <Text style={styles.hintButtonText}>
            {hintsRemaining > 0 ? 'Usar pista' : 'Sin pistas'}
          </Text>
        </TouchableOpacity>

        <Keyboard onKeyPress={handleKeyPress} />

        <Modal
          animationType="fade"
          transparent={true}
          visible={showCompletionModal}
          onRequestClose={() => setShowCompletionModal(false)}
        >
          <View
            style={[
              styles.modalContainer,
              { backgroundColor: Colors.UI.modalBackground },
            ]}
          >
            <View
              style={[
                styles.modalContent,
                { backgroundColor: Colors.UI.modalContent },
              ]}
            >
              <Text style={styles.modalTitle}>¡Crucigrama Completado!</Text>
              <Text style={styles.modalText}>
                ¡Felicitaciones! Has resuelto el crucigrama correctamente.
              </Text>

              {/* Mostrar estadísticas */}
              {gameStats && (
                <View style={styles.statsContainer}>
                  <Text style={styles.statsTitle}>Estadísticas:</Text>
                  <Text>Tiempo: {gameStats.timeElapsed} segundos</Text>
                  <Text>Precisión: {gameStats.accuracy}%</Text>
                  <Text>Pistas usadas: {gameStats.hintsUsed}/2</Text>
                  <Text style={styles.scoreText}>
                    Puntuación: {gameStats.score}
                  </Text>
                </View>
              )}

              <TouchableOpacity
                style={[
                  styles.acceptButton,
                  { backgroundColor: Colors.MAIN_THEME.primary },
                ]}
                onPress={resetGame}
              >
                <Text style={styles.acceptButtonText}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.MAIN_THEME.background,
  },
  gameContainer: {
    flex: 1,
    justifyContent: 'space-between',
    padding: Layout.SPACING.M,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.UI.modalBackground,
  },
  modalContent: {
    backgroundColor: Colors.UI.modalContent,
    padding: Layout.SPACING.L,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
    minWidth: 300,
  },
  modalTitle: {
    fontSize: Layout.FONT_SIZES.XXL,
    fontWeight: 'bold',
    marginBottom: 15,
    color: Colors.MAIN_THEME.primary,
  },
  modalText: {
    fontSize: Layout.FONT_SIZES.MEDIUM,
    textAlign: 'center',
    marginBottom: Layout.SPACING.M,
  },
  statsContainer: {
    marginVertical: Layout.SPACING.M,
    width: '100%',
    padding: Layout.SPACING.M,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  statsTitle: {
    fontSize: Layout.FONT_SIZES.LARGE,
    fontWeight: '600',
    marginBottom: Layout.SPACING.S,
  },
  scoreText: {
    fontSize: Layout.FONT_SIZES.LARGE,
    fontWeight: 'bold',
    marginTop: Layout.SPACING.S,
    color: Colors.MAIN_THEME.primary,
  },
  acceptButton: {
    backgroundColor: Colors.MAIN_THEME.primary,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: Layout.SPACING.M,
  },
  acceptButtonText: {
    color: 'white',
    fontSize: Layout.FONT_SIZES.LARGE,
    fontWeight: '600',
  },
  hintButton: {
    backgroundColor: Colors.MAIN_THEME.secondary,
    padding: Layout.SPACING.M,
    borderRadius: 8,
    alignSelf: 'center',
    marginVertical: Layout.SPACING.M,
    minWidth: 120,
    alignItems: 'center',
  },
  disabledHintButton: {
    backgroundColor: '#cccccc',
  },
  hintButtonText: {
    color: 'white',
    fontSize: Layout.FONT_SIZES.MEDIUM,
    fontWeight: '600',
  },
  hintCounterContainer: {
    alignSelf: 'center',
    marginVertical: Layout.SPACING.S,
    paddingHorizontal: Layout.SPACING.M,
    paddingVertical: Layout.SPACING.XS,
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  hintCounterText: {
    fontSize: Layout.FONT_SIZES.SMALL,
    fontWeight: '600',
    color: Colors.MAIN_THEME.primary,
  },
});

export default GameScreen;
