import { Summary } from "@/src/api/types/summary";
import ThemedView, { AnimatedThemedView } from "../ThemedView";
import { StyleSheet } from "react-native-unistyles";
import { Image } from "expo-image";
import { Pressable, StyleProp, View, ViewStyle } from "react-native";
import ThemedText from "../ThemedText";
import prettifyDate from "@/src/api/utils/prettifyDate"
import extractMonthAndDay from "@/src/api/utils/extractMonthAndDay";
import { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

type SummaryComponentProps = Summary & {
  style?: StyleProp<ViewStyle>
}


export default function SummaryComponent({
  style,
  cover_url,
  ...details
}: SummaryComponentProps) {

  const isPressed = useSharedValue(false)

  const rStyles = useAnimatedStyle(() => ({
    transform: [
      { scale: withSpring(isPressed.value ? 0.96 : 1) }
    ]
  }))

  return (
    <Pressable
      onPressIn={() => isPressed.value = true}
      onPressOut={() => isPressed.value = false}
      style={style}
    >
      <AnimatedThemedView
        surface
        style={[styles.container, rStyles]}
      >
        <Image
          source={cover_url ?? require("@/assets/images/icon.png")}
          style={styles.image}
          contentFit={"fill"}
        />
        <Details {...details} />
      </AnimatedThemedView>
    </Pressable>
  )
}

type DetailsProp = Pick<Summary, 'created_at' | 'title' | 'description' | 'status'>

const Details = ({
  created_at,
  title,
  description,
  status
}: DetailsProp) => {

  return (
    <View style={styles.detailsContainer}>
      <ThemedText
        fw={"semiBold"}
        size={"md"}
        numberOfLines={1}
        style={styles.title}
      >
        {title}
      </ThemedText>
      <DescriptionConatiner description={description} />
      <StatusAndDate created_at={created_at} status={status} />
    </View>
  )
}

const DescriptionConatiner = ({ description }: { description: string | null }) => {

  return (
    <View style={styles.descriptionContainer}>
      <ThemedView style={styles.descriptionSeparator} />
      <ThemedText
        color={"secondary"}
        size={"xs"}
        numberOfLines={3}
      >
        {description ?? "No description provided"}
      </ThemedText>
    </View>
  )
}

type StatusAndDateProps = Pick<Summary, 'created_at' | 'status'>

const StatusAndDate = ({ created_at, status }: StatusAndDateProps) => {

  styles.useVariants({ status })

  return (
    <View style={styles.statusAndDateContainer}>
      <ThemedView style={styles.statusIndicator} />
      <ThemedText size={"xs"} fw={"medium"}>
        {status}
      </ThemedText>
      <ThemedText color={"disabled"} size={"xs"} style={styles.date}>
        {extractMonthAndDay(created_at)}
      </ThemedText>
    </View>
  )
}


const styles = StyleSheet.create(theme => ({
  container: {
    borderRadius: theme.radii.xs,
    padding: theme.spacing.sm,
    flexDirection: "row"
  },
  date: {
    marginLeft: "auto"
  },
  description: {

  },
  descriptionSeparator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.textTertiary
  },
  descriptionContainer: {
    paddingVertical: theme.spacing.xs,
    gap: theme.spacing.xxs,
    flex: 1
  },
  detailsContainer: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    flex: 1
  },
  image: {
    width: 80,
    aspectRatio: 9 / 12,
    borderRadius: theme.radii.sm
  },
  statusAndDateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs
  },
  statusIndicator: {
    height: 8,
    width: 8,
    borderRadius: theme.radii.pill,
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
    }
  },
  title: {
    textTransform: "capitalize"
  },
}))

