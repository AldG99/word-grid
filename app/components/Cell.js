import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Colors from '../constants/colors';
import Layout from '../constants/layout';

const Cell = ({ value, number, isBlocked, isSelected, isActive, onPress }) => {
  return (
    <TouchableOpacity
      style={[
        styles.cell,
        isBlocked && styles.blocked,
        isSelected && styles.selected,
        isActive && styles.active,
      ]}
      onPress={onPress}
      disabled={isBlocked}
    >
      {number && <Text style={styles.number}>{number}</Text>}
      <Text style={styles.letter}>{value}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cell: {
    width: Layout.PUZZLE_DIMENSIONS.getCellSize(),
    height: Layout.PUZZLE_DIMENSIONS.getCellSize(),
    borderWidth: 1,
    borderColor: Colors.BOARD.cellBorder,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 1,
    backgroundColor: Colors.BOARD.cellBackground,
  },
  blocked: {
    backgroundColor: Colors.BOARD.blockedCell,
  },
  selected: {
    backgroundColor: Colors.BOARD.selectedCell,
  },
  active: {
    backgroundColor: Colors.BOARD.activeWord,
  },
  number: {
    position: 'absolute',
    top: 2,
    left: 2,
    fontSize: Layout.FONT_SIZES.TINY,
    color: Colors.BOARD.cellNumberText,
  },
  letter: {
    fontSize: Layout.FONT_SIZES.XL,
    color: Colors.BOARD.cellText,
  },
});

export default Cell;
