import { StyleSheet, ViewProps } from "react-native"
import ThemedView from "./ThemedView"
import Loader from './Loader'

export default function Loadingiew({
  style,
  ...props
}: ViewProps) {

  return (
    <ThemedView style={[styles.container, style]} {...props}>
      <Loader showText />
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 200
  },
})


