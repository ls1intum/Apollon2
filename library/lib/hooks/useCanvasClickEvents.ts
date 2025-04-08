import { useBoundStore } from "@/store"
import { useCallback, MouseEvent } from "react"
import { useShallow } from "zustand/shallow"
import { type Node, type Edge } from "@xyflow/react"

export const useCanvasClickEvents = () => {
  const setInteractiveElementId = useBoundStore(
    useShallow((state) => state.setInteractiveElementId)
  )

  const onNodeClick = useCallback(
    (_: MouseEvent, node: Node) => {
      setInteractiveElementId(node.id)
    },
    [setInteractiveElementId]
  )

  const onEdgeClick = useCallback(
    (_: MouseEvent, edge: Edge) => {
      setInteractiveElementId(edge.id)
    },
    [setInteractiveElementId]
  )

  const onPaneClick = useCallback(() => {
    setInteractiveElementId(null)
  }, [setInteractiveElementId])

  return {
    onNodeClick,
    onEdgeClick,
    onPaneClick,
  }
}
