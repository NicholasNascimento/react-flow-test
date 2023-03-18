import { createContext, ReactNode, useState } from "react";

interface DataContextProps {
  userName: string
  setUserName: (userName: string) => void
  userAge: string
  setUserAge: (userAge: string) => void
  nodesNumber: number
  setNodesNumber: (userAge: number) => void
}

interface DataProviderProps {
  children: ReactNode
}

export const DataContext = createContext({} as DataContextProps)

export function DataProvider({ children }: DataProviderProps) {
  const [userName, setUserName] = useState<string>('')
  const [userAge, setUserAge] = useState<string>('')
  const [nodesNumber, setNodesNumber] = useState<number>(1)

  return (
    <DataContext.Provider value={{ userName, setUserName, userAge, setUserAge, nodesNumber, setNodesNumber }}>
      {children}
    </DataContext.Provider>
  )
}