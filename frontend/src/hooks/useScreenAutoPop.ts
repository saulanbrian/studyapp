import { StackActions, useNavigation } from "@react-navigation/native"
import { useEffect } from "react"

export const useScreenAutoPop = () => {

  const navigation = useNavigation()

  useEffect(() => {

    const unsubscribe = navigation.addListener(
      "beforeRemove",
      e => {
        e.preventDefault()
        console.log("we poppin")
        navigation.dispatch(StackActions.pop())
      }
    )

    return unsubscribe

  }, [navigation])
}
