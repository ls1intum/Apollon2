import { useDiagramStore, usePopoverStore } from "@/store/context"
import {
  NodeMouseHandler,
  OnBeforeDelete,
  type Node,
  type Edge,
  EdgeMouseHandler,
} from "@xyflow/react"
import { useShallow } from "zustand/shallow"
import { useDiagramModifiable } from "./useDiagramModifiable"

export const useElementInteractions = () => {
  const isDiagramModifiable = useDiagramModifiable()
  const { setPopOverElementId } = usePopoverStore(
    useShallow((state) => ({
      setPopOverElementId: state.setPopOverElementId,
    }))
  )
  const { setInteractiveElementId } = useDiagramStore(
    useShallow((state) => ({
      setInteractiveElementId: state.setInteractiveElementId,
    }))
  )

  const onBeforeDelete: OnBeforeDelete = () => {
    if (isDiagramModifiable) {
      return new Promise((resolve) => resolve(true))
    }
    return new Promise((resolve) => resolve(false))
  }

  const onNodeDoubleClick: NodeMouseHandler<Node> = (_event, node) => {
    setInteractiveElementId(node.id)
    setPopOverElementId(node.id)
  }

  const onEdgeDoubleClick: EdgeMouseHandler<Edge> = (_event, edge) => {
    setInteractiveElementId(edge.id)
    setPopOverElementId(edge.id)
  }
  return {
    onBeforeDelete,
    onNodeDoubleClick,
    onEdgeDoubleClick,
  }
}
