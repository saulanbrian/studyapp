import { useThemeContext } from '@/context/Theme'
import { forwardRef, useCallback } from 'react'
import { TouchableOpacity, TouchableOpacityProps, View } from 'react-native'

type ThemedButtonProps = TouchableOpacityProps & {
  color?: 'secondary' | 'error' | 'primary'
}

const ThemedButton = forwardRef<typeof TouchableOpacity, ThemedButtonProps>(
  ({ color, style, children, ...props }, ref) => {

    const { theme } = useThemeContext()

    const getThemeColor = useCallback(() => {
      switch (color) {
        case 'primary':
          return theme.primary
        case 'secondary':
          return theme.secondary
        case 'error':
          return theme.error
        default:
          return theme.primary
      }
    }, [color])

    return (
      <TouchableOpacity style={[{ backgroundColor: getThemeColor() }, style]} {...props}>
        {children}
      </TouchableOpacity>
    )
  })


export default ThemedButton
