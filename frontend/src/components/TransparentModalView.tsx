import React, { useCallback, useImperativeHandle, useState } from "react";
import { Modal, ModalProps, Pressable, TouchableWithoutFeedback, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export type TransparentModalViewRef = {
  toggle: () => void;
}

type TransparentModalViewProps = Omit<ModalProps, "visible"> & {
  onBackdropPress?: () => void;
}

const TransparentModalView = React.forwardRef<
  TransparentModalViewRef, TransparentModalViewProps
>(({ children, onBackdropPress, style, ...props }, ref) => {

  const [isVisible, setIsVisible] = useState(false)

  useImperativeHandle(ref, () => ({
    toggle: () => setIsVisible(visible => !visible)
  }))

  const handleBackdropPress = useCallback(() => {
    setIsVisible(false)
    onBackdropPress?.()
  }, [onBackdropPress])

  if (!isVisible) return

  return (
    <Modal
      visible={isVisible}
      transparent
      statusBarTranslucent
      navigationBarTranslucent
      animationType={"fade"}
      {...props}
    >
      <Pressable
        style={[StyleSheet.absoluteFill, style]}
        onPress={handleBackdropPress}
      />
      <View
        style={styles.container}
        pointerEvents="box-none"
      >
        {children}
      </View>
    </Modal>
  )
})

export default TransparentModalView

const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center'
  }
}))
