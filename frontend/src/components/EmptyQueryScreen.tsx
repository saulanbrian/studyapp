import React, { createContext, PropsWithChildren, useContext, useMemo } from "react";
import ThemedText, { ThemedTextProps } from "./ThemedText";
import ThemedScreen from "./ThemedScreen";
import { S } from "../constants/Styles";
import { ViewProps } from "react-native";

type EmptyQueryScreenContextType = {
  emptyMessage: string;
}

const EmptyQueryScreenContext = createContext<EmptyQueryScreenContextType | null>(null)

const useEmptyQueryScreen = () => {
  const context = useContext(EmptyQueryScreenContext)
  if (!context) {
    throw new Error(`
      Cannot use EmptyQueryScreen.Message component outside
      EmptyQueryScreen
    `)
  }
  return context
}



type EmptyQueryScreenProps = ViewProps & {
  queryName: string
}

export default function EmptyQueryScreen({
  children,
  queryName,
  style,
  ...props
}: PropsWithChildren<EmptyQueryScreenProps>) {

  const emptyMessage = useMemo(() => {
    return `No ${queryName} found.`
  }, [queryName])

  return (
    <EmptyQueryScreenContext.Provider value={{ emptyMessage }}>
      <ThemedScreen
        style={[S.centerContainer, style]}
        {...props}
      >
        {children}
      </ThemedScreen>
    </EmptyQueryScreenContext.Provider>
  )
}


EmptyQueryScreen.Message = (props: ThemedTextProps) => {

  const { emptyMessage } = useEmptyQueryScreen()

  return (
    <ThemedText
      size={"lg"}
      fw={"bold"}
      {...props}
    >
      {emptyMessage}
    </ThemedText>
  )
}
