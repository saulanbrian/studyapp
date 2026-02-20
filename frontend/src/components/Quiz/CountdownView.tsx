import { ThemedText } from "@/src/components"
import { S } from "@/src/constants/Styles"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { useCallback, useEffect, useRef, useState } from "react"
import { Text, View } from "react-native"
import { StyleSheet } from "react-native-unistyles"

export default function CountDownView({ children }: { children: React.ReactNode }) {

  const [count, setCount] = useState(3)
  const navigation = useNavigation()

  useEffect(() => {

    if (count === 0) return
    const id = setTimeout(() => setCount(count => count - 1), 1000)

    return () => clearTimeout(id)

  }, [count])

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

