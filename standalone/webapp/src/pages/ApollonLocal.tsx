import { usePersistenceModelStore } from "@/components/stores/usePersistenceModelStore"
import { useApollon2Context } from "@/contexts"
import { Apollon2, UMLDiagramType } from "@apollon2/library"
import React, { useEffect, useRef } from "react"

export const ApollonLocal: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const { setApollon2 } = useApollon2Context()

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
      const id = createModel("Class Diagram", UMLDiagramType.ClassDiagram)
      console.log(`Created default diagram with ID: ${id}`)
      return
    }

    console.log("Creating Apollon2 instance")
    console.log("Diagram:", diagram)
    console.log("currentModelId:", currentModelId)

    if (!containerRef.current || !diagram) return

    const instance = new Apollon2(containerRef.current, {
      model: diagram.model,
    })

    instance.subscribeToModelChange((model) => {
      updateModel(model)
    })

    setApollon2(instance)

    return () => {
      console.log("Cleaning up Apollon2 instance")
      instance.dispose()
    }
  }, [diagram?.id])

  return <div className="flex grow" ref={containerRef} />
}
