import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from "react"
import { Apollon2 } from "@apollon2/library"

interface Apollon2ContextType {
  apollon2?: Apollon2
  diagramName: string
  setDiagramName: React.Dispatch<React.SetStateAction<string>>
  setApollon2: React.Dispatch<React.SetStateAction<Apollon2 | undefined>>
}

const Apollon2Context = createContext<Apollon2ContextType | undefined>(
  undefined
)

export const useApollon2Context = () => {
  const context = useContext(Apollon2Context)
  if (!context) {
    throw new Error(
      "useApollon2Context must be used within an Apollon2Provider"
    )
  }
  return context
}

interface Props {
  children: ReactNode
}

export const Apollon2Provider: React.FC<Props> = ({ children }) => {
  const [apollon2, setApollon2] = useState<Apollon2>()
  const [diagramName, setDiagramName] = useState("Default Diagram")

  const contextValue = useMemo(
    () => ({
      apollon2,
      setApollon2,
      diagramName,
      setDiagramName,
    }),
    [apollon2, diagramName, setDiagramName, setApollon2]
  )

  return (
    <Apollon2Context.Provider value={contextValue}>
      {children}
    </Apollon2Context.Provider>
  )
}
