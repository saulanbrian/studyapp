import { createNavigationContainerRef } from "@react-navigation/native";
import { RootNavigatorParamList } from "./types";

export const navigationRef = createNavigationContainerRef<RootNavigatorParamList>()

export const globalNavigate = <T extends keyof RootNavigatorParamList>(
  name: T,
  params?: RootNavigatorParamList[T]
) => {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name as any, params as any)
  }
}
