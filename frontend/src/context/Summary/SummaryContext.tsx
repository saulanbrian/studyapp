import { Summary } from "@/src/api/types/summary";
import { createContext, PropsWithChildren, useContext } from "react";


const SummaryContext = createContext<Summary | null>(null)

export const useSummary = () => {
  const context = useContext(SummaryContext)
  if (!context) throw new Error(`
    Cannot use SummaryContext outside SummaryContextProvider
  `)
  return context
}

export default function SummaryContextProvider({
  children,
  ...summary
}: PropsWithChildren<Summary>) {

  return (
    <SummaryContext.Provider value={{ ...summary }}>
      {children}
    </SummaryContext.Provider>
  )
}
