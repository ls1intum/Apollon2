import { useRef, useLayoutEffect } from "react"
import { Apollon2 } from "@apollon2/library"

export function LibraryView() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const apollon2Ref = useRef<Apollon2 | null>(null)

  useLayoutEffect(() => {
    if (containerRef.current) {
      apollon2Ref.current = new Apollon2(containerRef.current)

      console.log(
        "Random number from Apollon2:",
        apollon2Ref.current.getRandomNumber()
      )
    }

    return () => {
      console.log("Disposing Apollon2")
      if (apollon2Ref.current) {
        apollon2Ref.current.dispose()
        apollon2Ref.current = null
      }
    }
  }, [])

  return <div ref={containerRef} />
}
