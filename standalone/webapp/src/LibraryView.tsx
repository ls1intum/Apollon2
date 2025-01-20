import { useRef, useLayoutEffect } from "react"
import { Apollon2 } from "@apollon2/library"
import { Navbar } from "@/components"
import "@xyflow/react/dist/style.css"

export function LibraryView() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const apollon2Ref = useRef<Apollon2 | null>(null)

  useLayoutEffect(() => {
    if (containerRef.current) {
      apollon2Ref.current = new Apollon2(containerRef.current)
    }

    return () => {
      console.log("Disposing Apollon2")
      if (apollon2Ref.current) {
        apollon2Ref.current.dispose()
        apollon2Ref.current = null
      }
    }
  }, [])

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Navbar />
      <div ref={containerRef} style={{ flex: 1 }} />
    </div>
  )
}
