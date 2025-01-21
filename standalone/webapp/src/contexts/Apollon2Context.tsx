// Apollon2Context.tsx
import React, {
  createContext,
  useContext,
  useRef,
  useEffect,
  useState,
  ReactNode,
} from "react"
import { Apollon2 } from "@apollon2/library"

// Define the shape of the context
interface Apollon2ContextType {
  apollon2?: Apollon2
  diagramName: string
  setDiagramName: React.Dispatch<React.SetStateAction<string>>
}

// Create the context with a default value of null
const Apollon2Context = createContext<Apollon2ContextType | undefined>(
  undefined
)

// Create a custom hook for consuming the context
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

// Create the provider component
export const Apollon2Provider: React.FC<Props> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [apollon2, setApollon2] = useState<Apollon2>()
  const [diagramName, setDiagramName] = useState("Default Diagram")

  useEffect(() => {
    if (containerRef.current && !apollon2) {
      // Initialize Apollon2 with the container div
      const instance = new Apollon2(containerRef.current)
      setApollon2(instance)
    }

    // Cleanup on unmount
    return () => {
      if (apollon2) {
        console.log("Disposing Apollon2")
        apollon2.dispose()
      }
    }
  }, [apollon2])

  return (
    <Apollon2Context.Provider value={{ apollon2, diagramName, setDiagramName }}>
      <div
        style={{ display: "flex", flexDirection: "column", height: "100vh" }}
      >
        {children}
        <div ref={containerRef} style={{ flex: 1 }} />
      </div>
    </Apollon2Context.Provider>
  )
}
