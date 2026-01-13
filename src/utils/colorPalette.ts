/**
 * Paleta de colores para Joblyst
 * Sistema de 5 colores principales con 9 variantes cada uno
 * Diseñado para máxima consistencia visual
 */

export const colorPalette = {
  ink_black: {
    100: "#030609",
    200: "#050b11",
    300: "#08111a",
    400: "#0b1622",
    DEFAULT: "#0d1b2a",
    500: "#0d1b2a",
    600: "#234870",
    700: "#3875b6",
    800: "#74a3d4",
    900: "#bad1ea",
  },

  prussian_blue: {
    100: "#05080c",
    200: "#0b0f18",
    300: "#101724",
    400: "#161f30",
    DEFAULT: "#1b263b",
    500: "#1b263b",
    600: "#364c75",
    700: "#5172af",
    800: "#8ba1ca",
    900: "#c5d0e4",
  },

  dusk_blue: {
    100: "#0d1218",
    200: "#1a242f",
    300: "#273647",
    400: "#34485f",
    DEFAULT: "#415a77",
    500: "#415a77",
    600: "#587aa1",
    700: "#819bb9",
    800: "#abbcd1",
    900: "#d5dee8",
  },

  dusty_denim: {
    100: "#161c23",
    200: "#2c3746",
    300: "#425369",
    400: "#586f8d",
    DEFAULT: "#778da9",
    500: "#778da9",
    600: "#91a2ba",
    700: "#acbacb",
    800: "#c8d1dc",
    900: "#e3e8ee",
  },

  alabaster_grey: {
    100: "#2e2f2a",
    200: "#5b5e53",
    300: "#898c7e",
    400: "#b4b6ad",
    DEFAULT: "#e0e1dd",
    500: "#e0e1dd",
    600: "#e5e6e3",
    700: "#ececea",
    800: "#f2f3f1",
    900: "#f9f9f8",
  },
};

/**
 * Tokens de color para componentes específicos
 * Usa estos tokens para mantener consistencia en toda la app
 */
export const colorTokens = {
  // Fondos
  backgrounds: {
    primary: "bg-ink-black-500 dark:bg-ink-black-500",
    secondary: "bg-prussian-blue-500 dark:bg-prussian-blue-500",
    tertiary: "bg-dusk-blue-500 dark:bg-dusk-blue-500",
    light: "bg-alabaster-grey-900 dark:bg-ink-black-600",
  },

  // Texto
  text: {
    primary: "text-ink-black-500 dark:text-alabaster-grey-500",
    secondary: "text-dusk-blue-500 dark:text-dusty-denim-600",
    muted: "text-dusty-denim-500 dark:text-dusty-denim-600",
    light: "text-alabaster-grey-500 dark:text-alabaster-grey-900",
  },

  // Bordes
  borders: {
    primary: "border-prussian-blue-500 dark:border-prussian-blue-700",
    secondary: "border-dusk-blue-500 dark:border-dusk-blue-700",
    light: "border-dusty-denim-300 dark:border-dusk-blue-600",
  },

  // Status
  status: {
    applied:
      "bg-prussian-blue-100 dark:bg-prussian-blue-900 text-ink-black-500 dark:text-alabaster-grey-500",
    interview:
      "bg-dusty-denim-100 dark:bg-dusty-denim-900 text-ink-black-500 dark:text-alabaster-grey-500",
    rejected:
      "bg-dusk-blue-100 dark:bg-dusk-blue-900 text-ink-black-500 dark:text-alabaster-grey-500",
    offer:
      "bg-dusk-blue-100 dark:bg-dusk-blue-900 text-ink-black-500 dark:text-alabaster-grey-500",
  },

  // Botones
  buttons: {
    primary:
      "bg-prussian-blue-600 dark:bg-prussian-blue-600 text-alabaster-grey-900 dark:text-alabaster-grey-900 hover:bg-prussian-blue-700 dark:hover:bg-prussian-blue-700",
    secondary:
      "bg-dusk-blue-600 dark:bg-dusk-blue-600 text-alabaster-grey-900 dark:text-alabaster-grey-900 hover:bg-dusk-blue-700 dark:hover:bg-dusk-blue-700",
    ghost:
      "text-prussian-blue-600 dark:text-dusk-blue-600 hover:bg-prussian-blue-100 dark:hover:bg-prussian-blue-900",
  },

  // Inputs
  inputs: {
    border: "border-dusty-denim-300 dark:border-dusk-blue-600",
    background: "bg-white dark:bg-prussian-blue-500",
    text: "text-ink-black-500 dark:text-alabaster-grey-500",
  },

  // Skeleton loaders
  skeleton: {
    light: "bg-dusty-denim-200 dark:bg-dusk-blue-600",
    base: "bg-dusty-denim-300 dark:bg-dusk-blue-700",
  },
};
