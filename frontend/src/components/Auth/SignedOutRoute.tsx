import { globalNavigate } from "@/src/navigation/navigationRef";
import { useAuth } from "@clerk/clerk-expo";
import { PropsWithChildren, useEffect } from "react";

export default function SignedOutRoute({ children }: PropsWithChildren) {

  const { isLoaded, isSignedIn } = useAuth()

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      globalNavigate("Summary", { screen: "SummaryList" })
    }
  }, [isLoaded, isSignedIn])

  if (isSignedIn) return null

  return children
}
