import { useRef, useLayoutEffect } from "react"
import { Apollon2 } from "@apollon2/library"
import "@xyflow/react/dist/style.css"

export function LibraryView() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const apollon2Ref = useRef<Apollon2 | null>(null)

  const onGetNodesButtonClick = () => {
    // To show that the getNodes method works
    if (apollon2Ref.current) {
      // console.log(JSON.stringify(apollon2Ref.current.getNodes()))
      console.log(apollon2Ref.current.getNodes())
    }
  }
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
    <>
      <button
        onClick={onGetNodesButtonClick}
        style={{ position: "absolute", top: "0", right: "0", zIndex: 1000 }}
      >
        Get Nodes
      </button>
      <div ref={containerRef} style={{ width: "100vw", height: "100vh" }} />
    </>
  )
}
