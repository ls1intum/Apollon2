import React, { useEffect, useRef } from "react"
import { useApollon2Context } from "@/contexts"
import { Apollon2 } from "@apollon2/library"
import { useParams } from "react-router"

export const ApollonWithCollaboration: React.FC = () => {
  const { apollon2, setApollon2 } = useApollon2Context()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const { diagramId } = useParams()

  useEffect(() => {
    if (containerRef.current && !apollon2 && diagramId) {
      const instance = new Apollon2(containerRef.current)
      instance.makeWebsocketConnection("ws://localhost:4444", diagramId)
      setApollon2(instance)
    }

    return () => {
      if (apollon2) {
        console.log("Disposing Apollon2")
        apollon2.dispose()
        setApollon2(undefined)
      }
    }
  }, [apollon2])

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <div style={{ flex: 1 }} ref={containerRef} />
    </div>
  )
}
