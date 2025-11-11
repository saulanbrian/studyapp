import { StyleSheet } from "react-native-unistyles"
import ThemedView from "../ThemedView"


const FOLDER_HEIGHT = 160
const FOLDER_WIDTH = 110

export default function SummaryFolder() {

  return (
    <ThemedView style={styles.folderBack}>

    </ThemedView>
  )
}


const styles = StyleSheet.create(theme => ({
  folderBack: {
    backgroundColor: theme.colors.primaryLight,
    width: FOLDER_WIDTH,
    height: FOLDER_HEIGHT
  }
}))
