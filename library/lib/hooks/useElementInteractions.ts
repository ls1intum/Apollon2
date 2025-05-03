import { useMetadataStore } from "@/store"
import { ApollonMode } from "@/types"
import { OnBeforeDelete } from "@xyflow/react"
import { useShallow } from "zustand/shallow"

export const useElementInteractions = () => {
  const { readonlyDiagram, diagramMode } = useMetadataStore(
    useShallow((state) => ({
      readonlyDiagram: state.readonly,
      diagramMode: state.mode,
    }))
  )

  const onBeforeDelete: OnBeforeDelete = () => {
    if (readonlyDiagram) {
      return new Promise((resolve) => resolve(false))
    }
    if (diagramMode === ApollonMode.Assessment) {
      return new Promise((resolve) => resolve(false))
    }
    return new Promise((resolve) => resolve(true))
  }

  return {
    onBeforeDelete,
  }
}
