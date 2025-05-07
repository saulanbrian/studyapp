import Colors from "@/constants/Colors"
import React, { createContext, useContext } from "react"
import { useColorScheme } from "react-native"

type ThemeContextType = {
  theme: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    textPrimary: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    iconPrimary: string;
    iconSecondary: string;
    iconAccent: string;
  }
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export const useThemeContext = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('cannot use theme context outside theme cobtext provider')
  return context
}

const ThemeContextProvider = ({ children }: { children: React.ReactNode }) => {

  const color = useColorScheme()
  const theme = color == 'dark' ? Colors.dark : Colors.light


  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeContextProvider;
