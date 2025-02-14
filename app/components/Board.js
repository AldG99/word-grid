import React from 'react';
import { View, StyleSheet } from 'react-native';
import Cell from './Cell';

const Board = ({ puzzle, onCellPress }) => {
  if (!puzzle || !puzzle.grid) {
    return null;
  }

  return (
    <View style={styles.board}>
      {puzzle.grid.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.row}>
          {row.map((cell, colIndex) => (
            <Cell
              key={`cell-${rowIndex}-${colIndex}`}
              value={cell ? cell.value : ''}
              number={cell ? cell.number : null}
              isBlocked={!cell}
              isSelected={cell ? cell.isSelected : false}
              isActive={cell ? cell.isActive : false}
              onPress={() => cell && onCellPress(rowIndex, colIndex)}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    padding: 10,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default Board;
