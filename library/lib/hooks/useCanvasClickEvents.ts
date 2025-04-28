import { useDiagramStore } from "@/store/context"
import { useCallback, MouseEvent } from "react"
import { useShallow } from "zustand/shallow"
import { type Node, type Edge } from "@xyflow/react"

export const useCanvasClickEvents = () => {
  const { interactiveElementId, setInteractiveElementId } = useDiagramStore(
    useShallow((state) => ({
      interactiveElementId: state.interactiveElementId,
      setInteractiveElementId: state.setInteractiveElementId,
    }))
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
    if (interactiveElementId) {
      setInteractiveElementId(null)
    }
  }, [interactiveElementId, setInteractiveElementId])

  const onNodeDrag = useCallback(
    (_event: MouseEvent, node: Node) => {
      if (node.id !== interactiveElementId) {
        setInteractiveElementId(node.id)
      }
    },
    [setInteractiveElementId]
  )

  return {
    onNodeClick,
    onEdgeClick,
    onPaneClick,
    onNodeDrag,
  }
}
