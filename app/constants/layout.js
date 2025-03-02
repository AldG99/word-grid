// Layout.js - Módulo para manejar aspectos de diseño y dimensiones

import { Dimensions, Platform, StatusBar } from 'react-native';
import Colors from './colors';

// Obtener dimensiones de la pantalla
const window = Dimensions.get('window');
const screen = Dimensions.get('screen');

// Constantes para márgenes y espaciados
const SPACING = {
  XS: 2,
  S: 5,
  M: 10,
  L: 15,
  XL: 20,
  XXL: 30,
};

// Constantes para tamaños de texto
const FONT_SIZES = {
  TINY: 10,
  SMALL: 12,
  MEDIUM: 16,
  LARGE: 18,
  XL: 20,
  XXL: 24,
  TITLE: 32,
};

// Constantes para dimensiones de componentes del crucigrama
const PUZZLE_DIMENSIONS = {
  // Tamaños de celda para diferentes tamaños de pantalla
  getCellSize: () => {
    const { width } = window;
    // Adaptativo basado en el ancho de la pantalla
    if (width < 320) return 30; // Pantallas muy pequeñas
    if (width < 375) return 35; // Pantallas pequeñas (iPhone SE)
    if (width < 414) return 40; // Pantallas medianas (iPhone X/11 Pro)
    return 45; // Pantallas grandes
  },

  // Ajustar número de pistas visibles según el espacio disponible
  getCluesContainerHeight: () => {
    const { height } = window;
    return Math.min(200, height * 0.25); // Máximo 25% de la altura o 200px
  },

  // Dimensiones del teclado
  getKeyboardKeySize: () => {
    const { width } = window;
    // Anchura disponible dividida por número de teclas por fila (considerando márgenes)
    const availableWidth = width - SPACING.L * 2;
    return Math.min(Math.floor(availableWidth / 10) - SPACING.S, 40); // Máximo 40
  },
};

// Estilos comunes reutilizables
const COMMON_STYLES = {
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  roundedBox: {
    borderRadius: 8,
    padding: SPACING.M,
    backgroundColor: Colors.MAIN_THEME.background,
  },
  centeredContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeAreaContainer: {
    flex: 1,
    backgroundColor: Colors.MAIN_THEME.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
};

// Utilidades para responsive design
const isTablet = () => {
  const { width, height } = window;
  return (width >= 768 && height >= 768) || Platform.isPad;
};

const isLandscape = () => {
  const { width, height } = window;
  return width > height;
};

// Determinar densidad de texto según tamaño de crucigrama
const getTextScaleFactor = puzzleSize => {
  // Ajusta el tamaño del texto según el tamaño del crucigrama
  if (puzzleSize <= 5) return 1; // Crucigramas pequeños
  if (puzzleSize <= 10) return 0.9; // Crucigramas medianos
  if (puzzleSize <= 15) return 0.8; // Crucigramas grandes
  return 0.7; // Crucigramas muy grandes
};

// Exporta todas las utilidades y constantes
const Layout = {
  window,
  screen,
  SPACING,
  FONT_SIZES,
  PUZZLE_DIMENSIONS,
  COMMON_STYLES,
  isTablet,
  isLandscape,
  getTextScaleFactor,

  // Método para obtener estilos adaptados a la orientación
  getOrientationStyles: () => {
    const landscape = isLandscape();

    return {
      gameContainer: {
        flexDirection: landscape ? 'row' : 'column',
        justifyContent: 'space-between',
        padding: SPACING.M,
        flex: 1,
      },
      boardContainer: {
        flex: landscape ? 2 : undefined, // En landscape, el tablero ocupa más espacio
        alignItems: 'center',
        justifyContent: 'center',
      },
      controlsContainer: {
        flex: landscape ? 1 : undefined,
        marginLeft: landscape ? SPACING.L : 0,
        marginTop: landscape ? 0 : SPACING.L,
      },
    };
  },
};

export default Layout;
