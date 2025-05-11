import { useAuth } from '@clerk/clerk-expo'
import { useCallback, useEffect, useRef, useState } from 'react'
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


type AuthenticatedSocketProps = {
  url: string;
  onMessage?: (e: MessageEvent) => void;
  onOpen?: (e: Event) => void;
  onClose?: (e: CloseEvent) => void;
  onError?: (e: Event) => void;
}


export function useAuthenticatedSocket({
  url,
  onOpen,
  onMessage,
  onClose,
  onError
}: AuthenticatedSocketProps) {

  const socket = useRef<WebSocket>(null)
  const { getToken } = useAuth()


  const connect = useCallback(async () => {

    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      socket.current.onclose = null
      socket.current.onopen = null
      socket.current.onerror = null
      socket.current.onmessage = null
      socket.current.close()
    }

    const token = await getToken()
    const urlWithToken = `${WS_URL}/${url}?token=${token}`
    const newSocket = new WebSocket(urlWithToken)

    newSocket.onclose = onClose ? onClose : () => {
      setTimeout(() => connect(), 1000)
    }

    newSocket.onmessage = (e) => {
      console.log(e.data)
    }

    newSocket.onerror = onError ? onError : null

    newSocket.onopen = onOpen ? onOpen : null

    socket.current = newSocket

  }, [url, getToken, onOpen, onMessage, onError, onClose])


  useEffect(() => {

    connect()

    return () => {
      socket.current?.close()
      socket.current = null
    }

  }, [url,getToken,onOpen,onMessage,onError,onClose])

  return { socket: socket.current }

}

