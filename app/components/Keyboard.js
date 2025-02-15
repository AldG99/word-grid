import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const Keyboard = ({ onKeyPress }) => {
  const letters = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
  ];

  return (
    <View style={styles.keyboard}>
      {letters.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.row}>
          {row.map(key => (
            <TouchableOpacity
              key={key}
              style={[styles.key, key === '⌫' && styles.specialKey]}
              onPress={() => onKeyPress(key)}
            >
              <Text style={styles.keyText}>{key}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  keyboard: {
    padding: 5,
    backgroundColor: '#f0f0f0',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 5,
  },
  key: {
    width: 30,
    height: 40,
    backgroundColor: '#fff',
    margin: 2,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  specialKey: {
    width: 50,
    backgroundColor: '#e0e0e0',
  },
  keyText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default Keyboard;
