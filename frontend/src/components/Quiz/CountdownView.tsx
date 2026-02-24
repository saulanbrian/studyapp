import { ThemedText } from "@/src/components"
import { S } from "@/src/constants/Styles"
import { useQuizSound } from "@/src/context/Quiz/QuizSoundProvider"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { PropsWithChildren, useCallback, useEffect, useRef, useState } from "react"
import { Text, View } from "react-native"

type CountDownViewProps = PropsWithChildren<{
  onCountdownEnd?: () => void;
}>

export default function CountDownView({
  onCountdownEnd,
  children
}: CountDownViewProps) {

  const { countdownTick } = useQuizSound()
  const [count, setCount] = useState(3)

  useEffect(() => {

    if (count === 0) {
      onCountdownEnd?.()
      return
    }

    countdownTick.play()
    const id = setTimeout(() => setCount(count => count - 1), 1000)

    return () => clearTimeout(id)

  }, [count, onCountdownEnd])

  useFocusEffect(
    useCallback(() => {
      setCount(3)
    }, [])
  )


  return (
    <View style={{ flex: 1 }}>
      {
        count > 0 ? (
          <View style={S.centerContainer}>
            <ThemedText size={"xl"}>{count}</ThemedText>
          </View>
        ) : children
      }
    </View>
  )
}

