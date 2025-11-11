import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react"
import { Pressable, View } from "react-native"
import Animated, { runOnJS, SharedValue, useAnimatedStyle, useSharedValue, withDelay, withSequence, withTiming } from "react-native-reanimated"
import { StyleSheet } from "react-native-unistyles"
import ThemedText from "./ThemedText"
import useEffectAfterMount from "../hooks/useEffectAfterMount"

const FOLDER_WIDTH = 100
const FOLDER_HEIGHT = 120

const FOLDER_BACK_WIDTH = FOLDER_WIDTH - 4

const PAPER_WIDTH = FOLDER_BACK_WIDTH - 4
const PAPER_HEIGHT = FOLDER_HEIGHT - 2


type FolderProps = {
  numberOfPapers: number
}


export default function Folder({ numberOfPapers }: FolderProps) {

  const [isOpen, setIsOpen] = useState(false)

  const toggle = useCallback(() => {
    setIsOpen(state => !state)
  }, [isOpen])

  return (
    <Pressable style={styles.container} onPress={toggle}>
      <BackCover />
      {Array.from({ length: numberOfPapers }).map((_, i, items) => (
        <Paper
          pageNumber={items.length - i}
          isOpen={isOpen}
          paperCount={numberOfPapers}
          key={i.toString()}
        />
      ))}
      <FrontCover isOpen={isOpen} />
    </Pressable>
  )
}

const BackCover = () => {
  return <View style={styles.backCover} />
}

const FrontCover = ({ isOpen }: { isOpen: boolean }) => {

  const rotateY = useSharedValue(0)

  const rStyles = useAnimatedStyle(() => ({
    transform: [
      { perspective: 600 },
      { translateX: -FOLDER_WIDTH / 2 },
      { rotateY: `${rotateY.value}deg` },
      { translateX: FOLDER_WIDTH / 2 }
    ]
  }))

  //open the cover and close it again no matter the state
  useEffectAfterMount(() => {
    rotateY.value = withSequence(
      withTiming(-45, { duration: 300 }),
      withTiming(0, { duration: 300 })
    )
  }, [isOpen])

  return (
    <Animated.View style={[styles.frontCover, rStyles]}>
      <View style={styles.frontCoverMain} />
      <View style={styles.frontCoverTab} />
    </Animated.View>
  )
}


type PaperProps = {
  pageNumber: number;
  isOpen: boolean;
  paperCount: number
}

const Paper = ({ isOpen, pageNumber, paperCount }: PaperProps) => {

  const translateY = useSharedValue(0)
  const translateX = useSharedValue(0)
  const zIndex = useSharedValue(0)

  const animationDelay = useMemo(() => {
    return isOpen ? (pageNumber - 1) * 100 : (paperCount - pageNumber) * 100
  }, [pageNumber, paperCount, isOpen])

  const rStyles = useAnimatedStyle(() => ({
    zIndex: zIndex.value,
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value }
    ]
  }))

  useEffectAfterMount(() => {

    translateY.value = withDelay(
      animationDelay,
      withSequence(
        withTiming(
          -FOLDER_HEIGHT,
          { duration: 300 },
          () => {
            zIndex.value = isOpen ? paperCount + 1 - pageNumber : 0
          }
        ),
        withTiming(
          isOpen ? 8 : 0,
          { duration: 300 })
      )
    )

    translateX.value = withDelay(
      animationDelay,
      withTiming(
        isOpen ? paperCount * 8 - (pageNumber * 6) : 0,
        { duration: 300 }
      )
    )
  }, [isOpen])


  return (
    <Animated.View style={[styles.paper, rStyles]} >
    </Animated.View>
  )
}


const styles = StyleSheet.create(theme => ({
  backCover: {
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.radii.xxs,
    width: FOLDER_BACK_WIDTH,
    height: FOLDER_HEIGHT
  },
  container: {
    height: FOLDER_HEIGHT,
    width: FOLDER_WIDTH
  },
  frontCover: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
    alignItems: "flex-end"
  },
  frontCoverMain: {
    backgroundColor: theme.colors.primaryDark,
    height: FOLDER_HEIGHT,
    width: FOLDER_WIDTH - 28,
    borderRadius: theme.radii.xxs,
    borderBottomRightRadius: 0,
  },
  frontCoverTab: {
    backgroundColor: theme.colors.primaryDark,
    height: FOLDER_HEIGHT - FOLDER_HEIGHT / 3,
    flexGrow: 1,
    borderTopRightRadius: theme.radii.xxs,
    borderBottomRightRadius: theme.radii.xxs
  },
  paper: {
    position: "absolute",
    left: 0,
    bottom: 0,
    width: PAPER_WIDTH,
    height: PAPER_HEIGHT,
    backgroundColor: theme.colors.elevated,
    borderWidth: 1,
    borderColor: theme.colors.border
  }
}))
