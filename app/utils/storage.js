// Storage.js - Módulo para manejar el almacenamiento local de crucigramas

import AsyncStorage from '@react-native-async-storage/async-storage';

// Constantes para las claves de almacenamiento
const STORAGE_KEYS = {
  SAVED_GAMES: 'crossword_saved_games',
  CURRENT_GAME: 'crossword_current_game',
  GAME_STATS: 'crossword_game_stats',
  USER_PREFERENCES: 'crossword_user_preferences',
  HIGH_SCORES: 'crossword_high_scores',
};

// Guardar un juego en progreso
const saveGameProgress = async (
  gameId,
  puzzleState,
  timeElapsed,
  hintsUsed = 0
) => {
  try {
    // Crear objeto de guardado
    const saveData = {
      gameId,
      puzzleState,
      lastPlayed: new Date().toISOString(),
      timeElapsed,
      hintsUsed,
    };

    // Guardar como juego actual
    await AsyncStorage.setItem(
      STORAGE_KEYS.CURRENT_GAME,
      JSON.stringify(saveData)
    );

    // Actualizar lista de juegos guardados
    const savedGamesJson = await AsyncStorage.getItem(STORAGE_KEYS.SAVED_GAMES);
    const savedGames = savedGamesJson ? JSON.parse(savedGamesJson) : [];

    // Verificar si ya existe este juego y actualizarlo
    const existingGameIndex = savedGames.findIndex(
      game => game.gameId === gameId
    );
    if (existingGameIndex >= 0) {
      savedGames[existingGameIndex] = saveData;
    } else {
      savedGames.push(saveData);
    }

    // Guardar lista actualizada
    await AsyncStorage.setItem(
      STORAGE_KEYS.SAVED_GAMES,
      JSON.stringify(savedGames)
    );

    return true;
  } catch (error) {
    console.error('Error al guardar progreso del juego:', error);
    return false;
  }
};

// Cargar un juego en progreso
const loadGameProgress = async (gameId = null) => {
  try {
    // Si no se especifica ID, cargar el juego actual
    if (!gameId) {
      const currentGameJson = await AsyncStorage.getItem(
        STORAGE_KEYS.CURRENT_GAME
      );
      if (currentGameJson) {
        return JSON.parse(currentGameJson);
      }
      return null;
    }

    // Buscar juego específico en la lista de guardados
    const savedGamesJson = await AsyncStorage.getItem(STORAGE_KEYS.SAVED_GAMES);
    if (!savedGamesJson) return null;

    const savedGames = JSON.parse(savedGamesJson);
    const game = savedGames.find(g => g.gameId === gameId);

    return game || null;
  } catch (error) {
    console.error('Error al cargar progreso del juego:', error);
    return null;
  }
};

// Obtener lista de juegos guardados
const getSavedGames = async () => {
  try {
    const savedGamesJson = await AsyncStorage.getItem(STORAGE_KEYS.SAVED_GAMES);
    if (!savedGamesJson) return [];

    return JSON.parse(savedGamesJson);
  } catch (error) {
    console.error('Error al obtener juegos guardados:', error);
    return [];
  }
};

// Eliminar un juego guardado
const deleteSavedGame = async gameId => {
  try {
    // Obtener lista actual
    const savedGamesJson = await AsyncStorage.getItem(STORAGE_KEYS.SAVED_GAMES);
    if (!savedGamesJson) return true;

    const savedGames = JSON.parse(savedGamesJson);
    const updatedGames = savedGames.filter(game => game.gameId !== gameId);

    // Guardar lista actualizada
    await AsyncStorage.setItem(
      STORAGE_KEYS.SAVED_GAMES,
      JSON.stringify(updatedGames)
    );

    // Si era el juego actual, limpiar
    const currentGameJson = await AsyncStorage.getItem(
      STORAGE_KEYS.CURRENT_GAME
    );
    if (currentGameJson) {
      const currentGame = JSON.parse(currentGameJson);
      if (currentGame.gameId === gameId) {
        await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_GAME);
      }
    }

    return true;
  } catch (error) {
    console.error('Error al eliminar juego guardado:', error);
    return false;
  }
};

// Guardar estadísticas del juego
const saveGameStats = async (gameId, stats) => {
  try {
    // Obtener estadísticas actuales
    const statsJson = await AsyncStorage.getItem(STORAGE_KEYS.GAME_STATS);
    const allStats = statsJson ? JSON.parse(statsJson) : {};

    // Añadir o actualizar estadísticas para este juego
    allStats[gameId] = {
      ...stats,
      completedAt: new Date().toISOString(),
    };

    // Guardar estadísticas actualizadas
    await AsyncStorage.setItem(
      STORAGE_KEYS.GAME_STATS,
      JSON.stringify(allStats)
    );

    // Actualizar puntuaciones altas si corresponde
    await updateHighScore(gameId, stats.score, stats.difficulty);

    return true;
  } catch (error) {
    console.error('Error al guardar estadísticas:', error);
    return false;
  }
};

// Obtener estadísticas de un juego
const getGameStats = async (gameId = null) => {
  try {
    const statsJson = await AsyncStorage.getItem(STORAGE_KEYS.GAME_STATS);
    if (!statsJson) return gameId ? null : {};

    const allStats = JSON.parse(statsJson);
    return gameId ? allStats[gameId] || null : allStats;
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return gameId ? null : {};
  }
};

// Guardar preferencias de usuario
const saveUserPreferences = async preferences => {
  try {
    const currentPrefsJson = await AsyncStorage.getItem(
      STORAGE_KEYS.USER_PREFERENCES
    );
    const currentPrefs = currentPrefsJson ? JSON.parse(currentPrefsJson) : {};

    // Mezclar con preferencias existentes
    const updatedPrefs = { ...currentPrefs, ...preferences };

    await AsyncStorage.setItem(
      STORAGE_KEYS.USER_PREFERENCES,
      JSON.stringify(updatedPrefs)
    );
    return true;
  } catch (error) {
    console.error('Error al guardar preferencias:', error);
    return false;
  }
};

// Obtener preferencias de usuario
const getUserPreferences = async () => {
  try {
    const prefsJson = await AsyncStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    return prefsJson
      ? JSON.parse(prefsJson)
      : {
          // Valores predeterminados
          darkMode: false,
          soundEffects: true,
          autoCheck: false,
          language: 'es',
          fontSize: 'medium',
        };
  } catch (error) {
    console.error('Error al obtener preferencias:', error);
    return null;
  }
};

// Actualizar puntuaciones altas
const updateHighScore = async (gameId, score, difficulty) => {
  try {
    const highScoresJson = await AsyncStorage.getItem(STORAGE_KEYS.HIGH_SCORES);
    const highScores = highScoresJson
      ? JSON.parse(highScoresJson)
      : {
          byDifficulty: {
            fácil: [],
            medio: [],
            difícil: [],
            experto: [],
          },
          byGame: {},
        };

    // Actualizar puntuación por dificultad
    if (difficulty && score) {
      const difficultyScores = highScores.byDifficulty[difficulty] || [];
      difficultyScores.push({
        gameId,
        score,
        date: new Date().toISOString(),
      });

      // Ordenar y mantener solo las 10 mejores
      highScores.byDifficulty[difficulty] = difficultyScores
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
    }

    // Actualizar puntuación por juego
    if (gameId && score) {
      if (!highScores.byGame[gameId]) {
        highScores.byGame[gameId] = [];
      }

      highScores.byGame[gameId].push({
        score,
        date: new Date().toISOString(),
      });

      // Ordenar y mantener solo las 5 mejores
      highScores.byGame[gameId] = highScores.byGame[gameId]
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
    }

    await AsyncStorage.setItem(
      STORAGE_KEYS.HIGH_SCORES,
      JSON.stringify(highScores)
    );
    return true;
  } catch (error) {
    console.error('Error al actualizar puntuaciones altas:', error);
    return false;
  }
};

// Obtener puntuaciones altas
const getHighScores = async (difficulty = null, gameId = null) => {
  try {
    const highScoresJson = await AsyncStorage.getItem(STORAGE_KEYS.HIGH_SCORES);
    if (!highScoresJson) return null;

    const highScores = JSON.parse(highScoresJson);

    if (gameId) {
      return highScores.byGame[gameId] || [];
    }

    if (difficulty) {
      return highScores.byDifficulty[difficulty] || [];
    }

    return highScores;
  } catch (error) {
    console.error('Error al obtener puntuaciones altas:', error);
    return null;
  }
};

// Limpiar todos los datos (para depuración o reinicio)
const clearAllData = async () => {
  try {
    const keys = Object.values(STORAGE_KEYS);
    await AsyncStorage.multiRemove(keys);
    return true;
  } catch (error) {
    console.error('Error al limpiar datos:', error);
    return false;
  }
};

// Exportamos todas las funciones
const Storage = {
  STORAGE_KEYS,
  saveGameProgress,
  loadGameProgress,
  getSavedGames,
  deleteSavedGame,
  saveGameStats,
  getGameStats,
  saveUserPreferences,
  getUserPreferences,
  getHighScores,
  clearAllData,
};

export default Storage;
