import { NavigationProp, useNavigation } from "@react-navigation/native"
import { RootNavigatorParamList } from "../navigation/types"

export const useAppNavigation = () => {

  return useNavigation<NavigationProp<RootNavigatorParamList>>()
}
