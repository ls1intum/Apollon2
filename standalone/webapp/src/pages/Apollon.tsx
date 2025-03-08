import React, { useEffect, useRef } from "react"
import { useApollon2Context } from "@/contexts"
import { Apollon2 } from "@apollon2/library"

export const Apollon: React.FC = () => {
  const { apollon2, setApollon2 } = useApollon2Context()
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (containerRef.current && !apollon2) {
      const instance = new Apollon2(containerRef.current)
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
