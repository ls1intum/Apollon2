import React, { useEffect, useRef } from "react"
import { ApollonEditor, UMLDiagramType } from "@tumaet/apollon"
import { useEditorContext } from "@/contexts"
import { useLocation } from "react-router"

const UMLDiagramTypes = Object.values(UMLDiagramType)

export const ApollonLocal: React.FC = () => {
  const { setEditor } = useEditorContext()
  const location = useLocation()
  const createdAt = location.state?.createdAt
  const newDiagramTitle = location.state?.newDiagramTitle
  const selectedDiagramType = location.state?.selectedDiagramType
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (containerRef.current) {
      const instance = new ApollonEditor(containerRef.current)
      if (newDiagramTitle) {
        instance.updateDiagramTitle(newDiagramTitle)
      } else {
        instance.updateDiagramTitle("Class Diagram")
      }
      if (UMLDiagramTypes.includes(selectedDiagramType)) {
        instance.diagramType = selectedDiagramType as UMLDiagramType
      }
      setEditor(instance)

      return () => {
        instance.dispose()
      }
    }
  }, [newDiagramTitle, createdAt, setEditor])

  return <div className="flex grow min-h-20 min-w-20" ref={containerRef} />
}
