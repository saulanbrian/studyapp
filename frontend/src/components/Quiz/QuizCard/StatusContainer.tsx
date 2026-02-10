import { Quiz } from "@/src/api/types/Quiz"
import { View } from "react-native"
import { StyleSheet } from "react-native-unistyles"
import ThemedView from "../../ThemedView"
import ThemedText from "../../ThemedText"
import { useMemo } from "react"
import { useQuiz } from "@/src/context/Quiz/QuizContext"

export const StatusContainer = () => {

  const { status } = useQuiz()
  styles.useVariants({ status })

  const statusText = useMemo(() => {
    switch (status) {
      case "pending":
        return "Quiz is being generated..."
      case "success":
        return "Quiz is ready"
      case "error":
        return "An error has occured upon creating this quiz"
    }
  }, [status])

  return (
    <View style={styles.statusContainer}>
      <ThemedView style={styles.statusIndicator} />
      <ThemedText
        color={status === "success" ? "primary" : "secondary"}
        size={"xs"}
      >
        {statusText}
      </ThemedText>
    </View>
  )
}

const styles = StyleSheet.create(theme => ({
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.xxs,
    gap: theme.spacing.xs
  },
  statusIndicator: {
    variants: {
      status: {
        error: {
          backgroundColor: theme.colors.error
        },
        success: {
          backgroundColor: theme.colors.success
        },
        pending: {
          backgroundColor: theme.colors.warning
        }
      }
    },
    height: 6,
    aspectRatio: 1,
    borderRadius: theme.radii.pill
  }
}))
