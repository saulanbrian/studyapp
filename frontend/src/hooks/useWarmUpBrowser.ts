import * as WebBroswer from "expo-web-browser"
import { useEffect } from "react"

export const useWarmUpBrowser = () => {

  useEffect(() => {
    WebBroswer.warmUpAsync()
    return () => {
      WebBroswer.coolDownAsync()
    }
  }, [])

}
