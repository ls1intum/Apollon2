import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from "react"
import { ApollonEditor } from "@tumaet/apollon"

interface Apollon2ContextType {
  apollon2?: ApollonEditor
  diagramName: string

  setDiagramName: React.Dispatch<React.SetStateAction<string>>
  setApollon2: React.Dispatch<React.SetStateAction<ApollonEditor | undefined>>
}

export const Apollon2Context = createContext<Apollon2ContextType | undefined>(
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
  const [apollon2, setApollon2] = useState<ApollonEditor>()
  const [diagramName, setDiagramName] = useState("Default Diagram")

  const contextValue = useMemo(
    () => ({
      apollon2,
      setApollon2,
      diagramName,
      setDiagramName,
    }),
    [apollon2, setApollon2, diagramName, setDiagramName]
  )

  return (
    <Apollon2Context.Provider value={contextValue}>
      {children}
    </Apollon2Context.Provider>
  )
}
