import React, { createContext, useContext, useState } from "react"
import { DrawerNavigationOptions } from "@react-navigation/drawer";

type DrawerOptions = {
  swipeEnabled: boolean;
}

type DrawerContextType = {
  options: DrawerOptions;
  setOptions: React.Dispatch<React.SetStateAction<DrawerOptions>>;
}

const DrawerContext = createContext<DrawerContextType | null>(null)

export const useDrawer = () => {
  const context = useContext(DrawerContext)
  if (!context) throw new Error(`
    Cannot use DrawerContext outside DrawerContextProvider
  `)
  return context
}

export default function DrawerContextProvider({
  children
}: {
  children: React.ReactNode
}) {

  const [options, setOptions] = useState<DrawerOptions>({
    swipeEnabled: true
  })

  return <DrawerContext.Provider value={{
    options,
    setOptions
  }}>
    {children}
  </DrawerContext.Provider>

}
