import { useAuth } from '@clerk/clerk-expo'
import { useEffect, useState } from 'react'
import ReconnectingWebSocket from 'reconnecting-websocket'

const WS_URL = process.env.EXPO_PUBLIC_WS_URL

export default function useAuthenticatedWebSocket(url: string) {

  const [socket, setSocket] = useState<ReconnectingWebSocket | null>(null)
  const { getToken } = useAuth()

  useEffect(() => {

    const connectToSocket = async () => {
      const urlProvider = async () => {
        const token = await getToken()
        return `${WS_URL}/${url}?token=${token}`
      }
      const connection = new ReconnectingWebSocket(urlProvider)
      setSocket(connection)

      connection.onerror = (e) => {
        console.log(e.error, e.message)
      }
    }

    if (socket) {
      socket.close()
    }

    connectToSocket()

  }, [url])

  useEffect(() => {
    return () => {
      if (socket) {
        socket.close()
      }
    }
  }, [socket])

  return { socket }
}
