import useSummaryUpdater from "@/api/updater/summary"
import useAuthenticatedWebSocket, { useAuthenticatedSocket } from "@/hooks/useAuthenticatedWebSocket"
import { Summary } from "@/types/data"
import { useAuth } from "@clerk/clerk-expo"
import { createContext, PropsWithChildren, useContext, useEffect, useRef } from "react"
import ReconnectingWebSocket from "reconnecting-websocket"

const WS_URL = process.env.EXPO_PUBLIC_WS_URL!

const SocketUrl = `${WS_URL}/ws/user_channels`

type UserChannelContextType = {

}

const UserChannelContext = createContext<UserChannelContextType | null>(null)

export function useUserChannel() {
  const context = useContext(UserChannelContext)
  if (!context) throw new Error('cannot use UserChannel outside UserChannelContextProvidr')
  return context
}

export default function UserChannelContextProvider({ children }: PropsWithChildren) {

  const socketRef = useRef<ReconnectingWebSocket | null>(null)
  const { getToken } = useAuth()
  const { updateSummary } = useSummaryUpdater()

  useEffect(() => {

    (async () => {

      const urlProvider = async () => {
        const token = await getToken()
        return `${WS_URL}/ws/user_channels?token=${token}`
      }

      const socket = new ReconnectingWebSocket(urlProvider)

      socket.onopen = () => {
        console.log('opened')
      }

      socket.onmessage = (e) => {
        const data = JSON.parse(e.data)
        if (data.msg_type && data.msg_type === 'summary_update') {
          const updatedSummary: Summary = data.updated_summary
          updateSummary(updatedSummary.id, updatedSummary)
        }
      }

      socket.onclose = () => {
        console.log('closed')
      }

      socketRef.current = socket

    })()

  }, [])

  return (
    <UserChannelContext.Provider value={{}}>
      {children}
    </UserChannelContext.Provider>
  )
}
