// Colors.js - Módulo para manejar los colores del crucigrama

// Tema principal
const MAIN_THEME = {
  primary: '#007AFF', // Azul principal para botones y elementos destacados
  secondary: '#4CD964', // Verde para elementos secundarios o de éxito
  background: '#F5F5F5', // Fondo general de la aplicación
  error: '#FF3B30', // Rojo para errores
  warning: '#FFCC00', // Amarillo para advertencias
};

// Colores específicos para el tablero
const BOARD = {
  cellBackground: '#FFFFFF', // Fondo de celda estándar
  cellBorder: '#CCCCCC', // Borde de celda estándar
  cellText: '#000000', // Texto de celda (letras)
  cellNumberText: '#666666', // Texto para números de referencia
  blockedCell: '#333333', // Celdas bloqueadas (negras)
  selectedCell: '#E3F2FD', // Celda seleccionada
  activeWord: '#BBDEFB', // Palabra activa
  correctLetter: '#C8E6C9', // Letra correcta
  incorrectLetter: '#FFCDD2', // Letra incorrecta
};

// Colores para los elementos de UI
const UI = {
  modalBackground: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente para modales
  modalContent: '#FFFFFF', // Contenido del modal
  keyboardBackground: '#FFFFFF', // Fondo del teclado
  specialKeyBackground: '#E0E0E0', // Teclas especiales (borrar)
  clueText: '#333333', // Texto de pistas
  selectedClue: '#E3F2FD', // Pista seleccionada
};

// Funciones de utilidad para trabajar con colores
const adjustBrightness = (color, amount) => {
  // Convierte un color hex a RGB, ajusta el brillo y vuelve a hex
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const newR = Math.max(0, Math.min(255, r + amount));
  const newG = Math.max(0, Math.min(255, g + amount));
  const newB = Math.max(0, Math.min(255, b + amount));

  return `#${newR.toString(16).padStart(2, '0')}${newG
    .toString(16)
    .padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
};

// Exporta colores y utilidades
const Colors = {
  MAIN_THEME,
  BOARD,
  UI,
  adjustBrightness,

  // Métodos para temas
  getDarkTheme: () => {
    // Crea una versión oscura del tema
    return {
      MAIN_THEME: {
        ...MAIN_THEME,
        background: '#121212',
      },
      BOARD: {
        ...BOARD,
        cellBackground: '#1E1E1E',
        cellBorder: '#333333',
        cellText: '#FFFFFF',
        cellNumberText: '#BBBBBB',
        blockedCell: '#000000',
        selectedCell: '#1A3A5A',
        activeWord: '#103045',
      },
      UI: {
        ...UI,
        modalContent: '#1E1E1E',
        keyboardBackground: '#1E1E1E',
      },
    };
  },

  // Método para obtener colores basados en dificultad
  getDifficultyColor: difficulty => {
    switch (difficulty) {
      case 'fácil':
        return MAIN_THEME.secondary;
      case 'medio':
        return MAIN_THEME.primary;
      case 'difícil':
        return '#FF9500'; // Naranja
      case 'experto':
        return MAIN_THEME.error;
      default:
        return MAIN_THEME.primary;
    }
  },
};

export default Colors;
