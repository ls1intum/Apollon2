import { useMetadataStore } from "@/store"
import { ApollonMode } from "@/typings"
import { useMemo } from "react"
import { useShallow } from "zustand/shallow"

export const useDiagramModifiable = () => {
  const { readonlyDiagram, diagramMode } = useMetadataStore(
    useShallow((state) => ({
      readonlyDiagram: state.readonly,
      diagramMode: state.mode,
    }))
  )

  const isDiagramUpdatable = useMemo(
    () => diagramMode === ApollonMode.Modelling && !readonlyDiagram,
    [diagramMode, readonlyDiagram]
  )

  return isDiagramUpdatable
}
