import useAuthenticatedWebSocket from "@/hooks/useAuthenticatedWebSocket"
import { createContext, PropsWithChildren, useContext, useEffect } from "react"

type UserChannelContextType = {

}

const UserChannelContext = createContext<UserChannelContextType | null>(null)

export function useUserChannel() {
  const context = useContext(UserChannelContext)
  if (!context) throw new Error('cannot use UserChannel outside UserChannelContextProvidr')
  return context
}

export default function UserChannelContextProvider({ children }: PropsWithChildren) {

  const { socket } = useAuthenticatedWebSocket('ws/user_channels/')

  useEffect(() => {

    if (socket) {
      socket.onopen = () => {
        console.log('connected')
      }
    }

  }, [socket])

  return (
    <UserChannelContext.Provider value={{}}>
      {children}
    </UserChannelContext.Provider>
  )
}
