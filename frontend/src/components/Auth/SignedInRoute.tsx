import { globalNavigate } from "@/src/navigation/navigationRef";
import { useAuth } from "@clerk/clerk-expo";
import { PropsWithChildren, useEffect } from "react";

export default function SignedInRoute({
  children
}: PropsWithChildren) {

  const { isSignedIn, isLoaded } = useAuth()

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      globalNavigate("Auth", { screen: "SSO" })
    }
  }, [isSignedIn, isLoaded])

  if (!isSignedIn) return null

  return children
}
