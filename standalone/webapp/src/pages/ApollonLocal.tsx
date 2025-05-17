import React, { useEffect, useRef } from "react"
import { Apollon2, UMLDiagramType } from "@apollon2/library"
import { useApollon2Context } from "@/contexts"
import { useLocation } from "react-router"

const UMLDiagramTypes = Object.values(UMLDiagramType)

export const ApollonLocal: React.FC = () => {
  const { setApollon2 } = useApollon2Context()
  const location = useLocation()
  const createdAt = location.state?.createdAt
  const newDiagramTitle = location.state?.newDiagramTitle
  const selectedDiagramType = location.state?.selectedDiagramType
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (containerRef.current) {
      const instance = new Apollon2(containerRef.current)
      if (newDiagramTitle) {
        instance.updateDiagramTitle(newDiagramTitle)
      } else {
        instance.updateDiagramTitle("Class Diagram")
      }
      if (UMLDiagramTypes.includes(selectedDiagramType)) {
        instance.diagramType = selectedDiagramType as UMLDiagramType
      }
      setApollon2(instance)

      return () => {
        instance.dispose()
      }
    }
  }, [newDiagramTitle, createdAt, setApollon2])

  return <div className="flex grow min-h-20 min-w-20" ref={containerRef} />
}
