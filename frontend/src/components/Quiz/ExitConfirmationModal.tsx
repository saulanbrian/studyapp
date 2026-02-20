import { useCallback, useEffect, useRef, useState } from "react";
import ThemedAlert from "../ThemedAlert";
import { NavigationAction, StackActions, useNavigation } from "@react-navigation/native";


export default function ExitConfirmationModal() {

  const [visible, setVisible] = useState(false)
  const navigation = useNavigation()
  const navAction = useRef<NavigationAction>(null)

  const onDispatch = useCallback(() => {
    navigation.dispatch(navAction.current!)
  }, [])

  useEffect(() => {

    const beforeRemove = navigation.addListener("beforeRemove", e => {
      e.preventDefault()
      navAction.current = e.data.action
      setVisible(true)
    })

    return beforeRemove

  }, [navigation])

  return <ThemedAlert
    title={"Warning"}
    text={"Leaving this page will restart the quiz"}
    visible={visible}
    primaryAction={{
      title: "continue",
      warning: true,
      onDispatch,
    }}
    secondaryAction={{
      title: "cancel",
      onDispatch: () => setVisible(false)
    }}
  />
}
