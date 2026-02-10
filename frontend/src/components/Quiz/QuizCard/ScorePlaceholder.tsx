import * as Progress from "react-native-progress"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

export const ScorePlaceholder = () => {

  const { colors } = useUnistyles().theme

  return <Progress.Circle
    color={colors.textSecondary}
    size={50}
    thickness={4}
    unfilledColor={colors.textSecondary}
    formatText={() => "?"}
    showsText
    textStyle={styles.text}
  />
}

const styles = StyleSheet.create(theme => ({
  text: {
    fontSize: theme.fontSize.md,
    fontWeight: "600"
  }
}))
