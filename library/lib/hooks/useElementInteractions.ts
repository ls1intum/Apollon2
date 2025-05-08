import { usePopoverStore } from "@/store/context"
import { NodeMouseHandler, OnBeforeDelete, type Node } from "@xyflow/react"
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
  return {
    onBeforeDelete,
    onNodeDoubleClick,
  }
}
