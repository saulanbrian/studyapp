import { Summary } from "@/src/api/types/summary";
import ThemedView, { AnimatedThemedView } from "../ThemedView";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { Image } from "expo-image";
import { ActivityIndicator, Pressable, StyleProp, View, ViewStyle } from "react-native";
import ThemedText from "../ThemedText";
import extractMonthAndDay from "@/src/api/utils/extractMonthAndDay";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

const SummaryComponentCard = React.memo(({
  cover_url,
  ...summary
}: Summary) => {

  return (
    <ThemedView style={[styles.container]}>
      {summary.status === "pending" && <View style={styles.overlay} />}
      <Image
        source={
          cover_url
            ? { uri: cover_url }
            : require("@/assets/images/icon.png")
        }
        style={styles.image}
        contentFit={"cover"}
        cachePolicy={"memory-disk"}
      />
      <Details {...summary} />
    </ThemedView>
  )
})

type DetailsProp = Pick<Summary, 'created_at' | 'title' | 'description' | 'status'>

const Details = ({
  created_at,
  title,
  description,
  status,
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
      <DescriptionContainer description={description} />
      <StatusAndDate created_at={created_at} status={status} />
    </View>
  )
}

const DescriptionContainer = ({ description }: { description: string | null }) => {

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

  const { colors } = useUnistyles().theme
  styles.useVariants({ status })

  const statusText = useMemo(() => {
    switch (status) {
      case "pending":
        return "preparing summary"
      case "success":
        return "ready to view"
      case "error":
        return "summarization failed"
    }
  }, [status])

  return (
    <View style={styles.statusAndDateContainer}>
      {status === "pending"
        ? <ActivityIndicator size={10} color={colors.primary} />
        : <ThemedView style={styles.statusIndicator} />
      }
      <ThemedText size={"xs"} fw={"medium"} color={"secondary"}>
        {statusText}
      </ThemedText>
      <ThemedText color={"disabled"} size={"xs"} style={styles.date}>
        {extractMonthAndDay(created_at)}
      </ThemedText>
    </View>
  )
}


export default SummaryComponentCard

const styles = StyleSheet.create(theme => ({
  container: {
    borderRadius: theme.radii.xs,
    padding: theme.spacing.sm,
    flexDirection: "row",
    backgroundColor: theme.colors.elevated,
    borderColor: theme.colors.border,
    position: "relative",
    borderWidth: 0.5
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.disabledBg,
    borderRadius: theme.radii.xs
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

