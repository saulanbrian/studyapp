import { useAuth } from "@clerk/clerk-expo";
import { createContext, PropsWithChildren, useCallback, useEffect, useMemo, useRef } from "react";
import ReconnectingWebSocket from "reconnecting-websocket"
import { ENV } from "../constants/Env";
import useSummaryUpdater from "../api/updaters/summary";
import { Summary } from "../api/schemes";

const UserChannel = createContext<{} | null>(null)

export default function UserChannelContextProvider({
  children,
}: PropsWithChildren) {

  const { getToken } = useAuth()
  const socketRef = useRef<ReconnectingWebSocket>(null)
  const { updateSummary } = useSummaryUpdater()


  const summaryListener = useCallback((event: MessageEvent) => {
    const data = JSON.parse(event.data)
    if (data.msg_type === "summary_update") {
      const updatedSummary: Summary = data.updated_summary
      const { id, ...updateFields } = updatedSummary
      updateSummary({ id, updateFields })
    }
  }, [])


  useEffect(() => {

    const urlProvider = async () => {
      const token = await getToken()
      return `${ENV.websocketUrl}/ws/user_channels?token=${token}`
    }

    const socket = new ReconnectingWebSocket(urlProvider)

    socket.onopen = (e) => {
      console.log("open")
    }

    socket.addEventListener("message", summaryListener)

    socketRef.current = socket

    return () => {
      socketRef.current?.close()
      socketRef.current = null
    }

  }, [])

  return (
    <UserChannel.Provider value={{}}>
      {children}
    </UserChannel.Provider>
  )
}
