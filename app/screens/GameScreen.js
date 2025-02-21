import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, Alert } from 'react-native';
import Board from '../components/Board';
import Keyboard from '../components/Keyboard';
import Clues from '../components/Clues';

const GameScreen = () => {
  const [puzzle, setPuzzle] = useState({
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
        { value: '', solution: 'S' },
        { value: '', solution: 'O' },
        null,
        { value: '', solution: 'L' },
      ],
      [
        null,
        { value: '', solution: 'A' },
        { value: '', solution: 'R' },
        { value: '', solution: 'A' },
      ],
    ],
    clues: {
      across: [
        { number: 1, clue: 'Lugar donde vives (4 letras)' },
        { number: 3, clue: 'Animal que camina sobre sus huesos (3 letras)' },
      ],
      down: [
        { number: 1, clue: 'Objeto o elemento que existe (4 letras)' },
        { number: 2, clue: 'Parte dura del esqueleto (4 letras)' },
      ],
    },
  });

  const [selectedCell, setSelectedCell] = useState({ row: 0, col: 0 });
  const [direction, setDirection] = useState('across');
  const [selectedClue, setSelectedClue] = useState({
    number: 1,
    direction: 'across',
  });

  const handleCluePress = (number, dir) => {
    setDirection(dir);
    setSelectedClue({ number, direction: dir });

    // Encontrar la primera celda de la pista seleccionada
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
        // Si presiona la misma celda, cambia la dirección
        const newDirection = direction === 'across' ? 'down' : 'across';
        setDirection(newDirection);

        // Actualizar la pista seleccionada
        const cell = puzzle.grid[rowIndex][colIndex];
        if (cell.number) {
          setSelectedClue({ number: cell.number, direction: newDirection });
        }
      } else {
        setSelectedCell({ row: rowIndex, col: colIndex });

        // Actualizar la pista seleccionada cuando se selecciona una nueva celda
        const cell = puzzle.grid[rowIndex][colIndex];
        if (cell.number) {
          setSelectedClue({ number: cell.number, direction });
        }

        // Encontrar la pista más cercana si la celda no tiene número
        if (!cell.number) {
          let foundClue = false;
          if (direction === 'across') {
            // Buscar el número más cercano a la izquierda
            for (let col = colIndex; col >= 0; col--) {
              const searchCell = puzzle.grid[rowIndex][col];
              if (searchCell && searchCell.number) {
                setSelectedClue({
                  number: searchCell.number,
                  direction: 'across',
                });
                foundClue = true;
                break;
              }
            }
          } else {
            // Buscar el número más cercano arriba
            for (let row = rowIndex; row >= 0; row--) {
              const searchCell = puzzle.grid[row][colIndex];
              if (searchCell && searchCell.number) {
                setSelectedClue({
                  number: searchCell.number,
                  direction: 'down',
                });
                foundClue = true;
                break;
              }
            }
          }
        }
      }
    }
  };

  const moveToNextCell = () => {
    const { row, col } = selectedCell;
    if (direction === 'across') {
      // Mover a la siguiente celda horizontal
      let nextCol = col + 1;
      while (nextCol < puzzle.grid[row].length) {
        if (puzzle.grid[row][nextCol]) {
          setSelectedCell({ row, col: nextCol });
          return;
        }
        nextCol++;
      }
    } else {
      // Mover a la siguiente celda vertical
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
      // Mover a la celda anterior horizontal
      let prevCol = col - 1;
      while (prevCol >= 0) {
        if (puzzle.grid[row][prevCol]) {
          setSelectedCell({ row, col: prevCol });
          return;
        }
        prevCol--;
      }
    } else {
      // Mover a la celda anterior vertical
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
              return { ...cell, value: key };
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
      Alert.alert(
        '¡Felicitaciones!',
        'Has completado el crucigrama correctamente.',
        [{ text: 'OK' }]
      );
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
});

export default GameScreen;
