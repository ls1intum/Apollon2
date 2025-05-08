import { useMetadataStore } from "@/store"
import { usePopoverStore } from "@/store/context"
import { ApollonMode } from "@/types"
import { NodeMouseHandler, OnBeforeDelete, type Node } from "@xyflow/react"
import { useShallow } from "zustand/shallow"

export const useElementInteractions = () => {
  const { readonlyDiagram, diagramMode } = useMetadataStore(
    useShallow((state) => ({
      readonlyDiagram: state.readonly,
      diagramMode: state.mode,
    }))
  )
  const { setPopOverElementId } = usePopoverStore(
    useShallow((state) => ({
      setPopOverElementId: state.setPopOverElementId,
    }))
  )

  const isDiagramUpdatable =
    diagramMode === ApollonMode.Modelling && !readonlyDiagram

  const onBeforeDelete: OnBeforeDelete = () => {
    if (isDiagramUpdatable) {
      return new Promise((resolve) => resolve(true))
    }
    return new Promise((resolve) => resolve(false))
  }

  const onNodeDoubleClick: NodeMouseHandler<Node> = (_event, node) => {
    console.log("Node double clicked:", node)
    setPopOverElementId(node.id)
  }
  return {
    isDiagramUpdatable,
    onBeforeDelete,
    onNodeDoubleClick,
  }
}
