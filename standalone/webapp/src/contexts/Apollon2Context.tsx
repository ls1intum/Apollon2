import React, {
  createContext,
  useContext,
  useRef,
  useEffect,
  useState,
  ReactNode,
  useMemo,
} from "react"
import { Apollon2 } from "@apollon2/library"

interface Apollon2ContextType {
  apollon2?: Apollon2
  diagramName: string
  setDiagramName: React.Dispatch<React.SetStateAction<string>>
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
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [apollon2, setApollon2] = useState<Apollon2>()
  const [diagramName, setDiagramName] = useState("Default Diagram")

  useEffect(() => {
    if (containerRef.current && !apollon2) {
      const instance = new Apollon2(containerRef.current)
      instance.subscribeToModalChange((state) => {
        console.log("State changed", state)
      })
      setApollon2(instance)
    }

    return () => {
      if (apollon2) {
        console.log("Disposing Apollon2")
        apollon2.dispose()
      }
    }
  }, [apollon2])

  const contextValue = useMemo(
    () => ({
      apollon2,
      diagramName,
      setDiagramName,
    }),
    [apollon2, diagramName, setDiagramName]
  )

  return (
    <Apollon2Context.Provider value={contextValue}>
      <div
        style={{ display: "flex", flexDirection: "column", height: "100vh" }}
      >
        {children}
        <div style={{ flex: 1 }} ref={containerRef} />
      </div>
    </Apollon2Context.Provider>
  )
}
