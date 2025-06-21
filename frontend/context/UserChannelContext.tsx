import useQuizUpdater from "@/api/updater/quiz"
import useSummaryUpdater from "@/api/updater/summary"
import { Quiz, Summary } from "@/types/data"
import { useAuth } from "@clerk/clerk-expo"
import { createContext, PropsWithChildren, useContext, useEffect, useRef } from "react"
import ReconnectingWebSocket from "reconnecting-websocket"

import { ENV } from "@/constants/Env"


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
  const { updateQuiz } = useQuizUpdater()

  useEffect(() => {

    (async () => {

      const urlProvider = async () => {
        const token = await getToken()
        return `${ENV.WS_URL}/ws/user_channels?token=${token}`
      }

      const socket = new ReconnectingWebSocket(urlProvider)

      socket.onopen = () => {
        console.log('opened')
      }

      socket.onmessage = (e) => {
        const data = JSON.parse(e.data)
        const msg_type = data.msg_type
        if (msg_type) {
          if (msg_type === 'summary_update') {
            const updatedSummary: Summary = data.updated_summary
            const { id, ...updateField } = updatedSummary;
            updateSummary({ id, updateField })
          } else if (msg_type === 'quiz_update') {
            const updatedQuiz: Quiz = data.updated_quiz
            const { id, ...updateField } = updatedQuiz
            updateQuiz({ quizId: id, updateField })
          }
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
