import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from "react";
import { ThemedText, ThemedView } from "../ui";
import { Pressable, StyleSheet, ViewProps } from "react-native"
import { TextInput } from "react-native-gesture-handler";

export type CodeInputRef = {
  code: string
}

type CodeInputProps = ViewProps & {
  codeLength?: number
}

const CodeInput = forwardRef<CodeInputRef, CodeInputProps>(
  ({ codeLength = 6, style, ...props }, ref) => {

    const [rawCode, setRawCode] = useState('')
    const inputRef = useRef<TextInput>(null)

    const code = useMemo(() => {

      let inputCode = []

      const rawCodeSplitted = rawCode.split('')
      const rawCodeLength = rawCodeSplitted.length

      for (let i = 0; i < codeLength; i++) {
        inputCode.push({
          value: i < rawCodeLength ? rawCodeSplitted[i] : null
        })
      }

      return inputCode
    }, [rawCode])

    useImperativeHandle(ref, () => ({
      code: rawCode
    }))

    const handleRawCodeChange = (text: string) => {
      if (text.split('').length <= codeLength) {
        setRawCode(text)
      }
    }


    return (
      <Pressable onPress={() => inputRef.current?.focus()}>
        <ThemedView style={[styles.container, style]} {...props} >
          {code.map((c, i) => (
            <ThemedView style={styles.codeContainer} key={i} surface>
              <ThemedText style={styles.code} adjustsFontSizeToFit>
                {c.value}
              </ThemedText>
            </ThemedView>
          ))}
        </ThemedView>
        <TextInput
          ref={inputRef}
          value={rawCode}
          onChangeText={handleRawCodeChange}
          style={styles.hiddenInput}
          keyboardType={'numeric'}
        />
      </Pressable>
    )
  })

const styles = StyleSheet.create({
  code: {
    fontSize: 20
  },
  codeContainer: {
    aspectRatio: 1,
    height: 60,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 1
  },
  container: {
    padding: 12,
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  hiddenInput: {
    position: 'absolute',
    height: 0,
    width: 0,
    opacity: 0
  }
})

export default CodeInput
