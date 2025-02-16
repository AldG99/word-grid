import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const Clues = ({ clues, onCluePress, selectedClue }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Horizontales</Text>
        {clues.across.map(clue => (
          <TouchableOpacity
            key={`across-${clue.number}`}
            style={[
              styles.clueContainer,
              selectedClue?.number === clue.number &&
                selectedClue?.direction === 'across' &&
                styles.selectedClue,
            ]}
            onPress={() => onCluePress(clue.number, 'across')}
          >
            <Text style={styles.clueNumber}>{clue.number}.</Text>
            <Text style={styles.clueText}>{clue.clue}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Verticales</Text>
        {clues.down.map(clue => (
          <TouchableOpacity
            key={`down-${clue.number}`}
            style={[
              styles.clueContainer,
              selectedClue?.number === clue.number &&
                selectedClue?.direction === 'down' &&
                styles.selectedClue,
            ]}
            onPress={() => onCluePress(clue.number, 'down')}
          >
            <Text style={styles.clueNumber}>{clue.number}.</Text>
            <Text style={styles.clueText}>{clue.clue}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: 200,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  clueContainer: {
    flexDirection: 'row',
    padding: 8,
    borderRadius: 4,
  },
  selectedClue: {
    backgroundColor: '#e3f2fd',
  },
  clueNumber: {
    fontWeight: 'bold',
    marginRight: 5,
    minWidth: 25,
  },
  clueText: {
    flex: 1,
  },
});

export default Clues;
