import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import Colors from '../constants/colors';
import Layout from '../constants/layout';
import Storage from '../utils/storage';

const HomeScreen = ({ navigation }) => {
  const [preferences, setPreferences] = useState({
    darkMode: false,
    soundEffects: true,
  });

  // Cargar preferencias del usuario
  useEffect(() => {
    const loadPreferences = async () => {
      const userPrefs = await Storage.getUserPreferences();
      if (userPrefs) {
        setPreferences(userPrefs);
      }
    };

    loadPreferences();
  }, []);

  // Guardar cambios en preferencias
  const updatePreference = async (key, value) => {
    const newPrefs = { ...preferences, [key]: value };
    setPreferences(newPrefs);
    await Storage.saveUserPreferences(newPrefs);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: preferences.darkMode
            ? '#121212'
            : Colors.MAIN_THEME.background,
        },
      ]}
    >
      <Text
        style={[
          styles.title,
          { color: preferences.darkMode ? '#FFFFFF' : '#000000' },
        ]}
      >
        Crucigrama
      </Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: Colors.MAIN_THEME.primary }]}
        onPress={() => navigation.navigate('Game')}
      >
        <Text style={styles.buttonText}>Comenzar Juego</Text>
      </TouchableOpacity>

      {/* Opciones de preferencias */}
      <View style={styles.preferencesContainer}>
        <View style={styles.preferenceRow}>
          <Text
            style={[
              styles.preferenceText,
              { color: preferences.darkMode ? '#FFFFFF' : '#000000' },
            ]}
          >
            Modo Oscuro
          </Text>
          <Switch
            value={preferences.darkMode}
            onValueChange={value => updatePreference('darkMode', value)}
          />
        </View>

        <View style={styles.preferenceRow}>
          <Text
            style={[
              styles.preferenceText,
              { color: preferences.darkMode ? '#FFFFFF' : '#000000' },
            ]}
          >
            Efectos de Sonido
          </Text>
          <Switch
            value={preferences.soundEffects}
            onValueChange={value => updatePreference('soundEffects', value)}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: Layout.FONT_SIZES.TITLE,
    marginBottom: Layout.SPACING.XXL,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: Colors.MAIN_THEME.primary,
    padding: Layout.SPACING.L,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: Layout.FONT_SIZES.LARGE,
    fontWeight: '600',
  },
  preferencesContainer: {
    marginTop: Layout.SPACING.XXL,
    width: '80%',
  },
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.SPACING.M,
  },
  preferenceText: {
    fontSize: Layout.FONT_SIZES.MEDIUM,
  },
});

export default HomeScreen;
