import { StyleSheet } from 'react-native-unistyles'
import { radii } from './src/constants/ui/radii'
import { darkColors, lightColors } from './src/constants/ui/Colors'
import { spacing } from './src/constants/ui/spacing'


const NuetralThemeTokens = {
  radii,
  spacing
}

const lightTheme = {
  colors: lightColors,
  ...NuetralThemeTokens
}

const darkTheme = {
  colors: darkColors,
  ...NuetralThemeTokens
}

const appThemes = {
  light: lightTheme,
  dark: darkTheme
}

const breakpoints = {
  xs: 0,
  sm: 300,
  md: 500,
  lg: 800,
  xl: 1200
}

type AppBreakpoints = typeof breakpoints
type AppThemes = typeof appThemes

declare module 'react-native-unistyles' {
  export interface UnistylesThemes extends AppThemes { }
  export interface UnistylesBreakpoints extends AppBreakpoints { }
}

StyleSheet.configure({
  settings: {
    adaptiveThemes: true
  },
  breakpoints,
  themes: appThemes
})
