import { useThemeContext } from "@/context/Theme";
import { Feather } from "@expo/vector-icons"
import { StyleSheet, Pressable, View, PressableProps, ColorValue, Text } from "react-native"
import ThemedText from "./ThemedText";
import { useCallback } from "react";

type FeatherFabProps = PressableProps & {
  icon: keyof typeof Feather.glyphMap;
  label?: string;
  size?: number;
  color?: ColorValue
}

export default function FeatherFab({
  size,
  icon,
  color,
  label,
  style,
  ...props
}: FeatherFabProps) {

  const { theme } = useThemeContext()

  const getStyles = useCallback(({
    hovered,
    pressed
  }: {
    hovered: boolean;
    pressed: boolean;
  }) => {

    const styleProps = typeof style === 'function'
      ? style({ hovered, pressed })
      : style

    return [
      { backgroundColor: theme.iconAccent },
      styles.container,
      styleProps,
    ]

  }, [style])

  return (
    <Pressable style={({ hovered, pressed }) => {
      return getStyles({ hovered, pressed })
    }
    }
      {...props}
    >
      {label && (
        <Text style={[{ color: '#FFFFFF' }]}>
          {label}
        </Text>
      )}
      <Feather
        name={icon}
        size={size}
        color={'#FFFFFF'}
        style={{ fontWeight: 'bold' }}
      />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    borderRadius: 36,
    width: 'auto',
    padding: 12,
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
})
