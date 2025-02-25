import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Alert,
  Text,
  Modal,
  TouchableOpacity,
} from 'react-native';
import Board from '../components/Board';
import Keyboard from '../components/Keyboard';
import Clues from '../components/Clues';

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

  const [puzzle, setPuzzle] = useState(initialPuzzleState);
  const [selectedCell, setSelectedCell] = useState({ row: 0, col: 0 });
  const [direction, setDirection] = useState('across');
  const [selectedClue, setSelectedClue] = useState({
    number: 1,
    direction: 'across',
  });
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const resetGame = () => {
    setPuzzle(initialPuzzleState);
    setSelectedCell({ row: 0, col: 0 });
    setDirection('across');
    setSelectedClue({ number: 1, direction: 'across' });
    setShowCompletionModal(false);
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

  const moveToNextCell = () => {
    const { row, col } = selectedCell;
    if (direction === 'across') {
      let nextCol = col + 1;
      while (nextCol < puzzle.grid[row].length) {
        if (puzzle.grid[row][nextCol]) {
          setSelectedCell({ row, col: nextCol });
          return;
        }
        nextCol++;
      }
    } else {
      let nextRow = row + 1;
      while (nextRow < puzzle.grid.length) {
        if (puzzle.grid[nextRow][col]) {
          setSelectedCell({ row: nextRow, col });
          return;
        }
        nextRow++;
      }
    }
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

  const checkWin = grid => {
    const isComplete = grid.every(row =>
      row.every(cell => {
        if (!cell) return true;
        return cell.value.toUpperCase() === cell.solution.toUpperCase();
      })
    );

    if (isComplete) {
      setShowCompletionModal(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.gameContainer}>
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
        <Keyboard onKeyPress={handleKeyPress} />

        <Modal
          animationType="fade"
          transparent={true}
          visible={showCompletionModal}
          onRequestClose={() => setShowCompletionModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>¡Crucigrama Completado!</Text>
              <Text style={styles.modalText}>
                ¡Felicitaciones! Has resuelto el crucigrama correctamente.
              </Text>
              <TouchableOpacity style={styles.acceptButton} onPress={resetGame}>
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
    backgroundColor: '#f5f5f5',
  },
  gameContainer: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
    minWidth: 300,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#007AFF',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  acceptButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  acceptButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default GameScreen;
