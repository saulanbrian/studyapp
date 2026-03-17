import { useCallback, useRef, useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import ThemedText from "../ThemedText";
import ThemedView from "../ThemedView";
import { StyleSheet } from "react-native-unistyles";
import { darkColors } from "@/src/constants/ui/Colors";

const CODE_LENGTH = 8

export default function VerificationCodeInput({
  onChangeCode
}: { onChangeCode: (code: string) => void }) {

  const [rawCode, setRawCode] = useState('')
  const [code, setCode] = useState<string[]>(
    new Array(CODE_LENGTH).fill(null)
  )
  const inputRef = useRef<TextInput>(null)

  const handleCodeChange = useCallback((c: string) => {
    setRawCode(c)
    const unchangedCharsLength = code.length - c.split('').length
    setCode([
      ...c.split(''),
      ...new Array(unchangedCharsLength).fill(null)
    ])
    onChangeCode(c)
  }, [rawCode, code])

  return (
    <Pressable
      style={styles.container}
      onPress={() => {
        inputRef.current?.blur()
        setTimeout(() => {
          inputRef.current?.focus()
        }, 50)
      }}
    >
      <TextInput
        ref={inputRef}
        value={rawCode}
        onChangeText={handleCodeChange}
        maxLength={CODE_LENGTH}
        keyboardType={"numeric"}
        style={styles.textInput}
      />
      {code.map((c, i) => (
        <CodeInput char={c} key={i.toString()} />
      ))}
    </Pressable>
  )
}

const CodeInput = ({ char }: { char: string | null }) => {

  return (
    <ThemedView style={styles.codeInput}>
      <ThemedText
        style={styles.inputChar}
      >
        {char || "*"}
      </ThemedText>
    </ThemedView>
  )
}

const styles = StyleSheet.create(theme => ({
  codeInput: {
    borderRadius: theme.radii.sm,
    height: 40,
    aspectRatio: 1,
    flexShrink: 1,
    backgroundColor: theme.colors.primaryDark,
    justifyContent: "center",
    alignItems: "center"
  },
  container: {
    flexDirection: "row",
    gap: theme.spacing.xs
  },
  inputChar: {
    color: darkColors.textPrimary
  },
  textInput: {
    position: "absolute",
    opacity: 0
  }
}))
