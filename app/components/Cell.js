import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

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
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 1,
    backgroundColor: '#fff',
  },
  blocked: {
    backgroundColor: '#333',
  },
  selected: {
    backgroundColor: '#e3f2fd',
  },
  active: {
    backgroundColor: '#bbdefb',
  },
  number: {
    position: 'absolute',
    top: 2,
    left: 2,
    fontSize: 10,
    color: '#666',
  },
  letter: {
    fontSize: 20,
    color: '#000',
  },
});

export default Cell;
