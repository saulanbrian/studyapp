import { Quiz } from "@/src/api/types/Quiz";
import { ThemedText, ThemedView } from "@/src/components"
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { Pressable, PressableProps, View } from "react-native";
import { ScoreContainer } from "./ScoreContainer";
import { ScorePlaceholder } from "./ScorePlaceholder";
import { StatusContainer } from "./StatusContainer";
import ActionContainer from "./ActionContainer";
import QuizContextProvider from "@/src/context/Quiz/QuizContext";

type QuizCardProps = Quiz & Pick<PressableProps, 'onPress' | 'disabled'> & {
  expanded: boolean
}

export default function QuizCard({
  expanded,
  disabled,
  onPress,
  ...quiz
}: QuizCardProps) {

  styles.useVariants({ expanded })

  return (
    <QuizContextProvider {...quiz}>
      <Pressable
        style={[styles.mainCard]}
        onPress={onPress}
      >
        <View style={{ flex: 1 }}>
          <ThemedText numberOfLines={1} fw={"bold"}>
            {quiz.summaryTitle}
          </ThemedText>
          <StatusContainer />
        </View>
        {
          quiz.status === "success" ? (
            <ScoreContainer
            />
          ) : <ScorePlaceholder />
        }
      </Pressable>
      {expanded && <ActionContainer style={styles.actionCard} />}
    </QuizContextProvider>
  )
}

const styles = StyleSheet.create(theme => ({
  mainCard: {
    borderRadius: theme.radii.sm,
    flexDirection: "row",
    padding: theme.spacing.md,
    gap: theme.spacing.xs,
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    variants: {
      expanded: {
        true: {
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          paddingBottom: 0
        }
      }
    }
  },
  actionCard: {
    padding: theme.spacing.md,
    borderBottomRightRadius: theme.radii.sm,
    borderBottomLeftRadius: theme.radii.sm,
    paddingHorizontal: theme.spacing.md
  }
}))
