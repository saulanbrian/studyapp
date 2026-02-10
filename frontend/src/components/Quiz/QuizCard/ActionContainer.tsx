import { StyleSheet, useUnistyles } from "react-native-unistyles";
import ThemedText from "../../ThemedText";
import ThemedView from "../../ThemedView";
import { Pressable, TouchableOpacity, View, ViewProps } from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { darkColors } from "@/src/constants/ui/Colors";
import { useQuiz } from "@/src/context/Quiz/QuizContext";
import { useCallback, useState } from "react";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootNavigatorParamList } from "@/src/navigation/types";
import { QuizStackParamList } from "@/src/navigation/Quiz/types";
import ThemedAlert from "../../ThemedAlert";
import deleteQuiz from "@/src/api/services/quizzes/deleteQuiz";
import useQueryUpdater from "@/src/api/hooks/useQueryUpdater";
import { Quiz } from "@/src/api/types/Quiz";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function ActionContainer({
  style
}: { style?: ViewProps["style"] }) {

  return (
    <ThemedView surface style={[styles.container, style]}>
      <DeleteButton />
      <AttachmentButton />
      <PlayButton />
    </ThemedView>
  )
}

const DeleteButton = () => {

  const { colors } = useUnistyles().theme
  const { id, summaryId } = useQuiz()
  const [alertVisible, setAlertVisible] = useState(false)
  const { removeDataFromInfiniteQuery } = useQueryUpdater<Quiz>()
  const queryClient = useQueryClient()

  const {
    mutate,
    isPending
  } = useMutation({
    mutationFn: async () => {
      const { data, error } = await deleteQuiz(id)
      if (error) throw error
      return data
    },
    onSuccess: () => {
      setAlertVisible(false)
      queryClient.invalidateQueries({ queryKey: ["summary", summaryId, "quiz"] })
      removeDataFromInfiniteQuery({ id, queryKey: ["quizzes"] })
    }
  })

  return (
    <TouchableOpacity onPress={() => {
      setAlertVisible(true)
    }}>
      <FontAwesome
        name={"trash-o"}
        size={16}
        color={colors.error}
      />
      <ThemedAlert
        title={"Confirm deletion"}
        text={"Are you sure you want to delete this quiz?"}
        primaryAction={{
          title: "delete",
          warning: true,
          onDispatch: mutate,
          isPending: isPending
        }}
        secondaryAction={{
          title: "cancel",
          onDispatch: () => {
            if (!isPending) {
              setAlertVisible(false)
            }
          }
        }}
        visible={alertVisible}
      />
    </TouchableOpacity>
  )
}

const AttachmentButton = () => {

  const { colors } = useUnistyles().theme
  const { ref: summaryId } = useQuiz()
  const navigation = useNavigation<NavigationProp<RootNavigatorParamList>>()

  const handlePress = useCallback(() => {
    navigation.navigate("Summary", {
      screen: "SummaryDetail",
      params: { id: summaryId }
    })
  }, [summaryId])

  return (
    <TouchableOpacity
      style={styles.attachmentButton}
      onPress={handlePress}
    >
      <Ionicons
        name={"open-outline"}
        size={16}
        color={colors.secondary}
      />
      <ThemedText size={"xs"} color={"secondary"}>
        read document
      </ThemedText>
    </TouchableOpacity>
  )
}

const PlayButton = () => {

  const { status, ref: summaryId } = useQuiz()
  const navigation = useNavigation<NavigationProp<QuizStackParamList>>()
  styles.useVariants({ disabled: status !== "success" })

  const handlePress = useCallback(() => {
    if (status === "success") {
      navigation.navigate("QuizPlayScreen", { id: summaryId })
    }
  }, [status])

  return (
    <TouchableOpacity
      style={styles.playButtonContainer}
      onPress={handlePress}
      disabled={status !== "success"}
    >
      <View style={styles.playButton}>
        <Ionicons
          name={"play"}
          color={darkColors.textPrimary}
          size={16}
        />
        <ThemedText style={styles.playButtonText}>
          start
        </ThemedText>
      </View>
    </TouchableOpacity>
  )
}



const styles = StyleSheet.create(theme => ({
  attachmentButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs
  },
  playButton: {
    padding: theme.spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xxs,
    borderRadius: theme.radii.pill,
    backgroundColor: theme.colors.primary,
    variants: {
      disabled: {
        true: {
          opacity: 0.7
        }
      }
    }
  },
  playButtonContainer: {
    marginLeft: "auto"
  },
  playButtonText: {
    color: darkColors.textPrimary,
    marginRight: theme.spacing.xxs
  }
}))
