import { usePopoverStore } from "@/store/context"
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

  const onBeforeDelete: OnBeforeDelete = () => {
    if (isDiagramModifiable) {
      return new Promise((resolve) => resolve(true))
    }
    return new Promise((resolve) => resolve(false))
  }

  const onNodeDoubleClick: NodeMouseHandler<Node> = (_event, node) => {
    setPopOverElementId(node.id)
  }

  const onEdgeDoubleClick: EdgeMouseHandler<Edge> = (_event, edge) => {
    setPopOverElementId(edge.id)
  }
  return {
    onBeforeDelete,
    onNodeDoubleClick,
    onEdgeDoubleClick,
  }
}
