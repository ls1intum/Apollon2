import { useRef, useLayoutEffect, useState } from "react"
import { Apollon2 } from "@apollon2/library"
import { Navbar } from "@/components"
import "@xyflow/react/dist/style.css"

export function LibraryView() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [apollon2, setApollon2] = useState<Apollon2>()

  useLayoutEffect(() => {
    if (containerRef.current) {
      const instance = new Apollon2(containerRef.current)
      setApollon2(instance)
    }

    return () => {
      console.log("Disposing Apollon2")
      if (apollon2) {
        apollon2.dispose()
      }
    }
  }, [])

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Navbar apollon2={apollon2} />
      <div ref={containerRef} style={{ flex: 1 }} />
    </div>
  )
}
