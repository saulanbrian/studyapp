import React, { useImperativeHandle, useState } from "react";
import { Modal, ModalProps, Pressable, TouchableWithoutFeedback, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export type TransparentModalViewRef = {
  toggle: () => void;
}

const TransparentModalView = React.forwardRef<
  TransparentModalViewRef, ModalProps
>(({ children, style, ...props }, ref) => {

  const [isVisible, setIsVisible] = useState(false)

  useImperativeHandle(ref, () => ({
    toggle: () => setIsVisible(visible => !visible)
  }))

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
        onPress={() => setIsVisible(false)}
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
