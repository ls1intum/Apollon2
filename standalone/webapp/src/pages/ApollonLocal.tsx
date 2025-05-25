import { usePersistenceModelStore } from "@/stores/usePersistenceModelStore"
import { useEditorContext } from "@/contexts"
import { ApollonEditor, UMLDiagramType } from "@tumaet/apollon"
import React, { useEffect, useRef } from "react"

export const ApollonLocal: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const { setEditor } = useEditorContext()

  const currentModelId = usePersistenceModelStore(
    (store) => store.currentModelId
  )
  const diagram = usePersistenceModelStore((store) =>
    currentModelId ? store.models[currentModelId] : null
  )
  const createModel = usePersistenceModelStore((store) => store.createModel)
  const updateModel = usePersistenceModelStore((store) => store.updateModel)

  useEffect(() => {
    if (!diagram && containerRef.current) {
      // Create a default diagram on first visit
      createModel("Class Diagram", UMLDiagramType.ClassDiagram)
      return
    }

    if (!containerRef.current || !diagram) return

    const instance = new ApollonEditor(containerRef.current, {
      model: diagram.model,
    })

    instance.subscribeToModelChange((model) => {
      updateModel(model)
    })

    setEditor(instance)

    return () => {
      console.log("Cleaning up Apollon2 instance")
      instance.destroy()
    }
  }, [diagram?.id])

  return <div className="flex grow" ref={containerRef} />
}
