import React, { useEffect, useRef } from "react"
import { Apollon2 } from "@apollon2/library"
import { useApollon2Context } from "@/contexts"

export const Apollon: React.FC = () => {
  const { setApollon2 } = useApollon2Context()
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (containerRef.current) {
      const instance = new Apollon2(containerRef.current)
      setApollon2(instance)

      return () => {
        instance.dispose()
      }
    }
  }, [setApollon2])

  return <div className="flex grow min-h-20 min-w-20" ref={containerRef} />
}
