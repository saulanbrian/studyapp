import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Dimensions, ScrollView, StyleSheet } from "react-native";
import { ThemedView } from "../ui";

type OnboardingFormProps = {
  pages: React.ReactNode[]
}

export type OnboardingFormRef = {
  next: () => void;
  back: () => void
}

const DIMENSION_WIDTH = Dimensions.get('window').width
const DIMENSION_HEIGHT = Dimensions.get('window').height

const OnboardingForm = forwardRef<OnboardingFormRef, OnboardingFormProps>(
  ({ pages }, ref) => {

    const [currentPage, setCurrentPage] = useState(1)
    const scrollRef = useRef<ScrollView>(null)

    useImperativeHandle(ref, () => ({
      next: () => {
        scrollRef.current?.scrollTo({ x: DIMENSION_WIDTH * currentPage })
        setCurrentPage(page => page + 1)
      },
      back: () => {
        scrollRef.current?.scrollTo({ x: -DIMENSION_WIDTH })
        setCurrentPage(page => page - 1)
      }
    }), [currentPage])

    return (
      <ScrollView
        horizontal
        pagingEnabled
        scrollEnabled={false}
        bounces={false}
        ref={scrollRef}
      >
        {pages.map((page, i) => (
          <ThemedView style={styles.page} key={i}>
            {page}
          </ThemedView>
        ))}
      </ScrollView>
    )
  }
)

export default OnboardingForm

const styles = StyleSheet.create({
  page: {
    flex: 1,
    width: Dimensions.get('window').width,
  }
})
